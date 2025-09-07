import React from 'react';

interface SidebarProps {
  conversations: Array<{
    id: string;
    name: string;
    lastMessage?: string;
    unreadCount?: number;
  }>;
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  isOpen,
  onClose,
}) => {
  const handleConversationClick = (id: string) => {
    onSelectConversation(id);
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <>
      
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>Conversations</h3>
          <button className="sidebar-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="conversation-list">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                activeConversationId === conversation.id ? 'active' : ''
              }`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="conversation-content">
                <div className="conversation-header">
                  <div className="conversation-name">{conversation.name}</div>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <div className="unread-count">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </div>
                  )}
                </div>
                {conversation.lastMessage && (
                  <div className="last-message">{conversation.lastMessage}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
