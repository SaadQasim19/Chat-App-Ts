import type { Conversation, User, Message } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Saad Qasim',
    avatar: 'https://avatar.vercel.sh/john',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Shazeel Ahsan',
    avatar: 'https://avatar.vercel.sh/jane',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Haji Allah Daad',
    avatar: 'https://avatar.vercel.sh/bob',
    isOnline: true,
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey there! How are you doing?',
    sender: '1',                                        //! Saad Qasim
    timestamp: Date.now() - 3600000,                    //! 1 hour ago
    type: 'text', 
    status: 'read',
  },
  {
    id: '2',
    text: 'I\'m doing great! Just working on some new features.',
    sender: 'current-user',                             //! Current User
    timestamp: Date.now() - 3300000,                   //! 55 minutes ago
    type: 'text',
    status: 'delivered',
  },
  {
    id: '3',
    text: 'That sounds awesome! What kind of features?',
    sender: '1',                                        //! Saad Qasim
    timestamp: Date.now() - 3000000,                   //! 50 minutes ago
    type: 'text',
    status: 'read',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Saad Qasim',
    participants: ['1', 'current-user'],
    messages: mockMessages,
    lastMessage: 'That sounds awesome! What kind of features?',
    unreadCount: 0,
  },
  {
    id: '2',
    name: 'Shazeel Ahsan',
    participants: ['2', 'current-user'],
    messages: [
      {
        id: '4',
        text: 'Are we still on for the meeting tomorrow?',
        sender: '2',                                    //! Shazeel Ahsan
        timestamp: Date.now() - 7200000,                //! 2 hours ago
        type: 'text',
        status: 'read',
      },
      {
        id: '6',
        text: 'Please confirm when you get this message',
        sender: '2',                                      //! Shazeel Ahsan
        timestamp: Date.now() - 3600000,                 //! 1 hour ago
        type: 'text', 
        status: 'delivered',
      },
    ],
    lastMessage: 'Please confirm when you get this message',
    unreadCount: 2,
  },
  {
    id: '3',
    name: 'Family Area',
    participants: ['1', '2', '3', 'current-user'],
    messages: [
      {
        id: '5',
        text: 'Welcome everyone to the team chat!',
        sender: '3',                                        //! Haji Allah Daad
        timestamp: Date.now() - 86400000,                  //! 1 day ago
        type: 'text',
        status: 'read',
      },
      {
        id: '7',
        text: 'Hope everyone is doing well!',
        sender: '3',                             //! Haji Allah Daad
        timestamp: Date.now() - 3600000,        //! 1 hour ago
        type: 'text',
        status: 'sent',
      },
    ],
    lastMessage: 'Hope everyone is doing well!',
    unreadCount: 1,
  },
];

export const currentUser: User = {
  id: 'current-user',
  name: 'Current User',
  avatar: 'https://avatar.vercel.sh/current',
  isOnline: true,
};

