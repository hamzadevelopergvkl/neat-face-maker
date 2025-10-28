import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Edit2 } from 'lucide-react';

interface RenameModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onRename: (newTitle: string) => void;
}

export const RenameModal = ({
  isOpen,
  currentTitle,
  onClose,
  onRename,
}: RenameModalProps) => {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onRename(title.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-strong border-white/10 rounded-3xl backdrop-blur-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10">
                <Edit2 className="w-5 h-5 text-primary" />
              </div>
              Rename Conversation
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new name..."
              className="w-full glass border-white/10 rounded-2xl h-12 text-base focus-visible:ring-primary focus-visible:border-primary/50"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="glass border-white/10 hover:glass-strong rounded-2xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg glow-cyan rounded-2xl"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
