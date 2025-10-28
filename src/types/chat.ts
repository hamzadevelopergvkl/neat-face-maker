export interface Message {
  role: 'user' | 'ai';
  text: string;
  time: number;
  meta?: {
    hasImage?: boolean;
    generatedImage?: string;
    imagePrompt?: string;
    imageResult?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export interface ChatState {
  conversations: Conversation[];
  activeId: string;
  isProcessing: boolean;
  imageGenerationEnabled: boolean;
  currentImageDataUrl: string | null;
}
