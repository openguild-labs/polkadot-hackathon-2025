"use client";
import EventEmitter from 'eventemitter3';

type Callback = (data: any) => void;

class BinanceFutureSocketStream extends EventEmitter {
  private static instance: BinanceFutureSocketStream;
  ws!: WebSocket;
  isConnected: boolean = false;
  closeInitiated: boolean = false;
  handlers: Map<string, Callback[]> = new Map();

  //Debounce
  subscribeTimeout: ReturnType<typeof setTimeout> | null = null;
  subscribeStreams: string[] = [];

  unsubscribeTimeout: ReturnType<typeof setTimeout> | null = null;
  unsubscribeStreams: string[] = [];

  constructor() {
    super();
    this.initSocket();
  }

  private initSocket = () => {
    this.ws = new WebSocket('wss://fstream.binance.com/stream');
    this.handlers = new Map();
    this.ws.onopen = () => {
      this.isConnected = true;
      this.emit('connect');
      console.info('Connected to Binance Future Socket');
    };

    this.ws.onmessage = (event) => {
      this.onMessage(event.data);
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.emit('disconnect');

      if (!this.closeInitiated) {
        setTimeout(() => {
          this.initSocket();
        }, 1000);
      } else {
        this.closeInitiated = false;
      }
    };

    this.ws.onerror = (error) => {
      console.error('Socket encountered error: ', error, 'Closing socket');
      this.ws.close();
    };
  };

  subscribe = (stream: string | string[], callback: Callback) => {
    if (!this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    if (!Array.isArray(stream)) {
      stream = [stream];
    }

    const filterStream = stream.filter(
      (s) => !this.handlers.has(s) || this.handlers.get(s)?.length === 0,
    );

    if (filterStream.length > 0) {
      this.emitSubscribe(filterStream);
    }

    stream.forEach((s) => {
      if (!this.handlers.has(s)) {
        this.handlers.set(s, []);
      }
      this.handlers.get(s)?.push(callback);
    });
  };

  unsubscribe = (stream: string | string[], callback: Callback) => {
    if (!this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    if (!Array.isArray(stream)) {
      stream = [stream];
    }

    const unSubscribeStreams = stream.filter((s) => {
      let callbacks = this.handlers.get(s) || [];
      if (callbacks.length > 0) {
        callbacks = callbacks.filter((cb) => cb !== callback);
        if (callbacks.length > 0) {
          this.handlers.set(s, callbacks);
        } else {
          this.handlers.delete(s);
        }
      }
      return callbacks.length === 0;
    });

    if (unSubscribeStreams.length > 0) {
      this.emitUnSubscribe(unSubscribeStreams);
    }
  };

  private emitSubscribe = (streams: string[]) => {
    this.subscribeStreams.push(...streams);

    if (this.subscribeTimeout) {
      clearTimeout(this.subscribeTimeout);
    }

    this.subscribeTimeout = setTimeout(() => {
      if (this.subscribeStreams.length > 0) {
        const payload = {
          method: 'SUBSCRIBE',
          params: this.subscribeStreams,
          id: Date.now(),
        };
        this.ws.send(JSON.stringify(payload));
      }
      this.subscribeStreams = [];
    }, 100);
  };

  private emitUnSubscribe = (streams: string[]) => {
    this.unsubscribeStreams.push(...streams);

    if (this.unsubscribeTimeout) {
      clearTimeout(this.unsubscribeTimeout);
    }

    this.unsubscribeTimeout = setTimeout(() => {
      if (this.unsubscribeStreams.length > 0) {
        const payload = {
          method: 'UNSUBSCRIBE',
          params: this.unsubscribeStreams,
          id: Date.now(),
        };
        this.ws.send(JSON.stringify(payload));
      }
      this.unsubscribeStreams = [];
    }, 100);
  };

  onMessage(data: string) {
    const message = JSON.parse(data);
    if (message.stream) {
      const callbacks = this.handlers.get(message.stream) || [];
      callbacks.forEach((callback) => {
        callback(message.data);
      });
    }
  }

  public static getInstance(): BinanceFutureSocketStream {
    if (!BinanceFutureSocketStream.instance) {
      BinanceFutureSocketStream.instance = new BinanceFutureSocketStream();
    }

    return BinanceFutureSocketStream.instance;
  }
}

export default BinanceFutureSocketStream;
