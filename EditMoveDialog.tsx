import { useState, useEffect } from 'react';
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
import { format, parse } from 'date-fns@4.1.0';
import { ru, enUS } from 'date-fns@4.1.0/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

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

interface EditMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateMove: (move: Move) => void;
  move: Move | null;
}

export function EditMoveDialog({ open, onOpenChange, onUpdateMove, move }: EditMoveDialogProps) {
  const { t, language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [room, setRoom] = useState('');
  const [roomCategory, setRoomCategory] = useState<'DTS' | 'DKS'>('DTS');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (move) {
      // Parse date from YYYY-MM-DD format
      const [year, month, day] = move.date.split('-').map(Number);
      setDate(new Date(year, month - 1, day));
      setRoom(move.room);
      setRoomCategory(move.roomCategory);
      setComment(move.comment || '');
    }
  }, [move]);

  const handleSave = () => {
    if (!move || !date || !room) {
      return;
    }

    // Store date in YYYY-MM-DD format for consistent comparisons
    const dateStr = format(date, 'yyyy-MM-dd');

    const updatedMove: Move = {
      ...move,
      date: dateStr,
      room,
      roomCategory,
      comment: comment || undefined
    };

    onUpdateMove(updatedMove);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!move) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <div className="bg-card px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('editMove')}</DialogTitle>
            <DialogDescription className="sr-only">{t('editMoveDescription')}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 space-y-4 overflow-y-auto flex-1">
          {/* Date Picker */}
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
              {t('moveDate')} *
            </label>
            <DatePickerWithOk
              date={date}
              onSelect={setDate}
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
              value={room}
              onChange={(e) => setRoom(e.target.value)}
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
                variant={roomCategory === 'DTS' ? 'default' : 'outline'}
                onClick={() => setRoomCategory('DTS')}
                className="flex-1 h-12 rounded-2xl"
              >
                DTS
              </Button>
              <Button
                type="button"
                variant={roomCategory === 'DKS' ? 'default' : 'outline'}
                onClick={() => setRoomCategory('DKS')}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('addComment')}
              rows={2}
              className="rounded-2xl"
            />
          </div>
        </div>

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
              disabled={!date || !room}
            >
              {t('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
