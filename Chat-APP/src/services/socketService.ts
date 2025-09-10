import{io , Socket} from "socket.io-client";
import type {Message , User} from "../types";


export interface SocketEvents{

//! Message events
  'message:send': (data: { conversationId: string; message: Omit<Message, 'id' | 'timestamp'> }) => void;
  'message:receive': (data: { conversationId: string; message: Message }) => void;
  'message:delivered': (data: { conversationId: string; messageId: string }) => void;
  'message:read': (data: { conversationId: string; messageId: string }) => void;
  

// class SocketService {



// }


}