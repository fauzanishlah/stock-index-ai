import { ChatMessage, ChatSession, UserToken } from '@/types/chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';

// const API_BASE = 'http://localhost:5000/api';
const CHAT_API_BASE = 'http://localhost:8000/api/chat';
const AGENT_API = 'http://localhost:8000/api/agent/chat';
// const AGENT_API = 'http://localhost:8000/api/agent/test-sse';


const getAuthHeader = () => {
  const user = localStorage.getItem('user');
  if (!user) throw new Error('User not authenticated');
  
  const { access_token, token_type } = JSON.parse(user) as UserToken;
  return `${token_type} ${access_token}`;
};

type ResponseChatSessions = {
  chat_sessions: ChatSession[];
  count: number;
}

type ResponseChatMessages = {
  messages: ChatMessage[];
  count: number;
}

export const sendToAgent = async (
  sessionId: string,
  input: string,
  onMessage: (event: any, data: any) => void,
  onError?: (error: any) => void,
  onClose?: () => void,
) => {
  const ctrl = new AbortController();
  
  await fetchEventSource(AGENT_API, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Accept': 'text/event-stream',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: input
    }),
    signal: ctrl.signal,
    onopen: async (response) => {
      if (response.ok) return;
      throw new Error(`Failed to open stream: ${response.status}`);
    },
    onmessage: async (event) => {
      if (event.data) {
        try {
          console.log(event.event)
          const data = await JSON.parse(event.data);
          onMessage(event.event, data);
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      }
    },
    onerror: (err) => {
      onError?.(err);
      ctrl.abort();
      throw err;
    },
    onclose: () => {
      onClose?.();
      ctrl.abort();
    }
  });

  return ctrl;
};



export const chatAPI = {
  async getSessions(): Promise<ResponseChatSessions> {
    const response = await fetch(CHAT_API_BASE, {
      headers: {
        Authorization: getAuthHeader(),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    // response.json().then(data => {const chatSessions = data.chat_sessions; return chatSessions})
    return response.json();
  },

  async getMessages(sessionId: string): Promise<ResponseChatMessages> {
    const response = await fetch(`${CHAT_API_BASE}/s/${sessionId}`, {
      headers: {
        Authorization: getAuthHeader(),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const response = await fetch(`http://localhost:8000/api/chats/${sessionId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update session');
    return response.json();
  },

  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`http://localhost:8000/api/chats/${sessionId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: getAuthHeader(),
      },
    });
    if (!response.ok) throw new Error('Failed to delete session');
  },
};