import { useState } from 'react';
import { GuestsView } from './components/GuestsView';
import { TasksView } from './components/TasksView';
import { ProfileView } from './components/ProfileView';
import { AIAssistantView } from './components/AIAssistantView';
import { AddTaskDialog } from './components/AddTaskDialog';
import { AddGuestDialog } from './components/AddGuestDialog';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider, useLanguage } from './components/LanguageProvider';
import { Users, ClipboardList, UserCircle, Bot } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

export interface Task {
  id: string;
  room: string;
  guestName: string;
  request: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: 'main' | 'office';
  time: string;
  notes?: string;
  adults?: number;
  children?: number;
  infants?: number;
}

export interface Move {
  id: string;
  date: string;
  room: string;
  roomCategory: 'DTS' | 'DKS';
  comment?: string;
}

export interface Guest {
  id: string;
  name: string;
  room: string;
  roomCategory: 'DTS' | 'DKS';
  checkIn: string;
  checkOut: string;
  status: 'checked-in' | 'waiting' | 'departed';
  phone: string;
  email: string;
  preferences?: string;
  transportation: 'car' | 'taxi' | 'transfer';
  carMake?: string;
  carModel?: string;
  licensePlate?: string;
  parkingSpot?: string;
  parkingPhoto?: string;
  adults?: number;
  children?: number;
  infants?: number;
  moves?: Move[];
}

export interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  category: 'task' | 'guest' | 'system';
}

const initialTasks: Task[] = [
  {
    id: '1',
    room: '501',
    guestName: 'Андрей Петрович Сидоров',
    request: 'Extra towels and pillows',
    priority: 'normal',
    status: 'pending',
    category: 'main',
    time: '10:30 AM',
    notes: 'Guest prefers hypoallergenic pillows',
    adults: 2,
    children: 1
  },
  {
    id: '2',
    room: '312',
    guestName: 'Елена Сергеевна Иванова',
    request: 'Restaurant reservation for 2',
    priority: 'high',
    status: 'in-progress',
    category: 'main',
    time: '09:15 AM',
    notes: 'Preferred time: 7:30 PM, Italian cuisine',
    adults: 2
  },
  {
    id: '3',
    room: '205',
    guestName: 'Дмитрий Александрович Козлов',
    request: 'Airport transfer at 6:00 AM',
    priority: 'urgent',
    status: 'pending',
    category: 'main',
    time: '08:00 AM',
    notes: 'Flight at 8:30 AM, terminal 2'
  },
  {
    id: '4',
    room: '410',
    guestName: 'Анна Викторовна Соколова',
    request: 'Room service breakfast',
    priority: 'normal',
    status: 'completed',
    category: 'main',
    time: '07:45 AM',
    notes: 'Continental breakfast delivered'
  },
  {
    id: '5',
    room: '302',
    guestName: 'Игорь Николаевич и Мария Павловна Волковы',
    request: 'Laundry service - express',
    priority: 'high',
    status: 'in-progress',
    category: 'main',
    time: '11:20 AM',
    notes: '3 suits, 5 shirts - needed by 4 PM'
  },
  {
    id: '6',
    room: 'Office',
    guestName: 'Hotel Management',
    request: 'Update guest database',
    priority: 'normal',
    status: 'pending',
    category: 'office',
    time: '02:00 PM',
    notes: 'Add new VIP guests to system'
  },
  {
    id: '9',
    room: 'Office',
    guestName: 'Front Desk',
    request: 'Prepare monthly report',
    priority: 'high',
    status: 'in-progress',
    category: 'office',
    time: '10:00 AM',
    notes: 'Due by end of day'
  },
  {
    id: '10',
    room: 'Office',
    guestName: 'Housekeeping',
    request: 'Inventory check - towels',
    priority: 'low',
    status: 'completed',
    category: 'office',
    time: '08:30 AM',
    notes: 'Completed and restocked'
  },
  {
    id: '7',
    room: '501',
    guestName: 'Алексей Владимирович и Ольга Ивановна Смирновы',
    request: 'Champagne and flowers for anniversary',
    priority: 'urgent',
    status: 'in-progress',
    category: 'main',
    time: '03:30 PM',
    notes: 'Moet & Chandon, red roses - deliver by 6 PM'
  },
  {
    id: '8',
    room: '103',
    guestName: 'Мария Дмитриевна Новикова',
    request: 'Late checkout request',
    priority: 'low',
    status: 'completed',
    category: 'main',
    time: '09:00 AM',
    notes: 'Approved until 3 PM'
  }
];

