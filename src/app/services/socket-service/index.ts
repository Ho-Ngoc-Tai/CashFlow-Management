import { io, Socket } from "socket.io-client";

export type SocketEventHandler = (...args: any[]) => void;

/**
 * Native WebSocket Wrapper with Exponential Backoff Auto-Reconnect
 */
export class NativeWSWrapper {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseDelay = 1000;
  private messageHandlers: Set<(data: any) => void> = new Set();

  constructor(url: string) {
    this.url = url;
  }

  public connect(): void {
    if (typeof window === "undefined") return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        console.log(`[NativeWS] Connected to ${this.url}`);
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.messageHandlers.forEach((handler) => handler(parsed));
        } catch {
          this.messageHandlers.forEach((handler) => handler(event.data));
        }
      };

      this.ws.onclose = () => {
        console.warn("[NativeWS] Connection closed. Attempting reconnect...");
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.error("[NativeWS] WebSocket error:", err);
      };
    } catch (err) {
      console.error("[NativeWS] Failed to initialize WebSocket:", err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[NativeWS] Max reconnection attempts reached");
      return;
    }

    const delay = Math.min(this.baseDelay * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    setTimeout(() => {
      console.log(`[NativeWS] Reconnecting attempt ${this.reconnectAttempts} in ${delay}ms...`);
      this.connect();
    }, delay);
  }

  public onMessage(handler: (data: any) => void): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public send(data: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
    }
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

/**
 * Singleton SocketService managing Socket.IO connections & subscribed topics
 */
export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private subscribedTopics: Set<string> = new Set();
  private isConnected = false;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public init(socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080"): void {
    if (typeof window === "undefined" || this.socket) return;

    this.socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("[SocketService] Connected:", this.socket?.id);
      // Re-subscribe all registered topics upon reconnect
      this.subscribedTopics.forEach((topic) => {
        this.socket?.emit("subscribe", topic);
      });
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      console.warn("[SocketService] Disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("[SocketService] Connection error:", error.message);
    });
  }

  public subscribe(topic: string, handler?: SocketEventHandler): void {
    if (!this.socket) {
      this.init();
    }

    if (!this.subscribedTopics.has(topic)) {
      this.subscribedTopics.add(topic);
      if (this.isConnected && this.socket) {
        this.socket.emit("subscribe", topic);
      }
    }

    if (handler && this.socket) {
      this.socket.on(topic, handler);
    }
  }

  public unsubscribe(topic: string, handler?: SocketEventHandler): void {
    if (!this.socket) return;

    if (handler) {
      this.socket.off(topic, handler);
    } else {
      this.socket.off(topic);
    }

    this.subscribedTopics.delete(topic);
    if (this.isConnected && this.socket) {
      this.socket.emit("unsubscribe", topic);
    }
  }

  public emit(event: string, data?: unknown): void {
    if (!this.socket) {
      this.init();
    }
    this.socket?.emit(event, data);
  }

  public getSubscribedTopics(): string[] {
    return Array.from(this.subscribedTopics);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.subscribedTopics.clear();
      this.isConnected = false;
    }
  }
}

export const socketService = SocketService.getInstance();
