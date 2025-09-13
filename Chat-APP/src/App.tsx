
import { useState } from 'react';
import { ChatHeader, Sidebar, MessageItem, MessageInput, TypingIndicator } from './components';
import { useChatManager } from './hooks';
import { ThemeProvider } from './contexts';
import { mockUsers } from './data/mockData';
import './App.css';

function App() {
  const { state, sendMessage, setActiveConversation, getActiveConversation, startTyping, stopTyping, getTotalUnreadCount } = useChatManager();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getRecipientUser = (participants: string[]) => {
    const recipientId = participants.find(p => p !== state.currentUser?.id);
    return mockUsers.find(user => user.id === recipientId);
  };
  const activeConversation = getActiveConversation();
  const totalUnreadCount = getTotalUnreadCount();

  const handleSendMessage = (text: string) => {
    if (activeConversation) {
      sendMessage(activeConversation.id, text);
    }
  };

  const handleStartTyping = () => {
    if (activeConversation) {
      startTyping(activeConversation.id);
    }
  };

  const handleStopTyping = () => {
    if (activeConversation) {
      stopTyping(activeConversation.id);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (state.loading) {
    return (
      <ThemeProvider>
        <div className="app loading">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div>Loading...</div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="app">
        
        <div className={`connection-status ${state.isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {state.isConnected ? 'Connected' : 'Offline Mode'}
        </div>

        <Sidebar
          conversations={state.conversations}
          activeConversationId={state.activeConversationId || undefined}
          onSelectConversation={setActiveConversation}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        
        <div className="main-chat">
          {activeConversation ? (
            <>
              <ChatHeader 
                title={activeConversation.name}
                isOnline={state.isConnected}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={toggleSidebar}
                totalUnreadCount={totalUnreadCount}
              />
              
              <div className="messages-container">
                                {activeConversation.messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    recipientUser={getRecipientUser(activeConversation.participants)}
                    isOwn={message.sender === 'current-user'}
                  />
                ))}
                
                {activeConversation.isTyping && activeConversation.isTyping.length > 0 && (
                  <TypingIndicator users={activeConversation.isTyping} />
                )}
              </div>
              
              <MessageInput 
                onSendMessage={handleSendMessage}
                onStartTyping={handleStartTyping}
                onStopTyping={handleStopTyping}
                disabled={false}
              />
            </>
          ) : (
            <div className="no-conversation">
              <ChatHeader 
                title="Chat App"
                isOnline={state.isConnected}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={toggleSidebar}
                totalUnreadCount={totalUnreadCount}
              />
              <div className="no-conversation-content">
                <div className="welcome-message">
                  <h2>Welcome to Real-time Chat! </h2>
                  <p>Select a conversation to start chatting</p>
                  {!state.isConnected && (
                    <p className="offline-notice">
                       Server not available - Running in offline mode
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
