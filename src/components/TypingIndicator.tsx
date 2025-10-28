export const TypingIndicator = () => {
  return (
    <div className="flex w-full py-6 px-4 justify-start">
      <div className="max-w-[80%] lg:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm bg-card border border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
