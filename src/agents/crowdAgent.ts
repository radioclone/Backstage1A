import { BaseAgent } from './baseAgent';
import { AgentResponse, SceneContext } from '@/types/global';

/**
 * Crowd Agent that simulates festival attendees' reactions
 */
export class CrowdAgent extends BaseAgent {
  private energy: number = 0.5; // 0 to 1
  // Mood affects the agent's behavior and responses
  private mood: 'excited' | 'chill' | 'bored' = 'chill';
  private lastReaction: number = 0; // Timestamp of last reaction
  
  constructor(name: string = 'Festival Crowd') {
    super(name, 'crowd');
  }
  
  /**
   * Generate a response based on the current context
   */
  async interact(context: SceneContext): Promise<AgentResponse> {
    const { currentMusic, userCount, timestamp } = context;
    
    // Only react occasionally to avoid spamming the chat
    if (timestamp - this.lastReaction < 30000) { // At least 30 seconds between reactions
      return {
        message: this.createMessage('', 'system') // Empty system message
      };
    }
    
    // React to music
    if (currentMusic) {
      this.lastReaction = timestamp;
      
      // Use both energy and mood to determine the response
      if (this.energy > 0.7) {
        const message = this.mood === 'excited' 
          ? 'The crowd is going wild! 🔥🔥🔥' 
          : 'Everyone is feeling the energy!';
          
        return {
          message: this.createMessage(message),
          actions: [{
            type: 'crowd_reaction',
            payload: { reaction: 'cheering', intensity: this.energy, mood: this.mood }
          }]
        };
      } else if (this.energy > 0.3) {
        const message = this.mood === 'chill'
          ? 'People are grooving to the beat in a relaxed way.'
          : 'The crowd is steadily dancing along.';
          
        return {
          message: this.createMessage(message),
          actions: [{
            type: 'crowd_reaction',
            payload: { reaction: 'dancing', intensity: this.energy, mood: this.mood }
          }]
        };
      } else {
        const message = this.mood === 'bored'
          ? 'The crowd seems disinterested and low energy...'
          : 'The audience is quietly taking in the music.';
          
        return {
          message: this.createMessage(message),
          actions: [{
            type: 'crowd_reaction',
            payload: { reaction: 'swaying', intensity: this.energy, mood: this.mood }
          }]
        };
      }
    }
    
    // React to crowd size
    if (userCount > 15) {
      this.lastReaction = timestamp;
      this.energy = Math.min(1, this.energy + 0.1);
      
      return {
        message: this.createMessage(`The venue is packed with ${userCount} people! The energy is building!`),
        actions: [{
          type: 'crowd_reaction',
          payload: { reaction: 'growing', intensity: Math.min(userCount / 20, 1) }
        }]
      };
    } else if (userCount < 5) {
      this.lastReaction = timestamp;
      this.energy = Math.max(0, this.energy - 0.1);
      
      return {
        message: this.createMessage('Just a few early arrivals so far. The night is young!'),
        actions: [{
          type: 'crowd_reaction',
          payload: { reaction: 'sparse', intensity: 0.2 }
        }]
      };
    }
    
    // Default response - don't always need to say something
    return {
      message: this.createMessage('', 'system') // Empty system message
    };
  }
  
  /**
   * Update the crowd's mood based on events
   */
  updateMood(eventType: string): void {
    switch (eventType) {
      case 'drop':
        this.energy = Math.min(1, this.energy + 0.2);
        this.mood = 'excited';
        break;
      case 'ambient':
        this.energy = Math.max(0, this.energy - 0.1);
        this.mood = 'chill';
        break;
      case 'silence':
        this.energy = Math.max(0, this.energy - 0.3);
        this.mood = 'bored';
        break;
      case 'peak_time':
        this.energy = Math.min(1, this.energy + 0.1);
        this.mood = 'excited';
        break;
      default:
        // Random energy fluctuation
        this.energy += (Math.random() - 0.5) * 0.1;
        this.energy = Math.max(0, Math.min(1, this.energy));
    }
  }
}
