'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface WalletConnectionProps {
  onAuthenticated?: () => void;
}

/**
 * Wallet connection component for authentication and token gating
 */
export default function WalletConnection({ onAuthenticated }: WalletConnectionProps): JSX.Element {
  // Get auth functionality
  const { 
    isAuthenticated, 
    address, 
    loading, 
    error, 
    connectWallet, 
    disconnectWallet,
    checkTokenGate
  } = useAuth();
  
  // Local state
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(false);
  
  // Check token gate when authenticated
  useEffect(() => {
    if (isAuthenticated && address) {
      checkAccess();
    } else {
      setHasAccess(null);
    }
  }, [isAuthenticated, address]);
  
  // Notify parent when authenticated and has access
  useEffect(() => {
    if (isAuthenticated && hasAccess && onAuthenticated) {
      onAuthenticated();
    }
  }, [isAuthenticated, hasAccess, onAuthenticated]);
  
  // Handle connect button click
  const handleConnect = async (): Promise<void> => {
    await connectWallet();
  };
  
  // Handle disconnect button click
  const handleDisconnect = async (): Promise<void> => {
    await disconnectWallet();
  };
  
  // Check if user has access
  const checkAccess = async (): Promise<void> => {
    setCheckingAccess(true);
    
    try {
      const access = await checkTokenGate();
      setHasAccess(access);
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    } finally {
      setCheckingAccess(false);
    }
  };
  
  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Render based on authentication state
  if (!isAuthenticated) {
    return (
      <div className="wallet-connection">
        {/* 
          Note: In a production implementation with the actual Sequence SDK,
          this button would trigger the Sequence modal UI rather than
          implementing a custom UI. The Sequence SDK provides a complete
          authentication flow UI.
        */}
        {/* 
          This button is styled to match the black and white theme.
          When clicked, it will trigger the Sequence auth UI to pop out.
        */}
        <button 
          className="connect-button" 
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
        
        <style jsx>{`
          .wallet-connection {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
          }
          
          .connect-button {
            background-color: transparent;
            color: #ffffff;
            border: 1px solid #ffffff;
            border-radius: var(--border-radius);
            padding: 8px 16px;
            font-family: var(--font-mono);
            font-size: var(--font-size-small);
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .connect-button:hover {
            background-color: #ffffff;
            color: #000000;
          }
          
          .connect-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            border-color: rgba(255, 255, 255, 0.5);
          }
          
          .error-message {
            color: #ff3e3e;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }
  
  // Render when authenticated
  return (
    <div className="wallet-connection">
      <div className="wallet-info">
        <div className="address">
          {formatAddress(address || '')}
        </div>
        
        <div className="access-status">
          {checkingAccess ? (
            'Checking access...'
          ) : hasAccess ? (
            <span className="has-access">✓ Access Granted</span>
          ) : (
            <span className="no-access">✗ No Access</span>
          )}
        </div>
        
        <button 
          className="disconnect-button" 
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
      
      <style jsx>{`
        .wallet-connection {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 100;
        }
        
        .wallet-info {
          background-color: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--border-radius);
          padding: 8px;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: var(--font-mono);
          font-size: var(--font-size-small);
        }
        
        .address {
          font-family: var(--font-mono);
          font-size: var(--font-size-small);
          margin-bottom: 4px;
          letter-spacing: 1px;
        }
        
        .access-status {
          margin-bottom: 8px;
          font-size: var(--font-size-small);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .has-access {
          color: #ffffff;
        }
        
        .no-access {
          color: #ffffff;
          opacity: 0.5;
        }
        
        .disconnect-button {
          background-color: transparent;
          color: #ffffff;
          border: 1px solid #ffffff;
          border-radius: var(--border-radius);
          padding: 4px 8px;
          font-family: var(--font-mono);
          font-size: var(--font-size-small);
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .disconnect-button:hover {
          background-color: #ffffff;
          color: #000000;
        }
      `}</style>
    </div>
  );
}
