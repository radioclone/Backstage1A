import useStore from '@/lib/stateManager';
import { AudioTrack } from '@/types/global';

class AudioService {
  private static instance: AudioService;
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private visualizationDataArray: Uint8Array | null = null;
  private visualizationRequestId: number | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  /**
   * Initialize the Web Audio API context
   */
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      
      // Create nodes
      this.gainNode = this.audioContext.createGain();
      this.analyserNode = this.audioContext.createAnalyser();
      
      // Configure analyser
      this.analyserNode.fftSize = 256;
      const bufferLength = this.analyserNode.frequencyBinCount;
      this.visualizationDataArray = new Uint8Array(bufferLength);
      
      // Set initial volume
      this.setVolume(useStore.getState().volume);
      
      console.log('Audio context initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  /**
   * Load and play an audio track
   */
  public async loadTrack(track: AudioTrack): Promise<void> {
    if (!this.audioContext || !this.audioElement || !this.gainNode || !this.analyserNode) {
      console.error('Audio context not initialized');
      return;
    }

    try {
      // Update store
      useStore.getState().setCurrentTrack(track);
      useStore.getState().setLoadingMessage(`Loading track: ${track.title}`);
      
      // Reset audio element
      this.audioElement.pause();
      this.audioElement.src = track.url;
      
      // Wait for audio to load
      await new Promise<void>((resolve, reject) => {
        if (!this.audioElement) return reject('Audio element not initialized');
        
        this.audioElement.oncanplaythrough = () => resolve();
        this.audioElement.onerror = () => reject('Error loading audio');
        
        // Trigger load
        this.audioElement.load();
      });
      
      // Connect nodes if not already connected
      if (!this.sourceNode) {
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioContext.destination);
      }
      
      console.log(`Track loaded: ${track.title}`);
      useStore.getState().setLoadingMessage('');
    } catch (error) {
      console.error('Failed to load track:', error);
      useStore.getState().setLoadingMessage('Failed to load audio track');
    }
  }

  /**
   * Play the current track
   */
  public play(): void {
    if (!this.audioContext || !this.audioElement) {
      console.error('Audio context not initialized');
      return;
    }

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.audioElement.play()
      .then(() => {
        useStore.getState().setIsPlaying(true);
        console.log('Playback started');
      })
      .catch(error => {
        console.error('Failed to start playback:', error);
      });
  }

  /**
   * Pause the current track
   */
  public pause(): void {
    if (!this.audioElement) {
      console.error('Audio element not initialized');
      return;
    }

    this.audioElement.pause();
    useStore.getState().setIsPlaying(false);
    console.log('Playback paused');
  }

  /**
   * Set the volume
   */
  public setVolume(volume: number): void {
    if (!this.gainNode) {
      console.error('Gain node not initialized');
      return;
    }

    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    // Apply volume to gain node
    this.gainNode.gain.value = clampedVolume;
    
    // Update store
    useStore.getState().setVolume(clampedVolume);
    
    console.log(`Volume set to ${clampedVolume}`);
  }

  /**
   * Start audio visualization
   */
  public startVisualization(canvasElement: HTMLCanvasElement): void {
    if (!this.analyserNode || !this.visualizationDataArray) {
      console.error('Analyser not initialized');
      return;
    }

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) {
      console.error('Could not get canvas context');
      return;
    }

    // Stop any existing visualization
    this.stopVisualization();

    // Animation function
    const draw = (): void => {
      this.visualizationRequestId = requestAnimationFrame(draw);

      if (!this.analyserNode || !this.visualizationDataArray || !canvasCtx) return;

      // Get frequency data
      this.analyserNode.getByteFrequencyData(this.visualizationDataArray);

      // Clear canvas
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Draw visualization
      const barWidth = (canvasElement.width / this.visualizationDataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < this.visualizationDataArray.length; i++) {
        const barHeight = this.visualizationDataArray[i] / 2;

        // Use dynamic colors based on frequency
        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvasCtx.fillRect(x, canvasElement.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    // Start animation
    draw();
  }

  /**
   * Stop audio visualization
   */
  public stopVisualization(): void {
    if (this.visualizationRequestId !== null) {
      cancelAnimationFrame(this.visualizationRequestId);
      this.visualizationRequestId = null;
    }
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.stopVisualization();
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.sourceNode = null;
    this.gainNode = null;
    this.analyserNode = null;
    this.audioElement = null;
    this.audioContext = null;
    this.visualizationDataArray = null;
  }
}

export default AudioService;
