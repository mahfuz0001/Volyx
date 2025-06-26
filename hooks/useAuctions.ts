import { useState, useEffect } from 'react';
import { auctionAPI, APIError } from '@/lib/api';
import { SanityAuctionItem } from '@/lib/sanity';
import { captureError } from '@/lib/sentry';

interface UseAuctionsState {
  auctions: SanityAuctionItem[];
  hotAuctions: SanityAuctionItem[];
  featuredAuctions: SanityAuctionItem[];
  endingSoon: SanityAuctionItem[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export function useAuctions() {
  const [state, setState] = useState<UseAuctionsState>({
    auctions: [],
    hotAuctions: [],
    featuredAuctions: [],
    endingSoon: [],
    loading: true,
    error: null,
    refreshing: false,
  });

  const fetchAuctions = async (isRefresh = false) => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: !isRefresh, 
        refreshing: isRefresh,
        error: null 
      }));

      const [allAuctions, hotAuctions, featuredAuctions, endingSoon] = await Promise.all([
        auctionAPI.getAll(),
        auctionAPI.getHot(),
        auctionAPI.getFeatured(),
        auctionAPI.getEndingSoon(),
      ]);

      setState(prev => ({
        ...prev,
        auctions: allAuctions,
        hotAuctions,
        featuredAuctions,
        endingSoon,
        loading: false,
        refreshing: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof APIError 
        ? error.message 
        : 'Failed to load curated auctions';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        refreshing: false,
      }));

      captureError(error as Error, { context: 'useAuctions' });
    }
  };

  const refresh = () => fetchAuctions(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  return {
    ...state,
    refresh,
  };
}

export function useAuctionItem(id: string) {
  const [state, setState] = useState<{
    auction: SanityAuctionItem | null;
    bidHistory: any[];
    loading: boolean;
    error: string | null;
  }>({
    auction: null,
    bidHistory: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const [auction, bidHistory] = await Promise.all([
          auctionAPI.getById(id),
          auctionAPI.getBidHistory(id),
        ]);
        
        setState({
          auction,
          bidHistory,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = error instanceof APIError 
          ? error.message 
          : 'Failed to load auction details';
        
        setState({
          auction: null,
          bidHistory: [],
          loading: false,
          error: errorMessage,
        });

        captureError(error as Error, { context: 'useAuctionItem', auctionId: id });
      }
    };

    if (id) {
      fetchAuction();
    }
  }, [id]);

  return state;
}