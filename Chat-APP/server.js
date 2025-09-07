import { createServer } from 'http';
import { Server } from 'socket.io';


const httpServer = createServer();


const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

const activeUsers = new Map();
const typingUsers = new Map();

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('user:authenticate', (userData) => {
    activeUsers.set(socket.id, userData);
    console.log('👤 User authenticated:', userData.name);
  });

  socket.on('user:join', ({ conversationId, user }) => {
    socket.join(conversationId);
    console.log(`👥 ${user.name} joined conversation: ${conversationId}`);


    socket.to(conversationId).emit('user:joined', { user });
  });

  socket.on('user:leave', ({ conversationId, user }) => {
    socket.leave(conversationId);
    console.log(`👋 ${user.name} left conversation: ${conversationId}`);


    if (typingUsers.has(conversationId)) {
      typingUsers.get(conversationId).delete(user.name);
      io.to(conversationId).emit('typing:update', {
        conversationId,
        users: Array.from(typingUsers.get(conversationId) || [])
      });
    }


    socket.to(conversationId).emit('user:left', { user });
  });

  socket.on('message:send', ({ conversationId, message }) => {
    const completeMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };

    console.log(`💬 Message in ${conversationId}:`, completeMessage.text);

    socket.to(conversationId).emit('message:receive', {
      conversationId,
      message: completeMessage
    });

    socket.emit('message:sent', {
      conversationId,
      messageId: completeMessage.id
    });
  });

  socket.on('typing:start', ({ conversationId, user }) => {
    if (!typingUsers.has(conversationId)) {
      typingUsers.set(conversationId, new Set());
    }

    typingUsers.get(conversationId).add(user.name);

    socket.to(conversationId).emit('typing:update', {
      conversationId,
      users: Array.from(typingUsers.get(conversationId))
    });

    console.log(`⌨️ ${user.name} started typing in ${conversationId}`);
  });

  socket.on('typing:stop', ({ conversationId, user }) => {
    if (typingUsers.has(conversationId)) {
      typingUsers.get(conversationId).delete(user.name);

      socket.to(conversationId).emit('typing:update', {
        conversationId,
        users: Array.from(typingUsers.get(conversationId))
      });

      console.log(`⌨️ ${user.name} stopped typing in ${conversationId}`);
    }
  });

  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      console.log('🔴 User disconnected:', userData.name);

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

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  httpServer.close(() => {
    console.log('Server closed✅');
    process.exit(0);
  });
});
