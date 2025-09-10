import type { ChatState, ChatAction } from '../types';

export const initialChatState: ChatState = {
  conversations: [],
  activeConversationId: null,
  currentUser: null,
  loading: false,
  isConnected: false,
};

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
      };

    case 'SEND_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === action.payload.conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, action.payload.message],
                lastMessage: action.payload.message.text,
                lastActivity: action.payload.message.timestamp,
              }
            : conversation
        ),
      };

    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversationId: action.payload,
      };

    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'UPDATE_TYPING':
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === action.payload.conversationId
            ? {
                ...conversation,
                isTyping: action.payload.users,
              }
            : conversation
        ),
      };

    case 'UPDATE_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };

    case 'MARK_MESSAGES_READ':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.sender !== state.currentUser?.id
                    ? { ...msg, status: 'read' as const, readAt: Date.now() }
                    : msg
                ),
              }
            : conv
        ),
      };

    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === action.payload.messageId
                    ? {
                        ...msg,
                        status: action.payload.status,
                        ...(action.payload.status === 'delivered' && { deliveredAt: Date.now() }),
                        ...(action.payload.status === 'read' && { readAt: Date.now() }),
                      }
                    : msg
                ),
              }
            : conv
        ),
      };

    default:
      return state;
  }
};
