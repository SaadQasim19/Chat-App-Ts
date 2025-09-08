import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { HamburgerMenu } from './HamburgerMenu';

interface ChatHeaderProps {
  title: string;
  isOnline?: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  totalUnreadCount?: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title, 
  isOnline = false, 
  isSidebarOpen, 
  onToggleSidebar,
  totalUnreadCount = 0
}) => {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <div className="hamburger-container">
          <HamburgerMenu isOpen={isSidebarOpen} onClick={onToggleSidebar} />
          {totalUnreadCount > 0 && (
            <div className="header-unread-badge">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </div>
          )}
        </div>
        <h2>{title}</h2>
        {isOnline && <span className="online-indicator">Online</span>}
      </div>
      <div className="chat-header-right">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ChatHeader;
