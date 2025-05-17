import { useCallback, useEffect, useState } from 'react';
import AgentFactory from '@/agents/agentFactory';
import useStore from '@/lib/stateManager';
import { Agent, AgentResponse } from '@/types/global';

/**
 * Custom hook for agent interactions
 */
export function useAgents(): {
  agents: Agent[];
  getAgentsByRole: (role: 'dj' | 'crowd' | 'coordinator' | 'assistant') => Agent[];
  broadcastEvent: (eventType: string) => void;
  getAgentResponses: () => Promise<void>;
  processAgentActions: (responses: Map<string, AgentResponse>) => void;
} {
  // Get agent factory instance
  const agentFactory = AgentFactory.getInstance();
  
  // Get global state
  const { sceneContext, addMessage } = useStore();
  
  // Local state for agents
  const [agents, setAgents] = useState<Agent[]>([]);
  
  // Initialize agents
  useEffect(() => {
    setAgents(agentFactory.getAllAgents());
  }, [agentFactory]);
  
  // Get agents by role
  const getAgentsByRole = useCallback((role: 'dj' | 'crowd' | 'coordinator' | 'assistant'): Agent[] => {
    return agentFactory.getAgentsByRole(role);
  }, [agentFactory]);
  
  // Broadcast event to all agents
  const broadcastEvent = useCallback((eventType: string): void => {
    agentFactory.broadcastEvent(eventType);
  }, [agentFactory]);
  
  // Get responses from all agents
  const getAgentResponses = useCallback(async (): Promise<void> => {
    try {
      const responses = await agentFactory.getAgentResponses(sceneContext);
      
      // Add messages to chat
      for (const [, response] of responses.entries()) {
        if (response && response.message) {
          addMessage(response.message);
        }
      }
      
      // Process actions
      processAgentActions(responses);
      
    } catch (error) {
      console.error('Error getting agent responses:', error);
    }
  }, [agentFactory, sceneContext, addMessage]);
  
  // Process agent actions
  const processAgentActions = useCallback((responses: Map<string, AgentResponse>): void => {
    for (const [, response] of responses.entries()) {
      if (!response.actions || response.actions.length === 0) continue;
      
      for (const action of response.actions) {
        console.log(`Processing agent action: ${action.type}`, action.payload);
        
        // Handle different action types
        switch (action.type) {
          case 'suggest_track':
            // In a real implementation, this would trigger UI updates or other actions
            console.log(`Track suggestion: ${action.payload.suggestion}`);
            break;
            
          case 'prepare_transition':
            console.log(`Preparing transition from ${action.payload.current} to ${action.payload.next}`);
            break;
            
          case 'increase_energy':
            console.log(`Increasing energy level to ${action.payload.level}`);
            break;
            
          case 'crowd_reaction':
            console.log(`Crowd reaction: ${action.payload.reaction} (intensity: ${action.payload.intensity})`);
            // In a real implementation, this would trigger visual effects in the 3D environment
            break;
            
          default:
            console.log(`Unknown action type: ${action.type}`);
        }
      }
    }
  }, []);
  
  return {
    agents,
    getAgentsByRole,
    broadcastEvent,
    getAgentResponses,
    processAgentActions
  };
}
