import { BaseAgent } from './baseAgent';
import { AgentResponse, SceneContext } from '@/types/global';
import { mockTracks } from '@/components/AudioPlayer'; // Import track list

/**
 * DJ Agent responsible for music selection and crowd interaction
 */
export class DJAgent extends BaseAgent {
  private mood: 'energetic' | 'chill' | 'intense' = 'chill';
  private trackSuggestions = mockTracks.map((track) => track.title); // Use track titles from AudioPlayer

  constructor(name: string = 'DJ MVP') {
    super(name, 'dj');
  }

  /**
   * Generate a response based on the current context
   */
  async interact(context: SceneContext): Promise<AgentResponse> {
    const { currentMusic, userCount, timestamp } = context;

    if (!currentMusic) {
      const suggestion = this.suggestTrack();
      return {
        message: this.createMessage(`Are you ready for some noise? ${suggestion}!`),
        actions: [{
          type: 'suggest_track',
          payload: { suggestion }
        }]
      };
    }

    const timePlaying = Math.floor((timestamp - (timestamp - 60000)) / 1000);

    if (timePlaying > 60 && Math.random() > 0.7) {
      const nextSuggestion = this.suggestTrack();
      return {
        message: this.createMessage(`This ${currentMusic.title} is ${this.getMoodDescription()}, but I'm thinking of transitioning to some ${nextSuggestion} soon!`),
        actions: [{
          type: 'prepare_transition',
          payload: { current: currentMusic.title, next: nextSuggestion }
        }]
      };
    }

    if (userCount > 10) {
      return {
        message: this.createMessage(`Wow, the crowd is getting huge! ${userCount} people in the house! Let's take the energy up!`),
        actions: [{
          type: 'increase_energy',
          payload: { level: Math.min(userCount / 20, 1) }
        }]
      };
    }

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
    return this.trackSuggestions[Math.floor(Math.random() * this.trackSuggestions.length)];
  }
}