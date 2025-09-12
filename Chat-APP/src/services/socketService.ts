import{io , Socket} from "socket.io-client";
import type {Message , User} from "../types";


export interface SocketEvents{

//! Message events
  'message:send': (data: { conversationId: string; message: Omit<Message, 'id' | 'timestamp'> }) => void;
  'message:receive': (data: { conversationId: string; message: Message }) => void;
  'message:delivered': (data: { conversationId: string; messageId: string }) => void;
  'message:read': (data: { conversationId: string; messageId: string }) => void;
  
//! Typing events
  'typing:start': (data: { conversationId: string; user: User }) => void;
  'typing:stop': (data: { conversationId: string; user: User }) => void;
  'typing:update': (data: { conversationId: string; users: string[] }) => void;
  
    //! User events
  'user:join': (data: { conversationId: string; user: User }) => void;
  'user:leave': (data: { conversationId: string; user: User }) => void;
  'user:online': (data: { users: User[] }) => void;
  'user:status': (data: { userId: string; isOnline: boolean; lastSeen?: number }) => void;
  
 
//! Connection events
  'connect': () => void;
  'disconnect': () => void;
  'reconnect': () => void;
  'error': (error: any) => void;
}
class SocketService {

 private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

   connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
       
        this.socket = io('ws://localhost:3001', {
          auth: {
            userId,
          },
          transports: ['websocket', 'polling'],
          timeout: 10000,
        });

        this.socket.on('connect', () => {
          console.log('🟢 Socket connected:', this.socket?.id);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔴 Socket disconnected:', reason);
          this.isConnected = false;
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('🟡 Socket reconnected after', attemptNumber, 'attempts');
          this.isConnected = true;
        });

        this.socket.on('reconnect_error', () => {
          this.reconnectAttempts++;
          console.log('🔴 Reconnect attempt failed:', this.reconnectAttempts);
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('❌ Max reconnect attempts reached');
            this.disconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.log('❌ Connection error:', error.message);

          setTimeout(() => {
            if (!this.isConnected) {
              console.log('⚠️ Server not available, using mock mode');
              resolve();
            }
          }, 2000);
        });

      } catch (error) {
        console.error('❌ Socket connection failed:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }


  //! Message methods
  sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('message:send', { conversationId, message });
    } else {
      console.log('⚠️ Socket not connected, message not sent');
    }
  }

  onMessageReceive(callback: (data: { conversationId: string; message: Message }) => void): void {
    if (this.socket) {
      this.socket.on('message:receive', callback);
    }
  }
  onMessageDelivered(callback: (data: { conversationId: string; messageId: string }) => void): void {
    if (this.socket) {
      this.socket.on('message:delivered', callback);
    }
  }
  markMessageDelivered(conversationId: string, messageId: string): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('message:delivered', { conversationId, messageId });
    }
  }

  markMessageRead(conversationId: string, messageId: string): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('message:read', { conversationId, messageId });
    }
  }

//! Typing methods
  startTyping(conversationId: string, user: User): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('typing:start', { conversationId, user });
    }
  }

  stopTyping(conversationId: string, user: User): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('typing:stop', { conversationId, user });
    }
  }

  onTypingUpdate(callback: (data: { conversationId: string; users: string[] }) => void): void {
    if (this.socket) {
      this.socket.on('typing:update', callback);
    }
  }

  //! User methods
  joinConversation(conversationId: string, user: User): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('user:join', { conversationId, user });
    }
  }

  leaveConversation(conversationId: string, user: User): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('user:leave', { conversationId, user });
    }
  }

  onUserOnline(callback: (data: { users: User[] }) => void): void {
    if (this.socket) {
      this.socket.on('user:online', callback);
    }
  }

  onUserStatusChange(callback: (data: { userId: string; isOnline: boolean; lastSeen?: number }) => void): void {
    if (this.socket) {
      this.socket.on('user:status', callback);
    }
  }
   //! Connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  //! Generic event listener
  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    if (this.socket) {
      this.socket.on(event as string, callback as any);
    }
  }

  //! Generic event emitter
  emit<K extends keyof SocketEvents>(event: K, ...args: Parameters<SocketEvents[K]>): void {
    if (this.isConnected && this.socket) {
      this.socket.emit(event as string, ...args);
    }
  }

  //! Remove event listener
  off(event: string, callback?: Function): void {
    if (this.socket) {
      this.socket.off(event, callback as any);
    }
  }
}

//! Export singleton instance
export const socketService = new SocketService();
export default socketService;




