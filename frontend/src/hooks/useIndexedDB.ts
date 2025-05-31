import { useState } from 'react';
import Dexie from 'dexie';
import { ChatMessage, ChatSession } from '@/types/chat';

const DB_NAME = 'ChatDB';
const DB_VERSION = 1;

class ChatDatabase extends Dexie {
  sessions!: Dexie.Table<ChatSession, string>;
  messages!: Dexie.Table<ChatMessage, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      sessions: '++id, createdAt',
      messages: '++id, sessionId, createdAt'
    });
  }
}

const db = new ChatDatabase();

export const useIndexedDB = () => {
  const [isReady] = useState(false);

  // useEffect(() => {
  //   db.open().then(() => setIsReady(true)).catch(console.error);
  //   return () => db.close();
  // }, []);

  const addSession = async (session: ChatSession) => {
    return db.sessions.put(session);
  };

  const getSessions = async () => {
    return db.sessions.orderBy('createdAt').reverse().toArray();
  };

  const addMessage = async (message: ChatMessage) => {
    return db.messages.add(message);
  };

  const getMessages = async (sessionId: string) => {
    return db.messages
      .where('sessionId')
      .equals(sessionId)
      .sortBy('createdAt');
  };

  return {
    db,
    isReady,
    addSession,
    getSessions,
    addMessage,
    getMessages
  };
};