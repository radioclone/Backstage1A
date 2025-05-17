import { create } from 'zustand';
import { AuthState, SceneContext, AgentMessage, AudioTrack } from '@/types/global';

// Define the global state interface
interface GlobalState {
  // Authentication state
  auth: AuthState;
  setAuth: (auth: Partial<AuthState>) => void;
  
  // 3D scene state
  sceneContext: SceneContext;
  updateSceneContext: (context: Partial<SceneContext>) => void;
  
  // Chat messages
  messages: AgentMessage[];
  addMessage: (message: AgentMessage) => void;
  clearMessages: () => void;
  
  // Audio state
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  setCurrentTrack: (track: AudioTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  
  // Loading state
  isLoading: boolean;
  loadingProgress: number;
  loadingMessage: string;
  setLoading: (isLoading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setLoadingMessage: (message: string) => void;
}

// Create the store
const useStore = create<GlobalState>((set) => ({
  // Authentication state
  auth: {
    isAuthenticated: false,
    address: null,
    loading: false,
    error: null,
  },
  setAuth: (auth) => set((state) => ({ auth: { ...state.auth, ...auth } })),
  
  // 3D scene state
  sceneContext: {
    userCount: 0,
    activeAgents: [],
    sceneState: '3d-loading',
    timestamp: Date.now(),
  },
  updateSceneContext: (context) => 
    set((state) => ({ 
      sceneContext: { 
        ...state.sceneContext, 
        ...context,
        timestamp: Date.now() 
      } 
    })),
  
  // Chat messages
  messages: [],
  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, message].slice(-100) // Keep only last 100 messages
    })),
  clearMessages: () => set({ messages: [] }),
  
  // Audio state
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  
  // Loading state
  isLoading: true,
  loadingProgress: 0,
  loadingMessage: 'Initializing...',
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoadingMessage: (message) => set({ loadingMessage: message }),
}));

export default useStore;
