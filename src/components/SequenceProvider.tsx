'use client';

import { ReactNode, useEffect, useState } from 'react';
import { sequenceConfig } from '@/config/sequenceConfig';

interface SequenceProviderProps {
  children: ReactNode;
}

/**
 * Sequence Provider component for wallet integration
 * This is a placeholder implementation that will be replaced with actual Sequence SDK
 * when the dependencies are installed
 */
export default function SequenceProvider({ children }: SequenceProviderProps): JSX.Element {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initSequence = async (): Promise<void> => {
      try {
        // Check for project key and WaaS URL
        const projectKey = sequenceConfig.projectAccessKey;
        const waasUrl = sequenceConfig.waasUrl;
        
        if (!projectKey) {
          console.error('Sequence project key not found');
          return;
        }
        
        if (!waasUrl) {
          console.error('Sequence WaaS URL not found');
          return;
        }

        try {
          // Parse WaaS configuration
          const waasConfig = JSON.parse(atob(waasUrl));
          
          // Initialize Sequence SDK
          if (window.sequence) {
            await window.sequence.initWallet(projectKey, {
              defaultNetwork: 'soneium',
              transports: {
                walletAppURL: waasConfig.rpcServer,
                projectId: waasConfig.projectId.toString()
              },
              theme: {
                // Override Sequence's default theme to match our black and white style
                root: {
                  colors: {
                    primary: '#ffffff',
                    background: '#000000',
                    text: '#ffffff'
                  },
                  fonts: {
                    body: 'var(--font-mono)'
                  }
                }
              }
            });
            
            console.log('Sequence wallet initialized successfully');
          } else {
            console.warn('Sequence SDK not loaded');
          }
        } catch (error) {
          console.error('Failed to parse WaaS configuration:', error);
        }
        
        // Set initialized after a short delay to simulate loading
        setTimeout(() => {
          setInitialized(true);
        }, 500);
      } catch (error) {
        console.error('Failed to initialize Sequence:', error);
      }
    };

    if (typeof window !== 'undefined' && !initialized) {
      initSequence();
    }
  }, [initialized]);

  // Use state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Show loading state while initializing (only on client)
  if (isClient && !initialized) {
    return (
      <div className="sequence-initializing">
        <div className="loading-spinner"></div>
        <p>[ INITIALIZING WALLET ]</p>
        
        <style jsx>{`
          .sequence-initializing {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #000000;
            color: #ffffff;
            z-index: 9999;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #ffffff;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
