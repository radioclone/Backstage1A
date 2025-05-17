'use client';

import { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

/**
 * Custom wrapper for Spline to avoid import issues
 */
export default function SplineWrapper({ scene, onLoad }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new Spline application
    const app = new Application(canvasRef.current);
    
    // Load the scene
    app.load(scene)
      .then(() => {
        // Call onLoad callback when scene is loaded
        if (onLoad && typeof onLoad === 'function') {
          onLoad(app);
        }
      })
      .catch(error => {
        console.error('Error loading Spline scene:', error);
      });

    // Store the app reference
    appRef.current = app;

    // Clean up on unmount
    return () => {
      if (appRef.current) {
        // Perform any necessary cleanup
        appRef.current = null;
      }
    };
  }, [scene, onLoad]);

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  );
}