const initialGuests: Guest[] = [
  {
    id: '1',
    name: 'Алексей Владимирович и Ольга Ивановна Смирновы',
    room: '501',
    roomCategory: 'DTS',
    checkIn: '2025-11-01',
    checkOut: '2025-11-05',
    status: 'checked-in',
    phone: '+7 (999) 123-45-67',
    email: 'smirnov@email.com',
    preferences: 'Высокий этаж, тихий номер',
    transportation: 'car',
    carMake: 'Tesla',
    carModel: 'Model S',
    licensePlate: 'А123МР777',
    parkingSpot: 'P-15',
    adults: 2,
    children: 0,
    infants: 0,
    moves: [
      {
        id: '1',
        date: '2025-11-03',
        room: '601',
        roomCategory: 'DKS',
        comment: 'Upgrade to penthouse suite - переезд завтра'
      }
    ]
  },
  {
    id: '2',
    name: 'Андрей Петрович Сидоров',
    room: '312',
    roomCategory: 'DKS',
    checkIn: '2025-10-30',
    checkOut: '2025-11-04',
    status: 'checked-in',
    phone: '+7 (999) 234-56-78',
    email: 'sidorov@email.com',
    preferences: 'Дополнительные подушки, без перьев',
    transportation: 'taxi',
    carMake: 'City Taxi Co',
    adults: 1,
    children: 0,
    infants: 0
  },
  {
    id: '3',
    name: 'Елена Сергеевна Иванова',
    room: '205',
    roomCategory: 'DTS',
    checkIn: '2025-11-02',
    checkOut: '2025-11-06',
    status: 'checked-in',
    phone: '+7 (999) 345-67-89',
    email: 'ivanova@email.com',
    preferences: 'Для некурящих, вегетарианское меню',
    transportation: 'transfer',
    carMake: 'VIP Transfer Service',
    adults: 1,
    children: 1,
    infants: 0
  },
  {
    id: '4',
    name: 'Дмитрий Александрович Козлов',
    room: '410',
    roomCategory: 'DKS',
    checkIn: '2025-11-03',
    checkOut: '2025-11-03',
    status: 'waiting',
    phone: '+7 (999) 456-78-90',
    email: 'kozlov@email.com',
    preferences: 'Запрос на ранний заезд',
    transportation: 'car',
    carMake: 'BMW',
    carModel: '7 Series',
    licensePlate: 'В789КС777',
    adults: 2,
    children: 2,
    infants: 1
  },
  {
    id: '5',
    name: 'Анна Викторовна Соколова',
    room: '103',
    roomCategory: 'DTS',
    checkIn: '2025-10-28',
    checkOut: '2025-11-01',
    status: 'departed',
    phone: '+7 (999) 567-89-01',
    email: 'sokolova@email.com',
    preferences: 'Поздний выезд, ежедневная уборка',
    transportation: 'taxi',
    carMake: 'Express Taxi',
    adults: 1,
    children: 0,
    infants: 0
  },
  {
    id: '6',
    name: 'Игорь Николаевич и Мария Павловна Волковы',
    room: '302',
    roomCategory: 'DTS',
    checkIn: '2025-10-29',
    checkOut: '2025-11-02',
    status: 'departed',
    phone: '+7 (999) 678-90-12',
    email: 'volkov@email.com',
    preferences: 'Большая кровать, вид на океан',
    transportation: 'car',
    carMake: 'Mercedes',
    carModel: 'E-Class',
    licensePlate: 'С456НТ777',
    parkingSpot: 'P-22',
    adults: 2,
    children: 0,
    infants: 0
  },
  {
    id: '7',
    name: 'Виктор Сергеевич Морозов',
    room: '217',
    roomCategory: 'DKS',
    checkIn: '2025-11-01',
    checkOut: '2025-11-07',
    status: 'checked-in',
    phone: '+7 (999) 789-01-23',
    email: 'morozov@email.com',
    preferences: 'Номер с видом на парк',
    transportation: 'car',
    carMake: 'Audi',
    carModel: 'A8',
    licensePlate: 'Е789МК777',
    parkingSpot: 'P-08',
    adults: 1,
    children: 0,
    infants: 0
  },
  {
    id: '8',
    name: 'Татьяна Игоревна Белова',
    room: '425',
    roomCategory: 'DTS',
    checkIn: '2025-10-31',
    checkOut: '2025-11-05',
    status: 'checked-in',
    phone: '+7 (999) 890-12-34',
    email: 'belova@email.com',
    preferences: 'Гипоаллергенное постельное белье',
    transportation: 'transfer',
    carMake: 'Premium Transfer',
    adults: 2,
    children: 1,
    infants: 1
  },
  {
    id: '9',
    name: 'Константин Павлович Орлов',
    room: '118',
    roomCategory: 'DKS',
    checkIn: '2025-11-02',
    checkOut: '2025-11-08',
    status: 'checked-in',
    phone: '+7 (999) 901-23-45',
    email: 'orlov@email.com',
    preferences: 'Завтрак в номер, поздний выезд',
    transportation: 'taxi',
    carMake: 'Comfort Taxi',
    adults: 1,
    children: 0,
    infants: 0
  },
  {
    id: '10',
    name: 'Светлана Андреевна Кузнецова',
    room: '334',
    roomCategory: 'DTS',
    checkIn: '2025-11-01',
    checkOut: '2025-11-04',
    status: 'checked-in',
    phone: '+7 (999) 012-34-56',
    email: 'kuznetsova@email.com',
    preferences: 'Номер для некурящих, мини-бар без алкоголя',
    transportation: 'car',
    carMake: 'Lexus',
    carModel: 'RX 350',
    licensePlate: 'М234ВН777',
    parkingSpot: 'P-19',
    adults: 1,
    children: 2,
    infants: 0
  },
  {
    id: '11',
    name: 'Николай Викторович Лебедев',
    room: '507',
    roomCategory: 'DKS',
    checkIn: '2025-11-03',
    checkOut: '2025-11-10',
    status: 'waiting',
    phone: '+7 (999) 123-45-78',
    email: 'lebedev@email.com',
    preferences: 'VIP-уровень обслуживания',
    transportation: 'car',
    carMake: 'Porsche',
    carModel: 'Cayenne',
    licensePlate: 'Н567ОР777',
    adults: 2,
    children: 0,
    infants: 0
  },
  {
    id: '12',
    name: 'Ирина Олеговна Петрова',
    room: '221',
    roomCategory: 'DTS',
    checkIn: '2025-11-03',
    checkOut: '2025-11-06',
    status: 'waiting',
    phone: '+7 (999) 234-56-89',
    email: 'petrova@email.com',
    preferences: 'Тихий номер, вдали от лифта',
    transportation: 'transfer',
    carMake: 'Airport VIP Transfer',
    adults: 1,
    children: 1,
    infants: 0
  },
  {
    id: '13',
    name: 'Сергей Анатольевич Федоров',
    room: '609',
    roomCategory: 'DKS',
    checkIn: '2025-11-04',
    checkOut: '2025-11-09',
    status: 'waiting',
    phone: '+7 (999) 345-67-90',
    email: 'fedorov@email.com',
    preferences: 'Ранний заезд, номер на высоком этаже',
    transportation: 'taxi',
    carMake: 'Elite Taxi Service',
    adults: 1,
    children: 0,
    infants: 0
  },
  {
    id: '14',
    name: 'Мария Дмитриевна Новикова',
    room: '155',
    roomCategory: 'DTS',
    checkIn: '2025-10-27',
    checkOut: '2025-10-31',
    status: 'departed',
    phone: '+7 (999) 456-78-01',
    email: 'novikova@email.com',
    preferences: 'Номер с балконом',
    transportation: 'car',
    carMake: 'Volvo',
    carModel: 'XC90',
    licensePlate: 'Р890СТ777',
    parkingSpot: 'P-27',
    adults: 2,
    children: 2,
    infants: 0
  },
  {
    id: '15',
    name: 'Артём Геннадьевич Романов',
    room: '418',
    roomCategory: 'DKS',
    checkIn: '2025-10-28',
    checkOut: '2025-11-01',
    status: 'departed',
    phone: '+7 (999) 567-89-12',
    email: 'romanov@email.com',
    preferences: 'Доп. рабочее место в номере',
    transportation: 'transfer',
    carMake: 'Business Transfer',
    adults: 1,
    children: 0,
    infants: 0
  },
  {
    id: '16',
    name: 'Юлия Максимовна Захарова',
    room: '309',
    roomCategory: 'DTS',
    checkIn: '2025-10-26',
    checkOut: '2025-10-30',
    status: 'departed',
    phone: '+7 (999) 678-90-23',
    email: 'zakharova@email.com',
    preferences: 'Утренний кофе в номер',
    transportation: 'taxi',
    carMake: 'City Express Taxi',
    adults: 1,
    children: 1,
    infants: 1
  }
];

