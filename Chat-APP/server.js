import { createServer } from 'http';
import { Server } from 'socket.io';

// Create HTTP server
const httpServer = createServer();

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Store active users and their typing status
const activeUsers = new Map();
const typingUsers = new Map(); // conversationId -> Set of user names

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Handle user authentication
  socket.on('user:authenticate', (userData) => {
    activeUsers.set(socket.id, userData);
    console.log('👤 User authenticated:', userData.name);
  });

  // Handle joining conversation
  socket.on('user:join', ({ conversationId, user }) => {
    socket.join(conversationId);
    console.log(`👥 ${user.name} joined conversation: ${conversationId}`);
    
    // Notify others in the conversation
    socket.to(conversationId).emit('user:joined', { user });
  });

  // Handle leaving conversation
  socket.on('user:leave', ({ conversationId, user }) => {
    socket.leave(conversationId);
    console.log(`👋 ${user.name} left conversation: ${conversationId}`);
    
    // Remove from typing users
    if (typingUsers.has(conversationId)) {
      typingUsers.get(conversationId).delete(user.name);
      io.to(conversationId).emit('typing:update', {
        conversationId,
        users: Array.from(typingUsers.get(conversationId) || [])
      });
    }
    
    // Notify others in the conversation
    socket.to(conversationId).emit('user:left', { user });
  });

  // Handle sending messages
  socket.on('message:send', ({ conversationId, message }) => {
    // Create complete message with server-side data
    const completeMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };

    console.log(`💬 Message in ${conversationId}:`, completeMessage.text);

    // Send to other users in the conversation (not including sender)
    socket.to(conversationId).emit('message:receive', {
      conversationId,
      message: completeMessage
    });
    
    // Send confirmation back to sender only
    socket.emit('message:sent', {
      conversationId,
      messageId: completeMessage.id
    });
  });

  // Handle typing start
  socket.on('typing:start', ({ conversationId, user }) => {
    if (!typingUsers.has(conversationId)) {
      typingUsers.set(conversationId, new Set());
    }
    
    typingUsers.get(conversationId).add(user.name);
    
    // Notify others in the conversation
    socket.to(conversationId).emit('typing:update', {
      conversationId,
      users: Array.from(typingUsers.get(conversationId))
    });
    
    console.log(`⌨️ ${user.name} started typing in ${conversationId}`);
  });

  // Handle typing stop
  socket.on('typing:stop', ({ conversationId, user }) => {
    if (typingUsers.has(conversationId)) {
      typingUsers.get(conversationId).delete(user.name);
      
      // Notify others in the conversation
      socket.to(conversationId).emit('typing:update', {
        conversationId,
        users: Array.from(typingUsers.get(conversationId))
      });
      
      console.log(`⌨️ ${user.name} stopped typing in ${conversationId}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      console.log('🔴 User disconnected:', userData.name);
      
      // Clean up typing status for all conversations
      for (const [conversationId, users] of typingUsers.entries()) {
        if (users.has(userData.name)) {
          users.delete(userData.name);
          io.to(conversationId).emit('typing:update', {
            conversationId,
            users: Array.from(users)
          });
        }
      }
      
      activeUsers.delete(socket.id);
    } else {
      console.log('🔴 Unknown user disconnected:', socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:5173, http://localhost:3000`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
