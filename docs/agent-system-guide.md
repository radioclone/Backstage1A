# Agent System Guide for BACKSPACE FESTIVAL

This guide explains how the agent system works in the BACKSPACE FESTIVAL application and how you can develop and tweak it to create more sophisticated agent behaviors.

## Overview

The agent system is designed to provide interactive, AI-powered entities that can respond to the festival environment and user interactions. The current implementation includes:

1. **Base Agent Architecture**: An abstract base class that all agents extend
2. **DJ Agent**: A specific implementation that manages music selection and crowd interaction
3. **Agent Factory**: A singleton factory for creating and managing agents
4. **Agent Hooks**: React hooks for using agents in components

## Agent Architecture

### Base Agent (src/agents/baseAgent.ts)

The `BaseAgent` class provides the foundation for all agents:

```typescript
export abstract class BaseAgent implements Agent {
  id: string;
  name: string;
  role: 'dj' | 'crowd' | 'coordinator' | 'assistant';
  
  constructor(name: string, role: 'dj' | 'crowd' | 'coordinator' | 'assistant') {
    this.id = crypto.randomUUID();
    this.name = name;
    this.role = role;
  }
  
  abstract interact(context: SceneContext): Promise<AgentResponse>;
  abstract updateMood(eventType: string): void;
  
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
```

### DJ Agent (src/agents/djAgent.ts)

The `DJAgent` class extends `BaseAgent` and implements specific behaviors:

```typescript
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
  
  async interact(context: SceneContext): Promise<AgentResponse> {
    // Agent behavior logic here
  }
  
  updateMood(eventType: string): void {
    // Mood update logic here
  }
}
```

## How to Develop and Tweak the Agent System

### 1. Creating New Agent Types

To create a new agent type:

1. Create a new file in `src/agents/` (e.g., `crowdAgent.ts`)
2. Extend the `BaseAgent` class
3. Implement the required methods
4. Register the agent in the `AgentFactory`

Example of a new Crowd Agent:

```typescript
// src/agents/crowdAgent.ts
import { BaseAgent } from './baseAgent';
import { AgentResponse, SceneContext } from '@/types/global';

export class CrowdAgent extends BaseAgent {
  private energy: number = 0.5; // 0 to 1
  private mood: 'excited' | 'chill' | 'bored' = 'chill';
  
  constructor(name: string = 'Festival Crowd') {
    super(name, 'crowd');
  }
  
  async interact(context: SceneContext): Promise<AgentResponse> {
    const { currentMusic, userCount } = context;
    
    // React to music
    if (currentMusic) {
      if (this.energy > 0.7) {
        return {
          message: this.createMessage('The crowd is going wild! 🔥🔥🔥'),
          actions: [{
            type: 'crowd_reaction',
            payload: { reaction: 'cheering', intensity: this.energy }
          }]
        };
      } else if (this.energy > 0.3) {
        return {
          message: this.createMessage('People are grooving to the beat!'),
          actions: [{
            type: 'crowd_reaction',
            payload: { reaction: 'dancing', intensity: this.energy }
          }]
        };
      } else {
        return {
          message: this.createMessage('The crowd seems a bit low energy...'),
          actions: [{
            type: 'crowd_reaction',
            payload: { reaction: 'swaying', intensity: this.energy }
          }]
        };
      }
    }
    
    // Default response
    return {
      message: this.createMessage('The crowd is waiting for the music to start...')
    };
  }
  
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
      default:
        // Random energy fluctuation
        this.energy += (Math.random() - 0.5) * 0.1;
        this.energy = Math.max(0, Math.min(1, this.energy));
    }
  }
}
```

Then register it in the AgentFactory:

```typescript
// In src/agents/agentFactory.ts
private initializeDefaultAgents(): void {
  // Create DJ agent
  const djAgent = new DJAgent();
  this.registerAgent(djAgent);
  
  // Create Crowd agent
  const crowdAgent = new CrowdAgent();
  this.registerAgent(crowdAgent);
  
  console.log('Default agents initialized');
}
```

### 2. Enhancing Agent Behaviors

To make agents more sophisticated:

1. **Add State**: Give agents more internal state to track
2. **Improve Decision Making**: Add more complex logic to the `interact` method
3. **Add Memory**: Allow agents to remember past interactions
4. **Implement Learning**: Make agents adapt based on user feedback

Example of enhanced DJ Agent with memory:

```typescript
export class EnhancedDJAgent extends BaseAgent {
  private mood: 'energetic' | 'chill' | 'intense' = 'chill';
  private trackHistory: string[] = []; // Remember past tracks
  private crowdReactions: {track: string, reaction: number}[] = []; // Track crowd reactions
  
  // ... other methods
  
  async interact(context: SceneContext): Promise<AgentResponse> {
    // Use track history and crowd reactions to make better decisions
    const bestTracks = this.analyzeCrowdPreferences();
    // ... rest of logic
  }
  
  private analyzeCrowdPreferences(): string[] {
    // Analyze which tracks got the best reactions
    const trackScores = this.crowdReactions.reduce((acc, {track, reaction}) => {
      acc[track] = (acc[track] || 0) + reaction;
      return acc;
    }, {} as Record<string, number>);
    
    // Sort tracks by score
    return Object.entries(trackScores)
      .sort(([, a], [, b]) => b - a)
      .map(([track]) => track);
  }
}
```