type NavItem = 'guests' | 'tasks' | 'profile' | 'assistant';

// Initial action history with example data
const generateInitialHistory = (): ActionHistoryItem[] => {
  const now = new Date();
  return [
    {
      id: '1',
      timestamp: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
      action: 'Task Completed',
      description: 'Marked "Airport transfer" as completed',
      category: 'task'
    },
    {
      id: '2',
      timestamp: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 minutes ago
      action: 'Guest Status Updated',
      description: 'Changed Дмитрий Козлов status to "Checked In"',
      category: 'guest'
    },
    {
      id: '3',
      timestamp: new Date(now.getTime() - 45 * 60000).toISOString(), // 45 minutes ago
      action: 'New Task Added',
      description: 'Added task "Extra towels and pillows" for room 501',
      category: 'task'
    },
    {
      id: '4',
      timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
      action: 'Guest Information Updated',
      description: 'Updated transportation details for Елена Иванова',
      category: 'guest'
    },
    {
      id: '5',
      timestamp: new Date(now.getTime() - 4 * 3600000).toISOString(), // 4 hours ago
      action: 'Task Priority Changed',
      description: 'Set "Restaurant reservation" to high priority',
      category: 'task'
    }
  ];
};

function AppContent() {
  const { t } = useLanguage();
  const [activeNav, setActiveNav] = useState<NavItem>('guests');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddGuestDialogOpen, setIsAddGuestDialogOpen] = useState(false);
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>(generateInitialHistory());

  const addActionHistory = (action: string, description: string, category: ActionHistoryItem['category']) => {
    const newAction: ActionHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      description,
      category
    };
    setActionHistory([newAction, ...actionHistory]);
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString()
    };
    setTasks([task, ...tasks]);
    setIsAddDialogOpen(false);
    toast.success('Task added successfully');
    addActionHistory('Task Added', `Added task "${newTask.request}" for ${newTask.guestName}`, 'task');
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    
    if (updates.status === 'completed') {
      toast.success('Task marked as completed');
      if (task) {
        addActionHistory('Task Completed', `Completed task "${task.request}" for ${task.guestName}`, 'task');
      }
    } else if (updates.status) {
      if (task) {
        addActionHistory('Task Status Updated', `Updated task "${task.request}" to ${updates.status}`, 'task');
      }
    } else if (updates.priority) {
      if (task) {
        addActionHistory('Task Priority Changed', `Changed priority of "${task.request}" to ${updates.priority}`, 'task');
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted');
    if (task) {
      addActionHistory('Task Deleted', `Deleted task "${task.request}"`, 'task');
    }
  };

  const handleAddGuest = (newGuest: Omit<Guest, 'id'>) => {
    const guest: Guest = {
      ...newGuest,
      id: Date.now().toString()
    };
    setGuests([guest, ...guests]);
    setIsAddGuestDialogOpen(false);
    toast.success('Guest added successfully');
    addActionHistory('Guest Added', `Added new guest "${newGuest.name}" in room ${newGuest.room}`, 'guest');
  };

  const handleUpdateGuestStatus = (guestId: string, status: Guest['status']) => {
    const guest = guests.find(g => g.id === guestId);
    setGuests(guests.map(guest =>
      guest.id === guestId ? { ...guest, status } : guest
    ));
    toast.success('Guest status updated');
    if (guest) {
      const statusText = status === 'checked-in' ? 'Checked In' : status === 'waiting' ? 'Waiting' : 'Departed';
      addActionHistory('Guest Status Updated', `Changed ${guest.name} status to "${statusText}"`, 'guest');
    }
  };

  const handleUpdateGuestTransportation = (guestId: string, transportation: Guest['transportation']) => {
    const guest = guests.find(g => g.id === guestId);
    setGuests(guests.map(guest =>
      guest.id === guestId ? { ...guest, transportation } : guest
    ));
    toast.success('Transportation updated');
    if (guest) {
      addActionHistory('Transportation Updated', `Updated transportation for ${guest.name} to "${transportation}"`, 'guest');
    }
  };

  const handleUpdateGuest = (guestId: string, updates: Partial<Guest>) => {
    const guest = guests.find(g => g.id === guestId);
    setGuests(guests.map(guest =>
      guest.id === guestId ? { ...guest, ...updates } : guest
    ));
    toast.success('Guest information updated');
    if (guest) {
      addActionHistory('Guest Information Updated', `Updated information for ${guest.name}`, 'guest');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeNav === 'guests' && (
            <motion.div
              key="guests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <GuestsView
                guests={guests}
                onUpdateGuestStatus={handleUpdateGuestStatus}
                onUpdateGuestTransportation={handleUpdateGuestTransportation}
                onUpdateGuest={handleUpdateGuest}
                onAddGuest={() => setIsAddGuestDialogOpen(true)}
              />
            </motion.div>
          )}
          {activeNav === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <TasksView
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onAddTask={() => setIsAddDialogOpen(true)}
              />
            </motion.div>
          )}
          {activeNav === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <AIAssistantView />
            </motion.div>
          )}
          {activeNav === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <ProfileView
                actionHistory={actionHistory}
                tasks={tasks}
                guests={guests}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 border-t border-border bg-card safe-area-bottom">
        <div className="h-20 flex items-center justify-around px-2">
          <motion.button
            onClick={() => setActiveNav('guests')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeNav === 'guests' ? 'text-primary' : 'text-muted-foreground'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{
                scale: activeNav === 'guests' ? 1.1 : 1,
                y: activeNav === 'guests' ? -2 : 0
              }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <Users className="w-6 h-6 mb-1" />
            </motion.div>
            <span className="text-xs truncate max-w-full px-1">{t('guests')}</span>
          </motion.button>
          
          <motion.button
            onClick={() => setActiveNav('tasks')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeNav === 'tasks' ? 'text-primary' : 'text-muted-foreground'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{
                scale: activeNav === 'tasks' ? 1.1 : 1,
                y: activeNav === 'tasks' ? -2 : 0
              }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <ClipboardList className="w-6 h-6 mb-1" />
            </motion.div>
            <span className="text-xs truncate max-w-full px-1">{t('tasks')}</span>
          </motion.button>
          
          <motion.button
            onClick={() => setActiveNav('assistant')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeNav === 'assistant' ? 'text-primary' : 'text-muted-foreground'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{
                scale: activeNav === 'assistant' ? 1.1 : 1,
                y: activeNav === 'assistant' ? -2 : 0
              }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <Bot className="w-6 h-6 mb-1" />
            </motion.div>
            <span className="text-xs truncate max-w-full px-1">{t('aiAssistant')}</span>
          </motion.button>
          
          <motion.button
            onClick={() => setActiveNav('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeNav === 'profile' ? 'text-primary' : 'text-muted-foreground'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{
                scale: activeNav === 'profile' ? 1.1 : 1,
                y: activeNav === 'profile' ? -2 : 0
              }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <UserCircle className="w-6 h-6 mb-1" />
            </motion.div>
            <span className="text-xs truncate max-w-full px-1">{t('profile')}</span>
          </motion.button>
        </div>
      </nav>

      {/* Dialogs */}
      <AddTaskDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddTask={handleAddTask}
      />

      <AddGuestDialog 
        open={isAddGuestDialogOpen}
        onOpenChange={setIsAddGuestDialogOpen}
        onAddGuest={handleAddGuest}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
