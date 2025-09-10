import { useReducer, useEffect, useCallback } from 'react';
import { chatReducer, initialChatState } from '../reducers';
import { mockConversations, currentUser } from '../data/mockData';
import { useRealTimeChat } from './useRealTimeChat';
import type { Message } from '../types';

export const useChatManager = () => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  const handleMessageReceive = useCallback((conversationId: string, message: Message) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: { conversationId, message },
    });
  }, []);

  const handleTypingUpdate = useCallback((conversationId: string, users: string[]) => {
    dispatch({
      type: 'UPDATE_TYPING',
      payload: { conversationId, users },
    });
  }, []);

  const handleMessageStatusUpdate = useCallback((conversationId: string, messageId: string, status: 'sent' | 'delivered' | 'read') => {
    dispatch({
      type: 'UPDATE_MESSAGE_STATUS',
      payload: { conversationId, messageId, status },
    });
  }, []);

  const realTimeChat = useRealTimeChat({
    currentUser: state.currentUser,
    onMessageReceive: handleMessageReceive,
    onTypingUpdate: handleTypingUpdate,
    onMessageStatusUpdate: handleMessageStatusUpdate,
  });

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
  
    setTimeout(() => {
      dispatch({ type: 'SET_CONVERSATIONS', payload: mockConversations });
      dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: mockConversations[0]?.id || '' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  }, []);

  useEffect(() => {
    if (state.activeConversationId && state.currentUser) {
      realTimeChat.joinConversation(state.activeConversationId);
    }
  }, [state.activeConversationId, state.currentUser, realTimeChat]);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!state.currentUser) return;

    
    const message = realTimeChat.sendMessage(conversationId, text);
    
    if (message) {

      dispatch({
        type: 'SEND_MESSAGE',
        payload: { conversationId, message },
      });
    }
  }, [state.currentUser, realTimeChat]);

  const setActiveConversation = useCallback((conversationId: string) => {
  
    if (state.activeConversationId && state.currentUser) {
      realTimeChat.leaveConversation(state.activeConversationId);
    }
    
    
    dispatch({ type: 'MARK_MESSAGES_READ', payload: { conversationId } });
    
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
  }, [state.activeConversationId, state.currentUser, realTimeChat]);

  const markMessagesAsRead = useCallback((conversationId: string) => {
    dispatch({ type: 'MARK_MESSAGES_READ', payload: { conversationId } });
  }, []);

  const getTotalUnreadCount = useCallback(() => {
    return state.conversations.reduce((total, conversation) => {
      return total + (conversation.unreadCount || 0);
    }, 0);
  }, [state.conversations]);

  const startTyping = useCallback((conversationId: string) => {
    realTimeChat.startTyping(conversationId);
  }, [realTimeChat]);

  const stopTyping = useCallback((conversationId: string) => {
    realTimeChat.stopTyping(conversationId);
  }, [realTimeChat]);

  const getActiveConversation = () => {
    return state.conversations.find(conv => conv.id === state.activeConversationId);
  };

  return {
    state: {
      ...state,
      isConnected: realTimeChat.isConnected,
    },
    sendMessage,
    setActiveConversation,
    startTyping,
    stopTyping,
    markMessagesAsRead,
    getTotalUnreadCount,
    getActiveConversation,
  };
};
