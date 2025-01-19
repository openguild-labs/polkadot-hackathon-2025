import { GameEvent, BlockchainEvent } from "../types";

export class EventManager {
  private subscribers: Map<string, Function[]> = new Map();

  subscribe(eventType: string, callback: Function): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)?.push(callback);
  }

  emit(event: GameEvent | BlockchainEvent): void {
    const callbacks = this.subscribers.get(event.type) || [];
    callbacks.forEach((callback) => callback(event));
  }

  unsubscribe(eventType: string, callback: Function): void {
    const callbacks = this.subscribers.get(eventType) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}
