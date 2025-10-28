import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { RenameModal } from '@/components/RenameModal';
import { TypingIndicator } from '@/components/TypingIndicator';
import { Conversation, Message, ChatState } from '@/types/chat';
import { toast } from 'sonner';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<ChatState>(() => {
    const stored = localStorage.getItem('ai_chat_state');
    if (stored) {
      return JSON.parse(stored);
    }

    const initialConversation: Conversation = {
      id: 'c_' + Date.now(),
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [
        {
          role: 'ai',
          text: 'Hello! I\'m your AI assistant. How can I help you today?',
          time: Date.now(),
        },
      ],
    };

    return {
      conversations: [initialConversation],
      activeId: initialConversation.id,
      isProcessing: false,
      imageGenerationEnabled: false,
      currentImageDataUrl: null,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('ai_chat_state', JSON.stringify(state));
  }, [state]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.conversations, state.activeId]);

  const activeConversation = state.conversations.find((c) => c.id === state.activeId);

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: 'c_' + Date.now(),
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [
        {
          role: 'ai',
          text: 'Hello! I\'m your AI assistant. How can I help you today?',
          time: Date.now(),
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      conversations: [...prev.conversations, newConv],
      activeId: newConv.id,
    }));

    setSidebarOpen(false);
    toast.success('New chat created');
  };

  const handleSelectChat = (id: string) => {
    setState((prev) => ({
      ...prev,
      activeId: id,
    }));
    setSidebarOpen(false);
  };

  const handleDeleteChat = (id: string) => {
    if (state.conversations.length <= 1) {
      toast.error('You need at least one chat');
      return;
    }

    if (confirm('Are you sure you want to delete this chat?')) {
      setState((prev) => {
        const newConversations = prev.conversations.filter((c) => c.id !== id);
        const newActiveId =
          prev.activeId === id ? newConversations[0].id : prev.activeId;

        return {
          ...prev,
          conversations: newConversations,
          activeId: newActiveId,
        };
      });

      toast.success('Chat deleted');
    }
  };

  const handleRenameChat = (id: string) => {
    setChatToRename(id);
    setRenameModalOpen(true);
  };

  const handleConfirmRename = (newTitle: string) => {
    if (chatToRename) {
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === chatToRename ? { ...c, title: newTitle } : c
        ),
      }));
      toast.success('Chat renamed');
    }
  };

  const updateChatTitle = (convId: string, userMessage: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) => {
        if (c.id === convId && c.title.startsWith('New Conversation')) {
          const words = userMessage.split(/\s+/).slice(0, 5);
          const newTitle = words.join(' ') + (words.length >= 5 ? '...' : '');
          return { ...c, title: newTitle };
        }
        return c;
      }),
    }));
  };

  const addMessage = (role: 'user' | 'ai', text: string, meta?: Message['meta']) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === prev.activeId
          ? {
              ...c,
              messages: [...c.messages, { role, text, time: Date.now(), meta }],
            }
          : c
      ),
    }));
  };

  const handleSendMessage = async (message: string) => {
    // Auto-update chat title on first user message
    const conv = activeConversation;
    if (conv && conv.messages.filter((m) => m.role === 'user').length === 0) {
      updateChatTitle(conv.id, message);
    }

    addMessage('user', message);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'That\'s an interesting question! Let me help you with that.',
        'I understand what you\'re asking. Here\'s what I think...',
        'Great question! Based on my knowledge...',
        'Let me break this down for you.',
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage('ai', response);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSendImage = async (prompt: string, imageData: string) => {
    addMessage('user', prompt, { hasImage: true });
    setIsProcessing(true);

    setTimeout(() => {
      addMessage('ai', 'I can see the image you uploaded. This appears to be an interesting visual. Let me analyze it for you...');
      setIsProcessing(false);
    }, 2000);
  };

  const handleGenerateImage = async (prompt: string) => {
    addMessage('user', `Generate image: ${prompt}`);
    setIsProcessing(true);

    setTimeout(() => {
      addMessage(
        'ai',
        'Image generated successfully!',
        {
          generatedImage: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800',
          imagePrompt: prompt,
        }
      );
      setIsProcessing(false);
      setState((prev) => ({ ...prev, imageGenerationEnabled: false }));
    }, 3000);
  };

  const handleRecordVoice = () => {
    toast.info('Voice recording feature would be activated here');
  };

  const handlePlayTTS = () => {
    const lastAIMessage = activeConversation?.messages
      .slice()
      .reverse()
      .find((m) => m.role === 'ai');

    if (!lastAIMessage) {
      toast.error('No AI message to play');
      return;
    }

    toast.info('Text-to-speech would play here');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        conversations={state.conversations}
        activeId={state.activeId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {activeConversation?.title || 'AI Assistant'}
          </h1>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="max-w-4xl mx-auto">
            {activeConversation?.messages.map((message, idx) => (
              <ChatMessage key={idx} message={message} />
            ))}
            {isProcessing && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          onGenerateImage={handleGenerateImage}
          onRecordVoice={handleRecordVoice}
          onPlayTTS={handlePlayTTS}
          isProcessing={isProcessing}
          imageGenerationEnabled={state.imageGenerationEnabled}
          onToggleImageGeneration={() =>
            setState((prev) => ({
              ...prev,
              imageGenerationEnabled: !prev.imageGenerationEnabled,
            }))
          }
          currentImage={state.currentImageDataUrl}
          onClearImage={() =>
            setState((prev) => ({ ...prev, currentImageDataUrl: null }))
          }
        />
      </main>

      <RenameModal
        isOpen={renameModalOpen}
        currentTitle={
          state.conversations.find((c) => c.id === chatToRename)?.title || ''
        }
        onClose={() => setRenameModalOpen(false)}
        onRename={handleConfirmRename}
      />
    </div>
  );
};

export default Index;
