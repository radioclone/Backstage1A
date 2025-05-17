import { Agent, AgentMessage, AgentResponse, SceneContext } from '@/types/global';

/**
 * Base agent class that all specific agents will extend
 */
export abstract class BaseAgent implements Agent {
  id: string;
  name: string;
  role: 'dj' | 'crowd' | 'coordinator' | 'assistant';
  
  constructor(name: string, role: 'dj' | 'crowd' | 'coordinator' | 'assistant') {
    this.id = crypto.randomUUID();
    this.name = name;
    this.role = role;
  }
  
  /**
   * Generate a response based on the current context
   * This method should be implemented by specific agent types
   */
  abstract interact(context: SceneContext): Promise<AgentResponse>;
  
  /**
   * Update the agent's mood based on events
   * This method should be implemented by specific agent types
   */
  abstract updateMood(eventType: string): void;
  
  /**
   * Create a message from this agent
   */
  protected createMessage(content: string, type: 'text' | 'action' | 'system' = 'text'): AgentMessage {
    return {
      id: crypto.randomUUID(),
      sender: this.name,
      content,
      timestamp: Date.now(),
      type
    };
  }
}
