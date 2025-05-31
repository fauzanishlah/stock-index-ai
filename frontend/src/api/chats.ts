// api/chat.ts
// import { Message } from '../types';

const API_BASE = 'http://localhost:5000/api';
const AGENT_API = 'http://localhost:8000/api/agent/test-sse';

export const getChatSessions = async () => {
  const response = await fetch(`${API_BASE}/chat`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getChatMessages = async (sessionId: string) => {
  const response = await fetch(`${API_BASE}/chat/m/${sessionId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    'Authorization': `${user.token_type} ${user.access_token}`,
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) throw new Error('API request failed');
  return response.json();
};

export const sendToAgent = async (sessionId: string, input: string) => {
  const response = await fetch(AGENT_API, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: input
    })
  });

  if (!response.ok || !response.body) {
    throw new Error('Failed to connect to agent');
  }

  return {
    stream: response.body,
    controller: new AbortController()
  };
};