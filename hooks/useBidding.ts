import { useState } from 'react';
import { auctionAPI, APIError } from '@/lib/api';
import { useAuth } from './useAuth';
import { captureError, captureMessage } from '@/lib/sentry';

interface UseBiddingState {
  loading: boolean;
  error: string | null;
}

export function useBidding() {
  const { user } = useAuth();
  const [state, setState] = useState<UseBiddingState>({
    loading: false,
    error: null,
  });

  const placeBid = async (auctionItemId: string, amount: number): Promise<boolean> => {
    if (!user) {
      setState({ loading: false, error: 'Please log in to place bids' });
      return false;
    }

    try {
      setState({ loading: true, error: null });

      await auctionAPI.placeBid({
        auctionItemId,
        amount,
        userId: user.id,
      });

      captureMessage(`Bid placed successfully: ${amount} on ${auctionItemId}`, 'info');
      setState({ loading: false, error: null });
      return true;
    } catch (error) {
      let errorMessage = 'Failed to place bid';
      
      if (error instanceof APIError) {
        switch (error.code) {
          case 'BID_RATE_LIMIT':
            errorMessage = 'You are bidding too frequently. Please wait a moment.';
            break;
          case 'INVALID_BID_AMOUNT':
            errorMessage = 'Your bid must be higher than the current bid.';
            break;
          case 'INSUFFICIENT_CONNECTS':
            errorMessage = 'You don\'t have enough Connects for this bid.';
            break;
          case 'AUCTION_NOT_FOUND':
            errorMessage = 'This auction is no longer available.';
            break;
          default:
            errorMessage = error.message;
        }
      }

      setState({ loading: false, error: errorMessage });
      captureError(error as Error, { 
        context: 'placeBid', 
        auctionItemId, 
        amount, 
        userId: user.id 
      });
      return false;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    placeBid,
    clearError,
  };
}