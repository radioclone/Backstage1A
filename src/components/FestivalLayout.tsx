'use client';

import { useState, useEffect } from 'react';
import FestivalStage from './FestivalStage';
import ChatInterface from './ChatInterface';
import AudioPlayer from './AudioPlayer';
import WalletConnection from './WalletConnection';
import useStore from '@/lib/stateManager';

/**
 * Main layout component that brings everything together
 */
export default function FestivalLayout(): JSX.Element {
  // Get state from store
  const { updateSceneContext } = useStore();
  
  // Local state
  const [showFestival, setShowFestival] = useState(false);
  
  // Update user count in scene context
  useEffect(() => {
    // In a real implementation, this would be updated from a WebSocket connection
    const mockUserCount = Math.floor(Math.random() * 20) + 1;
    
    updateSceneContext({
      userCount: mockUserCount
    });
    
    const interval = setInterval(() => {
      const newUserCount = Math.floor(Math.random() * 20) + 1;
      
      updateSceneContext({
        userCount: newUserCount
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [updateSceneContext]);
  
  // Handle authentication success
  const handleAuthenticated = (): void => {
    setShowFestival(true);
  };
  
  return (
    <div className="festival-layout">
      <WalletConnection onAuthenticated={handleAuthenticated} />
      
      {showFestival || process.env.NODE_ENV === 'development' ? (
        <>
          <FestivalStage />
          <ChatInterface />
          <AudioPlayer />
        </>
      ) : (
        <div className="auth-required">
          <div className="auth-message">
            <h1>BACKSPACE FESTIVAL</h1>
            <p>Deeper Underground.TechnO Orbs</p>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .festival-layout {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .auth-required {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000000;
          color: #ffffff;
        }
        
        .auth-message {
          text-align: center;
          padding: 20px;
          font-family: monospace;
        }
        
        .auth-message h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #ffffff;
          font-weight: bold;
          letter-spacing: 2px;
        }
        
        .auth-message p {
          font-size: 1.2rem;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
