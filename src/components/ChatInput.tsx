import { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic, Volume2, MoreVertical, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: (prompt: string, imageData: string) => void;
  onGenerateImage: (prompt: string) => void;
  onRecordVoice: () => void;
  onPlayTTS: () => void;
  isProcessing: boolean;
  imageGenerationEnabled: boolean;
  onToggleImageGeneration: () => void;
  currentImage: string | null;
  onClearImage: () => void;
}

export const ChatInput = ({
  onSendMessage,
  onSendImage,
  onGenerateImage,
  onRecordVoice,
  onPlayTTS,
  isProcessing,
  imageGenerationEnabled,
  onToggleImageGeneration,
  currentImage,
  onClearImage,
}: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    if (currentImage) {
      onSendImage(input, currentImage);
      setPreviewUrl(null);
      onClearImage();
    } else if (imageGenerationEnabled) {
      onGenerateImage(input);
    } else {
      onSendMessage(input);
    }

    setInput('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      // Store in parent component
      if (dataUrl) {
        // This would be passed to parent - simplified for now
      }
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = imageGenerationEnabled
    ? 'Describe the image you want to generate...'
    : currentImage
    ? 'Ask a question about the image...'
    : 'Message AI Assistant...';

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Mode indicator */}
        {(imageGenerationEnabled || currentImage) && (
          <div className="mb-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium">
              {imageGenerationEnabled && (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Image Generation Mode
                </>
              )}
              {currentImage && !imageGenerationEnabled && (
                <>
                  <Image className="w-3.5 h-3.5 text-primary" />
                  Image Analysis Mode
                </>
              )}
            </div>
          </div>
        )}

        {/* Image preview */}
        {previewUrl && (
          <div className="mb-3 relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-[200px] max-h-[150px] rounded-lg border border-border"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setPreviewUrl(null);
                onClearImage();
              }}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        <div className="flex items-end gap-2 p-3 rounded-2xl bg-gradient-surface border border-border shadow-elevated focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground min-h-[24px] max-h-[200px]"
              rows={1}
              disabled={isProcessing}
            />
          </div>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" disabled={isProcessing}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onSelect={(e) => {
                    e.preventDefault();
                    onToggleImageGeneration();
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Image Generation
                  </span>
                  <div
                    className={cn(
                      'w-10 h-5 rounded-full transition-colors relative',
                      imageGenerationEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                        imageGenerationEnabled && 'transform translate-x-5'
                      )}
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Image className="w-4 h-4 mr-2" />
                  Upload Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRecordVoice}>
                  <Mic className="w-4 h-4 mr-2" />
                  Record Voice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPlayTTS}>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Play AI Voice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              size="icon"
              className="h-9 w-9 bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};
