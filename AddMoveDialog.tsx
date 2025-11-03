import { useState } from 'react';
import { Move } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns@4.1.0';
import { ru, enUS } from 'date-fns@4.1.0/locale';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { ScrollArea } from './ui/scroll-area';

// DatePicker component with OK button that properly closes the popover
function DatePickerWithOk({ 
  date, 
  onSelect, 
  language, 
  placeholder 
}: { 
  date: Date | undefined; 
  onSelect: (date: Date | undefined) => void; 
  language: string; 
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 rounded-2xl justify-start text-left"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            language === 'ru' 
              ? format(date, 'dd MMM yyyy', { locale: ru })
              : format(date, 'MMM dd, yyyy', { locale: enUS })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-3xl flex flex-col" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          locale={language === 'ru' ? ru : enUS}
        />
        <div className="p-3 border-t border-border">
          <Button 
            className="w-full h-10 rounded-2xl"
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface AddMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMoves: (moves: Omit<Move, 'id'>[]) => void;
  currentRoom: string;
  currentRoomCategory: 'DTS' | 'DKS';
}

interface MoveInput {
  tempId: string;
  date: Date | undefined;
  room: string;
  roomCategory: 'DTS' | 'DKS';
  comment: string;
}

export function AddMoveDialog({ open, onOpenChange, onAddMoves, currentRoom, currentRoomCategory }: AddMoveDialogProps) {
  const { t, language } = useLanguage();
  const [moves, setMoves] = useState<MoveInput[]>([
    {
      tempId: '1',
      date: undefined,
      room: currentRoom,
      roomCategory: currentRoomCategory,
      comment: ''
    }
  ]);

  const handleAddMove = () => {
    setMoves([
      ...moves,
      {
        tempId: Date.now().toString(),
        date: undefined,
        room: currentRoom,
        roomCategory: currentRoomCategory,
        comment: ''
      }
    ]);
  };

  const handleRemoveMove = (tempId: string) => {
    if (moves.length > 1) {
      setMoves(moves.filter(m => m.tempId !== tempId));
    }
  };

  const updateMove = (tempId: string, field: keyof MoveInput, value: any) => {
    setMoves(moves.map(m => 
      m.tempId === tempId ? { ...m, [field]: value } : m
    ));
  };

  const handleSave = () => {
    // Validate that all moves have at least a date and room
    const validMoves = moves.filter(m => m.date && m.room);
    
    if (validMoves.length === 0) {
      return;
    }

    const movesToAdd: Omit<Move, 'id'>[] = validMoves.map(m => {
      // Store date in YYYY-MM-DD format for consistent comparisons
      const dateStr = format(m.date!, 'yyyy-MM-dd');
      
      return {
        date: dateStr,
        room: m.room,
        roomCategory: m.roomCategory,
        comment: m.comment || undefined
      };
    });

    onAddMoves(movesToAdd);
    
    // Reset form
    setMoves([
      {
        tempId: '1',
        date: undefined,
        room: currentRoom,
        roomCategory: currentRoomCategory,
        comment: ''
      }
    ]);
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setMoves([
      {
        tempId: '1',
        date: undefined,
        room: currentRoom,
        roomCategory: currentRoomCategory,
        comment: ''
      }
    ]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <div className="bg-card px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('addMove')}</DialogTitle>
            <DialogDescription className="sr-only">{t('addMoveDescription')}</DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-4">
            {moves.map((move, index) => (
              <div key={move.tempId} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('move')} {index + 1}
                  </span>
                  {moves.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMove(move.tempId)}
                      className="h-8 w-8 p-0 rounded-xl text-red-600 dark:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Date Picker */}
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                    {t('moveDate')} *
                  </label>
                  <DatePickerWithOk
                    date={move.date}
                    onSelect={(date) => updateMove(move.tempId, 'date', date)}
                    language={language}
                    placeholder={t('selectDate')}
                  />
                </div>

                {/* Room Number */}
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                    {t('room')} *
                  </label>
                  <Input
                    value={move.room}
                    onChange={(e) => updateMove(move.tempId, 'room', e.target.value)}
                    placeholder={t('room')}
                    className="h-12 rounded-2xl"
                  />
                </div>

                {/* Room Category */}
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                    {t('roomCategory')}
                  </label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={move.roomCategory === 'DTS' ? 'default' : 'outline'}
                      onClick={() => updateMove(move.tempId, 'roomCategory', 'DTS')}
                      className="flex-1 h-12 rounded-2xl"
                    >
                      DTS
                    </Button>
                    <Button
                      type="button"
                      variant={move.roomCategory === 'DKS' ? 'default' : 'outline'}
                      onClick={() => updateMove(move.tempId, 'roomCategory', 'DKS')}
                      className="flex-1 h-12 rounded-2xl"
                    >
                      DKS
                    </Button>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                    {t('comment')}
                  </label>
                  <Textarea
                    value={move.comment}
                    onChange={(e) => updateMove(move.tempId, 'comment', e.target.value)}
                    placeholder={t('addComment')}
                    rows={2}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            ))}

            {/* Add Another Move Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMove}
              className="w-full h-12 rounded-2xl border-dashed"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('addAnotherMove')}
            </Button>
          </div>
        </ScrollArea>

        {/* Footer with action buttons */}
        <div className="bg-card px-6 py-4 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 rounded-2xl"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12 rounded-2xl"
              disabled={!moves.some(m => m.date && m.room)}
            >
              {t('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
