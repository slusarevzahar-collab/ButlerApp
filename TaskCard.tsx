import { useState, useRef, useEffect } from 'react';
import { Task } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { 
  Clock, 
  User, 
  MoreVertical,
  CheckCircle2,
  PlayCircle,
  Circle,
  Trash2,
  AlertCircle,
  UserPlus,
  Users,
  Baby
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const priorityConfig = {
  urgent: { color: 'bg-red-500/10 text-red-600 dark:text-red-400', icon: AlertCircle },
  high: { color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400', icon: AlertCircle },
  normal: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: Circle },
  low: { color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', icon: Circle }
};

const statusConfig = {
  'pending': { label: 'Pending', icon: Circle, color: 'text-slate-600 dark:text-slate-400' },
  'in-progress': { label: 'In Progress', icon: PlayCircle, color: 'text-blue-600 dark:text-blue-400' },
  'completed': { label: 'Completed', icon: CheckCircle2, color: 'text-green-600 dark:text-green-400' }
};

export function TaskCard({ task, onUpdateTask, onDeleteTask }: TaskCardProps) {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('');
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const PriorityIcon = priorityConfig[task.priority].icon;
  const StatusIcon = statusConfig[task.status].icon;

  // Mock data for partners
  const partners = [
    { id: '1', name: 'Алексей Иванов' },
    { id: '2', name: 'Мария Петрова' },
    { id: '3', name: 'Дмитрий Сидоров' },
    { id: '4', name: 'Анна Козлова' }
  ];

  const handleTouchStart = () => {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      setShowAssignDialog(true);
      setIsPressed(false);
    }, 500); // 500ms for long press
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsPressed(false);
  };

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  const handleAssignToPartner = () => {
    if (selectedPartner) {
      const partner = partners.find(p => p.id === selectedPartner);
      // Here you would normally update the task with the assigned partner
      console.log(`Assigned task ${task.id} to ${partner?.name}`);
      setShowAssignDialog(false);
      setSelectedPartner('');
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        whileTap={{ scale: 0.98 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <Card className={`p-3 hover:shadow-md transition-shadow rounded-3xl border-0 shadow-sm ${
          task.status === 'completed' ? 'opacity-60' : ''
        } ${isPressed ? 'scale-95' : ''}`}>
          <div className="flex items-start gap-3">
            {/* Room Number Badge */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                <span className="text-foreground">{task.room}</span>
              </div>
            </div>

            {/* Task Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground text-sm truncate">{task.request}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <User className="w-3 h-3" />
                    <span className="truncate">{task.guestName}</span>
                    <span className="text-border">•</span>
                    <Clock className="w-3 h-3" />
                    <span>{task.time}</span>
                  </div>
                  
                  {/* Guest Count Display */}
                  {((task.adults || 0) > 0 || (task.children || 0) > 0 || (task.infants || 0) > 0) && (
                    <div className="flex items-center gap-2 mt-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 w-fit">
                      {(task.adults || 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                          <span className="text-xs text-slate-900 dark:text-white font-medium">{task.adults}</span>
                        </div>
                      )}
                      {(task.children || 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                          <span className="text-xs text-slate-900 dark:text-white font-medium">{task.children}</span>
                        </div>
                      )}
                      {(task.infants || 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <Baby className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                          <span className="text-xs text-slate-900 dark:text-white font-medium">{task.infants}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl">
                    <DropdownMenuItem onClick={() => onUpdateTask(task.id, { status: 'pending' })}>
                      <Circle className="w-4 h-4 mr-2" />
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateTask(task.id, { status: 'in-progress' })}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateTask(task.id, { status: 'completed' })}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign to Partner
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDeleteTask(task.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Compact Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="outline" className={`text-xs py-0 h-5 ${priorityConfig[task.priority].color} border-0`}>
                  <PriorityIcon className="w-2.5 h-2.5 mr-1" />
                  {task.priority}
                </Badge>
                <Badge variant="outline" className={`text-xs py-0 h-5 border-0 ${statusConfig[task.status].color} bg-transparent`}>
                  <StatusIcon className={`w-2.5 h-2.5 mr-1`} />
                  {statusConfig[task.status].label}
                </Badge>
              </div>

              {/* Notes - compact */}
              {task.notes && (
                <div className="bg-secondary rounded-xl p-2 mt-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{task.notes}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Assign to Partner Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>Назначить напарнику</DialogTitle>
            <DialogDescription>
              Выберите напарника для задачи "{task.request}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner(partner.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedPartner === partner.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-secondary hover:bg-secondary/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground text-sm">{partner.name}</div>
                    <div className="text-xs text-muted-foreground">Доступен</div>
                  </div>
                  {selectedPartner === partner.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)} className="rounded-2xl">
              Отмена
            </Button>
            <Button 
              onClick={handleAssignToPartner} 
              disabled={!selectedPartner}
              className="rounded-2xl"
            >
              Назначить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
