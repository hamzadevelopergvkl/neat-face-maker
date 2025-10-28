import { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic, Volume2, MoreVertical, Sparkles, X, Zap } from 'lucide-react';
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
    ? 'Describe your vision...'
    : currentImage
    ? 'Ask about the image...'
    : 'Type your message...';

  return (
    <div className="glass-strong border-t border-white/10 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Mode indicator */}
        {(imageGenerationEnabled || currentImage) && (
          <div className="flex items-center justify-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-strong border border-primary/30 text-sm font-medium animate-glow">
              {imageGenerationEnabled && (
                <>
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Image Generation Active
                  </span>
                </>
              )}
              {currentImage && !imageGenerationEnabled && (
                <>
                  <Image className="w-4 h-4 text-accent" />
                  <span className="text-accent">Image Analysis Mode</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Image preview */}
        {previewUrl && (
          <div className="flex justify-center animate-fade-in">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-[250px] max-h-[200px] rounded-2xl border-2 border-primary/30 shadow-xl glow-cyan"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-7 w-7 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg"
                onClick={() => {
                  setPreviewUrl(null);
                  onClearImage();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="glass-strong rounded-3xl p-4 border border-white/10 shadow-xl hover:border-primary/30 focus-within:border-primary/50 focus-within:glow-cyan transition-all duration-300">
          <div className="flex items-end gap-3">
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

            <div className="flex items-center gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 hover:glass rounded-2xl" 
                    disabled={isProcessing}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 glass-strong border-white/10 rounded-2xl p-2 backdrop-blur-2xl"
                >
                  <DropdownMenuItem
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:glass cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      onToggleImageGeneration();
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center",
                        imageGenerationEnabled ? "bg-primary/20 text-primary" : "bg-white/5"
                      )}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Image Generation</span>
                    </span>
                    <div
                      className={cn(
                        'w-11 h-6 rounded-full transition-colors relative',
                        imageGenerationEnabled ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-lg',
                          imageGenerationEnabled && 'transform translate-x-5'
                        )}
                      />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 my-2" />
                  <DropdownMenuItem 
                    onClick={() => fileInputRef.current?.click()}
                    className="py-3 px-3 rounded-xl hover:glass cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3">
                      <Image className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Upload Image</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onRecordVoice}
                    className="py-3 px-3 rounded-xl hover:glass cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3">
                      <Mic className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Record Voice</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onPlayTTS}
                    className="py-3 px-3 rounded-xl hover:glass cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Play AI Voice</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                size="icon"
                className="h-10 w-10 bg-gradient-to-br from-primary to-accent hover:opacity-90 shadow-lg glow-cyan rounded-2xl disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
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
