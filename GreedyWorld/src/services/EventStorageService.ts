import { DatabaseManager } from "../db/DatabaseManager";
import { GameEvent } from "../db/entities/GameEvent";
import { GameEventType, GameEventData } from "../types/events";

export class EventStorageService {
  private static instance: EventStorageService;
  private db: DatabaseManager;

  private constructor() {
    this.db = DatabaseManager.getInstance();
  }

  static getInstance(): EventStorageService {
    if (!EventStorageService.instance) {
      EventStorageService.instance = new EventStorageService();
    }
    return EventStorageService.instance;
  }

  async storeEvent(
    type: GameEventType,
    data: GameEventData[keyof GameEventData],
    blockNumber?: number
  ): Promise<void> {
    const eventRepository = this.db.getRepository<GameEvent>(GameEvent);

    const event = new GameEvent();
    event.type = type;
    event.data = data;
    event.timestamp = Date.now();
    event.blockNumber = blockNumber;

    await eventRepository.save(event);
  }

  async getRecentEvents(
    type: GameEventType,
    limit: number = 10
  ): Promise<GameEvent[]> {
    const eventRepository = this.db.getRepository<GameEvent>(GameEvent);

    return eventRepository.find({
      where: { type },
      order: { timestamp: "DESC" },
      take: limit,
    });
  }

  async getEventsByTimeRange(
    startTime: number,
    endTime: number
  ): Promise<GameEvent[]> {
    const eventRepository = this.db.getRepository<GameEvent>(GameEvent);

    return eventRepository.find({
      where: {
        timestamp: Between(startTime, endTime),
      },
      order: { timestamp: "ASC" },
    });
  }
}
