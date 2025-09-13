export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  type?: 'text' | 'image' | 'file';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isRead?: boolean;
  deliveredAt?: number;
  readAt?: number;
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  messages: Message[];
  lastMessage?: string;
  unreadCount?: number;
  isTyping?: string[];
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export interface ChatState {
  currentUser: User | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  loading: boolean;
  isConnected: boolean;
}

export type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string }
  | { type: 'SEND_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'UPDATE_TYPING'; payload: { conversationId: string; users: string[] } }
  | { type: 'UPDATE_CONNECTION_STATUS'; payload: boolean }
  | { type: 'MARK_MESSAGES_READ'; payload: { conversationId: string } }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { conversationId: string; messageId: string; status: 'sent' | 'delivered' | 'read' } };
