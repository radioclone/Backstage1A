'use client';

import { useEffect } from 'react';
import useStore from '@/lib/stateManager';
import LoadingAds from './LoadingAds';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
}

/**
 * Loading screen component with progress indicator
 */
export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps): JSX.Element {
  // Get loading state from store
  const { isLoading, loadingProgress, loadingMessage, setLoadingProgress } = useStore();
  
  // Simulate loading progress
  useEffect(() => {
    if (!isLoading) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Notify parent component when loading is complete
        if (onLoadComplete) {
          setTimeout(() => {
            onLoadComplete();
          }, 500); // Short delay for visual effect
        }
      }
      
      setLoadingProgress(progress);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isLoading, setLoadingProgress, onLoadComplete]);
  
  // Don't render if not loading
  if (!isLoading) return <></>;
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1>BACKSPACE FESTIVAL</h1>
        <div className="loading-bar-container">
          <div 
            className="loading-bar" 
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="loading-percentage">{Math.round(loadingProgress)}%</p>
        {loadingMessage && <p className="loading-message">{loadingMessage}</p>}
        <LoadingAds />
      </div>
      
      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000000;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          color: white;
          font-family: monospace;
        }
        
        .loading-content {
          text-align: center;
          width: 80%;
          max-width: 500px;
        }
        
        h1 {
          font-size: var(--font-size-normal);
          margin-bottom: 1rem;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .loading-bar-container {
          width: 100%;
          height: 2px;
          background-color: rgba(255, 255, 255, 0.1);
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .loading-bar {
          height: 100%;
          background: #ffffff;
          transition: width 0.3s ease;
        }
        
        .loading-percentage {
          font-size: var(--font-size-small);
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }
        
        .loading-message {
          font-size: var(--font-size-small);
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
