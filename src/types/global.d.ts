// Global type definitions

// Agent types
export interface AgentMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  type: 'text' | 'action' | 'system';
}

export interface Agent {
  id: string;
  name: string;
  role: 'dj' | 'crowd' | 'coordinator' | 'assistant';
  interact(context: SceneContext): Promise<AgentResponse>;
  updateMood(eventType: string): void;
}

export interface AgentResponse {
  message: AgentMessage;
  actions?: AgentAction[];
}

export interface AgentAction {
  type: 'suggest_track' | 'prepare_transition' | 'increase_energy' | 'crowd_reaction';
  payload: Record<string, unknown>;
}

// Scene context
export interface SceneContext {
  currentMusic?: AudioTrack;
  userCount: number;
  activeAgents: Agent[];
  sceneState: '3d-loading' | '3d-loaded' | 'error';
  timestamp: number;
}

// Audio types
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  bpm?: number;
}

// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  loading: boolean;
  error: string | null;
}

// 3D Environment types
export interface SceneObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

// Declare global window extensions
declare global {
  interface Window {
    ethereum?: any;
    sequence?: any;
  }
}
