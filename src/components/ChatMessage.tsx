import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Copy, Download } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const formatMarkdown = (text: string) => {
    if (!text) return '';

    // Convert headings
    text = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2 border-b border-primary/30 pb-2">$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 border-b-2 border-primary pb-2">$1</h1>');

    // Convert **bold**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

    // Convert *italic*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert `code`
    text = text.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Convert code blocks
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="relative group my-4">
        <pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="text-sm font-mono">${escapeHtml(code)}</code></pre>
        <button class="copy-code-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary px-3 py-1 rounded text-xs hover:bg-secondary/80" data-code="${escapeHtml(code).replace(/"/g, '&quot;')}">
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
        'flex w-full py-6 px-4',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] lg:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm',
          message.role === 'user'
            ? 'bg-gradient-primary text-primary-foreground'
            : 'bg-card border border-border'
        )}
      >
        {message.meta?.hasImage && (
          <div className="text-xs opacity-70 mb-2 flex items-center gap-1.5">
            <span>📷</span> Image attached
          </div>
        )}

        <div
          className="text-sm leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(message.text) }}
          onClick={handleCopyCode}
        />

        {message.meta?.generatedImage && (
          <div className="mt-4">
            <img
              src={message.meta.generatedImage}
              alt="Generated"
              className="rounded-lg max-w-full h-auto border border-border cursor-pointer hover:opacity-90 transition-opacity"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-2"
              onClick={() => handleDownloadImage(message.meta!.generatedImage!)}
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
