// types.ts
export type Message = {
  id: string;
  content: string;
  type: 'human' | 'ai' | 'tool';
  session_id: string;
  timestamp: string;
};