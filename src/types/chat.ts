
export type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export type ChatSettings = {
  model: string;
  systemPrompt: string;
};
