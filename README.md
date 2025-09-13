
# ChatApp – Real-Time React Chat Application

A modern, full-featured real-time chat application built with React, TypeScript, Vite, and Socket.io. Supports dark/light mode, WhatsApp-style message status ticks, responsive design, and more.

---

## ✨ Features

- ⚡️ Real-time messaging with Socket.io
- 🌗 Dark & light mode toggle
- 📱 Responsive sidebar with hamburger menu
- ✅ WhatsApp-style message status (sent, delivered, read ticks)
- 🟢 Online/offline user status
- 💬 Typing indicators
- 🧩 Modular, scalable code structure (components, hooks, contexts, reducers)
- 🛠️ TypeScript for type safety
- 🧪 Mock data for easy local development

---

## 📂 Project Structure

```
Chat-APP/
├── public/
│   └── index.html
├── src/
│   ├── components/      # UI components (ChatHeader, Sidebar, MessageItem, etc.)
│   ├── contexts/        # React context providers (ThemeContext, etc.)
│   ├── data/            # Mock data for users, messages, conversations
│   ├── hooks/           # Custom React hooks (useChatManager, useRealTimeChat, etc.)
│   ├── reducers/        # State management reducers
│   ├── services/        # Socket.io service and helpers
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── constants/       # App-wide constants
│   ├── App.tsx          # Main app component
│   └── App.css          # Global styles
├── server.js            # Node.js + Socket.io backend
├── vite.config.ts       # Vite configuration
├── tsconfig*.json       # TypeScript configuration
├── eslint.config.js     # ESLint configuration
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Socket.io server:**
   ```bash
   npm run server
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

---

## 🛡️ License

MIT

Copyright (c) 2025 [Muhammad Saad Qasim]

Built with ❤️ using React, TypeScript, Vite, and Socket.io.
