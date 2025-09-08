import React from 'react';
import type { Message, User } from '../types/index';
import { MessageStatus } from './MessageStatus';
import { mockUsers } from '../data/mockData';

interface MessageItemProps {
  message: Message;
  isOwn?: boolean;
  recipientUser?: User;
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  isOwn = false, 
  recipientUser 
}) => {
  
  const getSenderName = (senderId: string) => {
    if (senderId === 'current-user') return 'You';
    const user = mockUsers.find(u => u.id === senderId);
    return user?.name || 'Unknown';
  };

  return (
    <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
      <div className="message-content">
        <p>{message.text}</p>
        <div className="message-footer">
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <MessageStatus 
            message={message} 
            isOwnMessage={isOwn}
            recipientUser={recipientUser}
          />
        </div>
      </div>
      {!isOwn && (
        <div className="message-sender">{getSenderName(message.sender)}</div>
      )}
    </div>
  );
};

export default MessageItem;