### 3. Integrating with External AI Services

For more advanced agent behaviors, you can integrate with external AI services:

1. **OpenAI Integration**: Use the OpenAI API for more natural language responses
2. **LangChain**: Leverage LangChain for more complex agent behaviors

Example of OpenAI integration:

```typescript
// src/agents/aiDjAgent.ts
import { BaseAgent } from './baseAgent';
import { AgentResponse, SceneContext } from '@/types/global';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

export class AIDJAgent extends BaseAgent {
  private client: OpenAIClient;
  private history: string[] = [];
  
  constructor(name: string = 'AI DJ') {
    super(name, 'dj');
    
    // Initialize OpenAI client
    const endpoint = process.env.OPENAI_ENDPOINT || '';
    const apiKey = process.env.OPENAI_API_KEY || '';
    this.client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
  }
  
  async interact(context: SceneContext): Promise<AgentResponse> {
    const { currentMusic, userCount } = context;
    
    // Build prompt
    const prompt = `You are a DJ at a music festival. ${
      currentMusic ? `Currently playing: ${currentMusic.title}. ` : ''
    }There are ${userCount} people in the crowd. ${
      this.history.length > 0 ? `Recent interactions: ${this.history.join(' ')}` : ''
    }
    
    Respond as a DJ would, keeping your response under 50 words.`;
    
    try {
      // Get response from OpenAI
      const response = await this.client.getCompletions('gpt-4', [prompt], {
        maxTokens: 100,
        temperature: 0.7
      });
      
      const content = response.choices[0].text.trim();
      this.history.push(content);
      
      // Keep history manageable
      if (this.history.length > 10) {
        this.history.shift();
      }
      
      return {
        message: this.createMessage(content)
      };
    } catch (error) {
      console.error('Error getting AI response:', error);
      return {
        message: this.createMessage('Having some technical difficulties with the sound system...')
      };
    }
  }
  
  updateMood(eventType: string): void {
    // AI agent doesn't need explicit mood updates
  }
}
```

### 4. Adding New Agent Actions

To add new types of actions that agents can perform:

1. Update the `AgentAction` type in `src/types/global.d.ts`
2. Implement handling for the new action in `useAgents.ts`
3. Add UI components to visualize the actions

Example of adding a new action type:

```typescript
// In src/types/global.d.ts
export interface AgentAction {
  type: 'suggest_track' | 'prepare_transition' | 'increase_energy' | 'visual_effect';
  payload: Record<string, unknown>;
}

// In src/hooks/useAgents.ts
const processAgentActions = useCallback((responses: Map<string, AgentResponse>): void => {
  for (const [, response] of responses.entries()) {
    if (!response.actions || response.actions.length === 0) continue;
    
    for (const action of response.actions) {
      console.log(`Processing agent action: ${action.type}`, action.payload);
      
      switch (action.type) {
        // ... existing cases
        
        case 'visual_effect':
          // Trigger a visual effect in the 3D environment
          const { effectType, duration } = action.payload;
          triggerVisualEffect(effectType as string, duration as number);
          break;
          
        default:
          console.log(`Unknown action type: ${action.type}`);
      }
    }
  }
}, []);

// New function to handle visual effects
function triggerVisualEffect(effectType: string, duration: number): void {
  // Implementation would depend on your 3D environment
  console.log(`Triggering ${effectType} visual effect for ${duration} seconds`);
}
```

### 5. Agent Communication

To enable agents to communicate with each other:

1. Add a method to the `AgentFactory` to allow agents to send messages to specific other agents
2. Implement a message queue system
3. Allow agents to subscribe to events from other agents

Example:

```typescript
// In src/agents/agentFactory.ts
public sendAgentMessage(fromId: string, toId: string, message: string): void {
  const fromAgent = this.getAgent(fromId);
  const toAgent = this.getAgent(toId);
  
  if (!fromAgent || !toAgent) {
    console.error('Agent not found');
    return;
  }
  
  console.log(`Message from ${fromAgent.name} to ${toAgent.name}: ${message}`);
  
  // In a real implementation, you would queue this message for the receiving agent
  // to process in its next interaction cycle
}
```

## Integration with Agent-ChatRoom

To integrate with the [Agent-ChatRoom](https://github.com/LittleLittleCloud/Agent-ChatRoom) project:

1. Clone the Agent-ChatRoom repository
2. Extract the core agent communication mechanisms
3. Adapt them to work with our agent system
4. Create a bridge between the two systems

The key components to integrate:

- Agent communication protocol
- Message formatting
- Context sharing
- Agent state synchronization

## Conclusion

The agent system in BACKSPACE FESTIVAL is designed to be extensible and flexible. By creating new agent types, enhancing their behaviors, and integrating with external AI services, you can create a rich, interactive experience for users.

Remember that agents should:

1. Respond to the environment (music, crowd size, etc.)
2. Have distinct personalities and behaviors
3. Interact with users in meaningful ways
4. Create emergent behaviors through their interactions

For more advanced implementations, consider using machine learning models to train agents on user preferences and behaviors, creating a truly personalized experience.
