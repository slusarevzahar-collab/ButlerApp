import { Task } from '../App';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageProvider';
import { SwipeableTabs } from './SwipeableTabs';

interface TasksViewProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

export function TasksView({ tasks, onUpdateTask, onDeleteTask, onAddTask }: TasksViewProps) {
  const { t } = useLanguage();
  
  // Separate tasks by category
  const mainTasks = tasks.filter(t => t.category === 'main' && t.status !== 'completed');
  const officeTasks = tasks.filter(t => t.category === 'office' && t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const tabs = [
    {
      id: 'main',
      label: t('mainTasks') || 'Основные',
      badge: mainTasks.length,
      content: (
        <div className="py-4 px-4 xs:px-5 sm:px-6 space-y-3">
          {mainTasks.length > 0 ? (
            mainTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))
          ) : (
            <motion.div 
              className="p-12 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t('noTasks') || 'No tasks'}
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'office',
      label: t('officeTasks') || 'Офис',
      badge: officeTasks.length,
      content: (
        <div className="py-4 px-4 xs:px-5 sm:px-6 space-y-3">
          {officeTasks.length > 0 ? (
            officeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))
          ) : (
            <motion.div 
              className="p-12 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t('noTasks') || 'No tasks'}
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'completed',
      label: t('completed') || 'Выполнено',
      badge: completedTasks.length,
      content: (
        <div className="py-4 px-4 xs:px-5 sm:px-6 space-y-3">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))
          ) : (
            <motion.div 
              className="p-12 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t('noTasks') || 'No tasks'}
            </motion.div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header with OneUI style */}
      <motion.div 
        className="flex-shrink-0 bg-card"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="px-4 xs:px-5 sm:px-6 pt-6 xs:pt-7 sm:pt-8 pb-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-foreground text-2xl xs:text-3xl truncate">{t('tasks') || 'Tasks'}</h1>
            <Button size="sm" onClick={onAddTask} className="h-10 xs:h-11 sm:h-12 px-4 xs:px-5 sm:px-6 rounded-3xl shadow-sm flex-shrink-0">
              <Plus className="w-4 h-4 xs:w-5 xs:h-5 sm:mr-2" />
              <span className="hidden xs:inline">{t('newTask') || 'New Task'}</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Swipeable Tabs */}
      <SwipeableTabs tabs={tabs} defaultTab="main" />
    </div>
  );
}
