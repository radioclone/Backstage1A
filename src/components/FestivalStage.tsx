'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useStore from '@/lib/stateManager';
import LoadingScreen from './LoadingScreen';

// Dynamically import our custom SplineWrapper to avoid SSR issues
const SplineWrapper = dynamic(() => import('./SplineWrapper'), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
});

/**
 * Festival Stage component that renders the 3D environment
 */
export default function FestivalStage(): JSX.Element {
  // Get state from store
  const { 
    setLoading, 
    setLoadingMessage, 
    updateSceneContext 
  } = useStore();
  
  // Handle loading complete
  const handleLoadComplete = (): void => {
    setLoading(false);
    updateSceneContext({ sceneState: '3d-loaded' });
    console.log('3D scene loaded successfully');
  };
  
  // Handle Spline load
  const handleSplineLoad = (): void => {
    setLoadingMessage('3D environment loaded, initializing...');
    
    // Simulate additional loading time for other resources
    setTimeout(() => {
      handleLoadComplete();
    }, 1000);
  };
  
  // Initialize loading state
  useEffect(() => {
    setLoading(true);
    setLoadingMessage('Loading 3D environment...');
    updateSceneContext({ sceneState: '3d-loading' });
    
    // Clean up on unmount
    return () => {
      setLoading(false);
    };
  }, [setLoading, setLoadingMessage, updateSceneContext]);
  
  return (
    <>
      <LoadingScreen onLoadComplete={handleLoadComplete} />
      
      <div className="festival-stage">
        <SplineWrapper
          scene="https://prod.spline.design/Ua2aBq02T9ibTEKg/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>
      
      <style jsx>{`
        .festival-stage {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      `}</style>
    </>
  );
}
