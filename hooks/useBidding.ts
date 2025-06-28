import { useState } from 'react';
import { auctionAPI, APIError } from '@/lib/api';
import { useAuth } from './useAuth';

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

  const placeBid = async (
    auctionItemId: string,
    amount: number
  ): Promise<boolean> => {
    if (!user) {
      setState({ loading: false, error: 'Please log in to place bids' });
      return false;
    }

    try {
      setState({ loading: true, error: null });

      // You may want to replace the following with actual device fingerprint and IP address retrieval logic
      const deviceFingerprint = window.navigator.userAgent || 'unknown-device';
      const ipAddress = ''; // You should fetch the real IP address from your backend or a service

      await auctionAPI.placeBid({
        auctionItemId,
        amount,
        userId: user.id,
        deviceFingerprint,
        ipAddress,
      });
      setState({ loading: false, error: null });
      return true;
    } catch (error) {
      let errorMessage = 'Failed to place bid';

      if (error instanceof APIError) {
        switch (error.code) {
          case 'BID_RATE_LIMIT':
            errorMessage =
              'You are bidding too frequently. Please wait a moment.';
            break;
          case 'INVALID_BID_AMOUNT':
            errorMessage = 'Your bid must be higher than the current bid.';
            break;
          case 'INSUFFICIENT_CONNECTS':
            errorMessage = "You don't have enough Connects for this bid.";
            break;
          case 'AUCTION_NOT_FOUND':
            errorMessage = 'This auction is no longer available.';
            break;
          default:
            errorMessage = error.message;
        }
      }

      setState({ loading: false, error: errorMessage });
      return false;
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...state,
    placeBid,
    clearError,
  };
}
