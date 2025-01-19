import { DatabaseManager } from "../db/DatabaseManager";
import { Agent } from "../db/entities/Agent";
import { AgentType, AgentState } from "../types";
import { AIModelConfig } from "../types/ai";

export class AgentStorageService {
  private static instance: AgentStorageService;
  private db: DatabaseManager;

  private constructor() {
    this.db = DatabaseManager.getInstance();
  }

  static getInstance(): AgentStorageService {
    if (!AgentStorageService.instance) {
      AgentStorageService.instance = new AgentStorageService();
    }
    return AgentStorageService.instance;
  }

  async createAgent(
    id: string,
    type: AgentType,
    state: AgentState,
    modelConfig?: AIModelConfig
  ): Promise<Agent> {
    const agentRepository = this.db.getRepository<Agent>(Agent);

    const agent = new Agent();
    agent.id = id;
    agent.type = type;
    agent.state = state;
    agent.modelConfig = modelConfig || null;

    return await agentRepository.save(agent);
  }

  async updateAgentState(id: string, state: AgentState): Promise<void> {
    const agentRepository = this.db.getRepository<Agent>(Agent);

    await agentRepository.update(id, { state });
  }

  async getAgent(id: string): Promise<Agent | null> {
    const agentRepository = this.db.getRepository<Agent>(Agent);

    return await agentRepository.findOne({ where: { id } });
  }

  async getAllAgents(): Promise<Agent[]> {
    const agentRepository = this.db.getRepository<Agent>(Agent);

    return await agentRepository.find();
  }
}
