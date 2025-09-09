export const APP_CONSTANTS = {
  APP_NAME: 'Chat App',
  VERSION: '1.0.0',
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_TIMEOUT: 3000,
  CONNECTION_TIMEOUT: 10000,
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
} as const;

export const CHAT_EVENTS = {
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
} as const;

export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 300,
  HEADER_HEIGHT: 60,
  INPUT_HEIGHT: 80,
} as const;
