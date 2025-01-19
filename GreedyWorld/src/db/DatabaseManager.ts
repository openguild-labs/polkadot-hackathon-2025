import { DataSource } from "typeorm";
import { Agent } from "./entities/Agent";
import { GameEvent } from "./entities/GameEvent";
import { config } from "../config/env";

export class DatabaseManager {
  private static instance: DatabaseManager;
  private dataSource: DataSource;

  private constructor() {
    this.dataSource = new DataSource({
      type: "postgres",
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      entities: [Agent, GameEvent],
      synchronize: true,
      logging: true,
    });
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async initialize(): Promise<void> {
    await this.dataSource.initialize();
  }

  getRepository<T>(entity: any) {
    return this.dataSource.getRepository<T>(entity);
  }
}
