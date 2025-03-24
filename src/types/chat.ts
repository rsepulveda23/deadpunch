
export type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export type ChatSettings = {
  apiKey: string;
  // Add any other settings your chat might need
};
