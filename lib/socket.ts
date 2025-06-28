import { io, Socket } from 'socket.io-client';
import { config } from './config';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(userId: string) {
    if (this.socket) {
      return;
    }

    this.socket = io(config.api.url, {
      auth: {
        userId,
      },
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyListeners('connection_status', true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.notifyListeners('connection_status', false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.socket?.disconnect();
      }
    });

    // Auction-specific events
    this.socket.on('auction_update', (data) => {
      this.notifyListeners('auction_update', data);
    });

    this.socket.on('new_bid', (data) => {
      this.notifyListeners('new_bid', data);
    });

    this.socket.on('auction_ended', (data) => {
      this.notifyListeners('auction_ended', data);
    });

    this.socket.on('outbid', (data) => {
      this.notifyListeners('outbid', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)?.add(callback);
    
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private notifyListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  emit(event: string, data: any) {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected, cannot emit event:', event);
      return false;
    }
    
    this.socket.emit(event, data);
    return true;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();

// React hook for using socket
export const useSocket = (userId?: string) => {
  useEffect(() => {
    if (userId) {
      socketService.connect(userId);
      
      return () => {
        socketService.disconnect();
      };
    }
  }, [userId]);

  return {
    isConnected: socketService.isSocketConnected(),
    on: socketService.on.bind(socketService),
    emit: socketService.emit.bind(socketService),
  };
};