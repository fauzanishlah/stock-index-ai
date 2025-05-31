import { ChatSession } from '@/types/chat';
import { useState, useEffect } from 'react';

import { useIndexedDB } from './useIndexedDB';


// export interface ChatSession {
//   id: string;
//   title: string;
//   timestamp: Date;
// }

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getSessions } = useIndexedDB();
  let mockSessions
  // const {sessions: mockSessions} = useChat()

  useEffect(() => {
    // Replace with actual API call
    const fetchSessions = async () => {
      try {
        // Mock data
        mockSessions = await getSessions();
        
        setSessions(mockSessions);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load chat history ${err}}`);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, loading, error };
};