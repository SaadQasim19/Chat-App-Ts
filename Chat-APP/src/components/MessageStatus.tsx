import React from 'react';
import type { Message, User } from '../types';

interface MessageStatusProps {
  message: Message;
  isOwnMessage: boolean;
  recipientUser?: User;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({ 
  message, 
  isOwnMessage, 
  recipientUser 
}) => {
  
  if (!isOwnMessage) {
    return null;
  }

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return (
          <div className="message-status sending" title="Sending...">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
        );
      
      case 'sent':
        return (
          <div className="message-status sent" title="Sent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
        );
      
      case 'delivered':
        return (
          <div className="message-status delivered" title="Delivered">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
              <polyline points="16,10 9,17 8,16"/>
            </svg>
          </div>
        );
      
      case 'read':
        return (
          <div className="message-status read" title="Read">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
              <polyline points="16,10 9,17 8,16"/>
            </svg>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="message-status-container">
      {getStatusIcon()}
   
      {recipientUser && message.status === 'delivered' && (
        <span className={`user-online-dot ${recipientUser.isOnline ? 'online' : 'offline'}`} 
              title={recipientUser.isOnline ? 'Online' : 'Last seen recently'}>
        </span>
      )}
    </div>
  );
};

export default MessageStatus;
