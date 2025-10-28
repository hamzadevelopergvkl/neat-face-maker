import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onRenameChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatSidebar = ({
  conversations,
  activeId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  isOpen,
  onToggle,
}: ChatSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative top-0 left-0 h-full w-80 glass-strong z-50 transition-all duration-500 flex flex-col border-r border-white/10',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header with logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Chat
                </h1>
                <p className="text-xs text-muted-foreground">Neural Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white/10 rounded-2xl"
              onClick={onToggle}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <Button 
            onClick={onNewChat} 
            className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg glow-cyan rounded-2xl h-12 font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Conversation
          </Button>
        </div>

        {/* Chat list */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {[...conversations].reverse().map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectChat(conv.id)}
                className={cn(
                  'group relative p-4 rounded-2xl cursor-pointer transition-all duration-300',
                  'hover:glass-strong',
                  activeId === conv.id
                    ? 'glass-strong border border-primary/30 shadow-lg glow-cyan'
                    : 'hover:border hover:border-white/10'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/10 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRenameChat(conv.id);
                      }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(conv.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="glass p-4 rounded-2xl hover:glass-strong cursor-pointer transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <span className="text-sm font-bold">U</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
