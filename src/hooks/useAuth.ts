import { useCallback } from 'react';
import AuthenticationService from '@/services/authService';
import useStore from '@/lib/stateManager';

/**
 * Custom hook for authentication functionality
 */
export function useAuth(): {
  isAuthenticated: boolean;
  address: string | null;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
  checkTokenGate: () => Promise<boolean>;
} {
  // Get auth state from global store
  const { auth } = useStore();

  // Log the auth state for debugging
  console.log('Auth State:', auth);

  
  // Get authentication service instance
  const authService = AuthenticationService.getInstance();
  
  // Connect wallet function
  const connectWallet = useCallback(async (): Promise<string | null> => {
    return await authService.connectWallet();
  }, [authService]);
  
  // Disconnect wallet function
  const disconnectWallet = useCallback(async (): Promise<void> => {
    await authService.disconnectWallet();
  }, [authService]);
  
  // Check token gate function
  const checkTokenGate = useCallback(async (): Promise<boolean> => {
    return await authService.checkTokenGate();
  }, [authService]);
  
  // Return auth state and functions
  return {
    isAuthenticated: auth.isAuthenticated,
    address: auth.address,
    loading: auth.loading,
    error: auth.error,
    connectWallet,
    disconnectWallet,
    checkTokenGate
  };
}
