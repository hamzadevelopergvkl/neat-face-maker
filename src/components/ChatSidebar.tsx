import { Plus, Edit2, Trash2, Menu, X } from 'lucide-react';
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
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between lg:justify-center">
          <Button onClick={onNewChat} className="flex-1 lg:w-full gap-2 bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-2"
            onClick={onToggle}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat list */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {[...conversations].reverse().map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectChat(conv.id)}
                className={cn(
                  'group relative p-3 rounded-lg cursor-pointer transition-all duration-200',
                  'hover:bg-secondary/50',
                  activeId === conv.id
                    ? 'bg-secondary border-l-2 border-primary shadow-sm'
                    : ''
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1">
                    {conv.title}
                  </span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
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
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
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
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-sm font-semibold">
              U
            </div>
            <span className="text-sm font-medium">User</span>
          </div>
        </div>
      </aside>
    </>
  );
};
