import { Agent, SceneContext } from '@/types/global';
import { DJAgent } from './djAgent';
import { CrowdAgent } from './crowdAgent';

/**
 * Factory class for creating and managing agents
 */
class AgentFactory {
  private static instance: AgentFactory;
  private agents: Map<string, Agent> = new Map();
  
  private constructor() {
    // Private constructor to enforce singleton pattern
    this.initializeDefaultAgents();
  }
  
  public static getInstance(): AgentFactory {
    if (!AgentFactory.instance) {
      AgentFactory.instance = new AgentFactory();
    }
    return AgentFactory.instance;
  }
  
  /**
   * Initialize default agents
   */
  private initializeDefaultAgents(): void {
    // Create DJ agent
    const djAgent = new DJAgent();
    this.registerAgent(djAgent);
    
    // Create Crowd agent
    const crowdAgent = new CrowdAgent();
    this.registerAgent(crowdAgent);
    
    console.log('Default agents initialized');
  }
  
  /**
   * Register a new agent
   */
  public registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    console.log(`Agent registered: ${agent.name} (${agent.role})`);
  }
  
  /**
   * Get an agent by ID
   */
  public getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }
  
  /**
   * Get all agents
   */
  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Get agents by role
   */
  public getAgentsByRole(role: 'dj' | 'crowd' | 'coordinator' | 'assistant'): Agent[] {
    return Array.from(this.agents.values()).filter(agent => agent.role === role);
  }
  
  /**
   * Update all agents with an event
   */
  public broadcastEvent(eventType: string): void {
    for (const agent of this.agents.values()) {
      agent.updateMood(eventType);
    }
    console.log(`Event broadcast to all agents: ${eventType}`);
  }
  
  /**
   * Get responses from all agents based on context
   */
  public async getAgentResponses(context: SceneContext): Promise<Map<string, any>> {
    const responses = new Map<string, any>();
    
    for (const agent of this.agents.values()) {
      try {
        const response = await agent.interact(context);
        responses.set(agent.id, response);
      } catch (error) {
        console.error(`Error getting response from agent ${agent.name}:`, error);
      }
    }
    
    return responses;
  }
}

export default AgentFactory;
