import { useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services';
import type { Message, User } from '../types';

interface UseRealTimeChatProps {
  currentUser: User | null;
  onMessageReceive: (conversationId: string, message: Message) => void;
  onTypingUpdate: (conversationId: string, users: string[]) => void;
  onMessageStatusUpdate: (conversationId: string, messageId: string, status: 'sent' | 'delivered' | 'read') => void;
  onUserOnline?: (users: User[]) => void;
}

export const useRealTimeChat = ({
  currentUser,
  onMessageReceive,
  onTypingUpdate,
  onMessageStatusUpdate,
  onUserOnline,
}: UseRealTimeChatProps) => {
  const isConnectedRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  
  useEffect(() => {
    if (currentUser && !isConnectedRef.current) {
      const initializeSocket = async () => {
        try {
          await socketService.connect(currentUser.id);
          isConnectedRef.current = true;
          console.log(' Real-time chat initialized for:', currentUser.name);
        } catch (error) {
          console.warn(' Socket server not available, using offline mode');
         
        }
      };

      initializeSocket();
    }

    return () => {
      if (isConnectedRef.current) {
        socketService.disconnect();
        isConnectedRef.current = false;
      }
    };
  }, [currentUser]);

  
  useEffect(() => {
    if (!currentUser) return;

    const handleMessageReceive = (data: { conversationId: string; message: Message }) => {
     
      if (data.message.sender !== currentUser.name) {
        onMessageReceive(data.conversationId, data.message);
      }
    };

    const handleTypingUpdate = (data: { conversationId: string; users: string[] }) => {
     
      const otherUsers = data.users.filter(user => user !== currentUser.name);
      onTypingUpdate(data.conversationId, otherUsers);
    };

   
    const handleUserOnline = (data: { users: User[] }) => {
      if (onUserOnline) {
        onUserOnline(data.users);
      }
    };

    const handleMessageDelivered = (data: { conversationId: string; messageId: string }) => {
      onMessageStatusUpdate(data.conversationId, data.messageId, 'delivered');
    };

    const handleMessageRead = (data: { conversationId: string; messageId: string }) => {
      onMessageStatusUpdate(data.conversationId, data.messageId, 'read');
    };

    socketService.onMessageReceive(handleMessageReceive);
    socketService.onTypingUpdate(handleTypingUpdate);
    socketService.onUserOnline(handleUserOnline);
    socketService.onMessageDelivered(handleMessageDelivered);
    socketService.onMessageRead(handleMessageRead);

    return () => {
      socketService.off('message:receive', handleMessageReceive);
      socketService.off('typing:update', handleTypingUpdate);
      socketService.off('user:online', handleUserOnline);
      socketService.off('message:delivered', handleMessageDelivered);
      socketService.off('message:read', handleMessageRead);
    };
  }, [currentUser, onMessageReceive, onTypingUpdate, onUserOnline]);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!currentUser) return null;

    const message: Omit<Message, 'id' | 'timestamp'> = {
      text,
      sender: currentUser.id, 
      type: 'text',
    };

    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
      status: 'sending' as const,
    };

    if (socketService.getConnectionStatus()) {
      socketService.sendMessage(conversationId, message);
      
      setTimeout(() => {
        onMessageStatusUpdate(conversationId, newMessage.id, 'sent');
        
       
        setTimeout(() => {
          onMessageStatusUpdate(conversationId, newMessage.id, 'delivered');
          
          setTimeout(() => {
            onMessageStatusUpdate(conversationId, newMessage.id, 'read');
          }, 2000);
        }, 1000);
      }, 500);
    }

    return newMessage;
  }, [currentUser]);


  const startTyping = useCallback((conversationId: string) => {
    if (!currentUser) return;

    socketService.startTyping(conversationId, currentUser);

   
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversationId);
    }, 3000);
  }, [currentUser]);

  const stopTyping = useCallback((conversationId: string) => {
    if (!currentUser) return;

    socketService.stopTyping(conversationId, currentUser);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [currentUser]);

  const joinConversation = useCallback((conversationId: string) => {
    if (!currentUser) return;
    socketService.joinConversation(conversationId, currentUser);
  }, [currentUser]);

  const leaveConversation = useCallback((conversationId: string) => {
    if (!currentUser) return;
    socketService.leaveConversation(conversationId, currentUser);
  }, [currentUser]);

  const isConnected = socketService.getConnectionStatus();

  return {
    sendMessage,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    isConnected,
  };
};
