interface ChatSession {
  id: string;
  user_id: number;
  title: string;
  updated_at: Date;
  created_at: Date;
}

interface ChatMessage {
  id?: string;
  session_id: string;
  message_id: string;
  role: 'human' | 'ai' | 'tool';
  content: string;
  tool_calls?: Record<string, any>[];
  additional_kwargs?: Record<string, any>;
  created_at: Date;
}

interface ChatSessionDB {
  id: string;
  title: string;
  createdAt: Date;
  messages: ChatMessage[];
}

interface UserToken {
  access_token: string;
  token_type: 'bearer';
}

export type {ChatMessage, ChatSession, ChatSessionDB, UserToken}