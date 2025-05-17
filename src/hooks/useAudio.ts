import { useEffect, useCallback, useRef } from 'react';
import AudioService from '@/services/audioService';
import useStore from '@/lib/stateManager';
import { AudioTrack } from '@/types/global';

/**
 * Custom hook for audio functionality
 */
export function useAudio(): {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  loadTrack: (track: AudioTrack) => Promise<void>;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  startVisualization: (canvasElement: HTMLCanvasElement) => void;
  stopVisualization: () => void;
} {
  // Get audio state from global store
  const { currentTrack, isPlaying, volume } = useStore();
  
  // Get audio service instance
  const audioService = AudioService.getInstance();
  
  // Canvas ref for visualization
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Load track function
  const loadTrack = useCallback(async (track: AudioTrack): Promise<void> => {
    await audioService.loadTrack(track);
  }, [audioService]);
  
  // Play function
  const play = useCallback((): void => {
    audioService.play();
  }, [audioService]);
  
  // Pause function
  const pause = useCallback((): void => {
    audioService.pause();
  }, [audioService]);
  
  // Set volume function
  const setVolume = useCallback((newVolume: number): void => {
    audioService.setVolume(newVolume);
  }, [audioService]);
  
  // Start visualization function
  const startVisualization = useCallback((canvasElement: HTMLCanvasElement): void => {
    canvasRef.current = canvasElement;
    audioService.startVisualization(canvasElement);
  }, [audioService]);
  
  // Stop visualization function
  const stopVisualization = useCallback((): void => {
    audioService.stopVisualization();
  }, [audioService]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      audioService.stopVisualization();
    };
  }, [audioService]);
  
  // Return audio state and functions
  return {
    currentTrack,
    isPlaying,
    volume,
    loadTrack,
    play,
    pause,
    setVolume,
    startVisualization,
    stopVisualization
  };
}
