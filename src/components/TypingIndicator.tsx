import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex w-full py-8 px-6 gap-4 justify-start animate-fade-in">
      <div className="shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 animate-glow">
        <Bot className="w-5 h-5 text-primary" />
      </div>
      
      <div className="max-w-[75%] lg:max-w-[65%] rounded-3xl px-6 py-4 glass-strong border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
