import { BaseAgent } from './baseAgent';
import { AgentResponse, SceneContext } from '@/types/global';

/**
 * DJ Agent responsible for music selection and crowd interaction
 */
export class DJAgent extends BaseAgent {
  private mood: 'energetic' | 'chill' | 'intense' = 'chill';
  private trackSuggestions: string[] = [
    'Deep House Vibes',
    'Techno Beats',
    'Ambient Soundscapes',
    'Progressive Journey',
    'Festival Anthems'
  ];
  
  constructor(name: string = 'DJ Retroverse') {
    super(name, 'dj');
  }
  
  /**
   * Generate a response based on the current context
   */
  async interact(context: SceneContext): Promise<AgentResponse> {
    // Determine what kind of response to generate based on context
    const { currentMusic, userCount, timestamp } = context;
    
    // If no music is playing, suggest a track
    if (!currentMusic) {
      const suggestion = this.suggestTrack();
      return {
        message: this.createMessage(`Hey festival people! Let's kick things off with some ${suggestion}!`),
        actions: [{
          type: 'suggest_track',
          payload: { suggestion }
        }]
      };
    }
    
    // If music is playing, comment on it based on mood
    // Use the current timestamp to simulate how long the track has been playing
    const timePlaying = Math.floor((timestamp - (timestamp - 60000)) / 1000); // Assume playing for ~1 minute
    
    if (timePlaying > 60 && Math.random() > 0.7) {
      // Occasionally suggest a transition
      const nextSuggestion = this.suggestTrack();
      return {
        message: this.createMessage(`This ${currentMusic.title} is ${this.getMoodDescription()}, but I'm thinking of transitioning to some ${nextSuggestion} soon!`),
        actions: [{
          type: 'prepare_transition',
          payload: { current: currentMusic.title, next: nextSuggestion }
        }]
      };
    }
    
    // React to crowd size
    if (userCount > 10) {
      return {
        message: this.createMessage(`Wow, the crowd is getting huge! ${userCount} people in the house! Let's take the energy up!`),
        actions: [{
          type: 'increase_energy',
          payload: { level: Math.min(userCount / 20, 1) }
        }]
      };
    }
    
    // Default response
    return {
      message: this.createMessage(`Feeling the ${this.mood} vibes with ${currentMusic.title}! Keep the festival energy going!`)
    };
  }
  
  /**
   * Update the agent's mood based on events
   */
  updateMood(eventType: string): void {
    switch (eventType) {
      case 'crowd_cheering':
        this.mood = 'energetic';
        break;
      case 'late_night':
        this.mood = 'chill';
        break;
      case 'peak_time':
        this.mood = 'intense';
        break;
      default:
        // Random mood change occasionally
        if (Math.random() > 0.8) {
          const moods: ('energetic' | 'chill' | 'intense')[] = ['energetic', 'chill', 'intense'];
          this.mood = moods[Math.floor(Math.random() * moods.length)];
        }
    }
  }
  
  /**
   * Get a description based on current mood
   */
  private getMoodDescription(): string {
    switch (this.mood) {
      case 'energetic':
        return 'pumping the crowd up';
      case 'chill':
        return 'creating a nice atmosphere';
      case 'intense':
        return 'taking us on a journey';
      default:
        return 'sounding great';
    }
  }
  
  /**
   * Suggest a track based on current mood
   */
  private suggestTrack(): string {
    // In a real implementation, this would use more sophisticated logic
    // based on crowd reactions, time of day, etc.
    return this.trackSuggestions[Math.floor(Math.random() * this.trackSuggestions.length)];
  }
}
