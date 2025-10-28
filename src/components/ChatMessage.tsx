import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Download, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const formatMarkdown = (text: string) => {
    if (!text) return '';

    // Convert headings
    text = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-primary">$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2 text-primary">$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-primary">$1</h1>');

    // Convert **bold**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>');

    // Convert *italic*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert `code`
    text = text.replace(/`([^`]+)`/g, '<code class="glass px-2 py-0.5 rounded-lg text-sm font-mono text-accent">$1</code>');

    // Convert code blocks
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="relative group my-4">
        <pre class="glass-strong p-4 rounded-2xl overflow-x-auto border border-white/10"><code class="text-sm font-mono">${escapeHtml(code)}</code></pre>
        <button class="copy-code-btn absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity glass px-3 py-1.5 rounded-xl text-xs hover:glass-strong" data-code="${escapeHtml(code).replace(/"/g, '&quot;')}">
          Copy
        </button>
      </div>`;
    });

    // Convert line breaks
    text = text.replace(/\n/g, '<br>');

    return text;
  };

  const escapeHtml = (s: string) => {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    const button = e.target as HTMLButtonElement;
    const code = button.getAttribute('data-code');
    if (code) {
      navigator.clipboard.writeText(code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
      toast.success('Code copied to clipboard');
    }
  };

  const handleDownloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={cn(
        'flex w-full py-8 px-6 gap-4 animate-fade-in',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'ai' && (
        <div className="shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 animate-glow">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[75%] lg:max-w-[65%] rounded-3xl px-6 py-4 transition-all duration-300 hover:scale-[1.02]',
          message.role === 'user'
            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-xl glow-cyan'
            : 'glass-strong border border-white/10 shadow-lg'
        )}
      >
        {message.meta?.hasImage && (
          <div className="text-xs opacity-70 mb-3 flex items-center gap-2 glass px-3 py-1.5 rounded-xl w-fit">
            <span>📷</span> Image attached
          </div>
        )}

        <div
          className="text-sm leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(message.text) }}
          onClick={handleCopyCode}
        />

        {message.meta?.generatedImage && (
          <div className="mt-4 space-y-3">
            <img
              src={message.meta.generatedImage}
              alt="Generated"
              className="rounded-2xl max-w-full h-auto border border-white/10 cursor-pointer hover:scale-105 transition-transform shadow-xl"
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-2 glass hover:glass-strong border-white/10 rounded-xl"
              onClick={() => handleDownloadImage(message.meta!.generatedImage!)}
            >
              <Download className="w-3.5 h-3.5" />
              Download Image
            </Button>
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <div className="shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border border-white/10">
          <User className="w-5 h-5 text-accent" />
        </div>
      )}
    </div>
  );
};
