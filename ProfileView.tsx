import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { 
  User, 
  Bell, 
  Moon, 
  LogOut, 
  ChevronRight,
  ChevronDown,
  Settings,
  HelpCircle,
  Shield,
  Languages,
  Check,
  Camera,
  History,
  ClipboardCheck,
  Users as UsersIcon,
  Activity,
  Info,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  Plus,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { ActionHistoryItem, Task, Guest } from '../App';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { motion } from 'motion/react';
import { GuestCard } from './GuestCard';

interface ProfileViewProps {
  actionHistory: ActionHistoryItem[];
  tasks: Task[];
  guests: Guest[];
}

export function ProfileView({ actionHistory, tasks, guests }: ProfileViewProps) {
  const { theme, colorScheme, toggleTheme, setColorScheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showAppearanceDialog, setShowAppearanceDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isActivityHistoryExpanded, setIsActivityHistoryExpanded] = useState(false);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [isGuestHistoryExpanded, setIsGuestHistoryExpanded] = useState(false);
  const [selectedHistoryGuest, setSelectedHistoryGuest] = useState<Guest | null>(null);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    position: 'Butler',
    hotel: 'Grand Hotel',
    email: 'john.doe@grandhotel.com',
    phone: '+7 (999) 123-45-67',
    birthDate: '1990-05-15',
    employeeId: 'BTL-12345',
    department: 'Guest Services'
  });
  
  const languageLabels = {
    en: 'English',
    ru: 'Русский'
  };

  const colorSchemeLabels = {
    blue: 'Blue',
    purple: 'Purple',
    green: 'Green',
    orange: 'Orange',
    red: 'Red'
  };

  // Get departed guests for history
  const departedGuests = guests.filter(g => g.status === 'departed');

  // Partners data (mock)
  const [partners, setPartners] = useState([
    { id: '1', name: 'Алексей Иванов', initials: 'АИ', avatar: null, position: 'Butler', phone: '+7 (999) 111-22-33', email: 'alexey.i@hotel.com' },
    { id: '2', name: 'Мария Петрова', initials: 'МП', avatar: null, position: 'Butler', phone: '+7 (999) 444-55-66', email: 'maria.p@hotel.com' },
  ]);
  
  // Partner state
  const [showManagePartnersDialog, setShowManagePartnersDialog] = useState(false);
  const [selectedPartnerForView, setSelectedPartnerForView] = useState<typeof partners[0] | null>(null);
  const [newPartnerName, setNewPartnerName] = useState('');
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  
  // All available partners (mock)
  const [availablePartners, setAvailablePartners] = useState([
    { id: '1', name: 'Алексей Иванов', initials: 'АИ', avatar: null, position: 'Butler', phone: '+7 (999) 111-22-33', email: 'alexey.i@hotel.com' },
    { id: '2', name: 'Мария Петрова', initials: 'МП', avatar: null, position: 'Butler', phone: '+7 (999) 444-55-66', email: 'maria.p@hotel.com' },
    { id: '3', name: 'Дмитрий Смирнов', initials: 'ДС', avatar: null, position: 'Butler', phone: '+7 (999) 777-88-99', email: 'dmitry.s@hotel.com' },
    { id: '4', name: 'Елена Козлова', initials: 'ЕК', avatar: null, position: 'Senior Butler', phone: '+7 (999) 222-33-44', email: 'elena.k@hotel.com' },
    { id: '5', name: 'Игорь Васильев', initials: 'ИВ', avatar: null, position: 'Butler', phone: '+7 (999) 555-66-77', email: 'igor.v@hotel.com' },
  ]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Long press handlers for partner management
  const handlePartnerPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      // Long press - open management dialog
      setShowManagePartnersDialog(true);
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
    }, 500);
  };

  const handlePartnerPressEnd = (partnerId: string) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      
      // If long press timer was cleared, it means it was a short tap
      // Set a click timer to show partner info
      clickTimer.current = setTimeout(() => {
        const partner = partners.find(p => p.id === partnerId);
        if (partner) {
          setSelectedPartnerForView(partner);
        }
      }, 50);
    }
  };

  const handlePartnerPressCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
  };

  const handleAddPartner = (partnerId: string) => {
    const partnerToAdd = availablePartners.find(p => p.id === partnerId);
    if (partnerToAdd && !partners.find(p => p.id === partnerId)) {
      setPartners(prev => [...prev, partnerToAdd]);
    }
  };



  // Schedule data - two weeks
  const getTwoWeeks = () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const twoWeeks = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dayOfWeek = date.getDay();
      twoWeeks.push({
        day: days[dayOfWeek === 0 ? 6 : dayOfWeek - 1],
        date: date.getDate(),
        month: date.toLocaleDateString('ru-RU', { month: 'short' }),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString(),
        isWorkDay: i % 7 < 5, // Mon-Fri are work days (mock data)
        shift: i % 7 < 5 ? '08:00-20:00' : null
      });
    }
    return twoWeeks;
  };

  const twoWeeks = getTwoWeeks();
  
  // Get current month from schedule
  const getScheduleMonths = () => {
    const months = new Set(twoWeeks.map(day => day.month));
    return Array.from(months).join(' - ');
  };
  
  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Header with OneUI style */}
      <motion.div 
        className="flex-shrink-0 bg-card"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="px-4 xs:px-5 sm:px-6 pt-6 xs:pt-7 sm:pt-8 pb-4">
          <h1 className="text-foreground text-2xl xs:text-3xl">{t('profile')}</h1>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div 
        className="mx-3 xs:mx-4 mb-4 bg-card rounded-3xl shadow-sm p-4 xs:p-5 sm:p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  JD
                </AvatarFallback>
              )}
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-foreground">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-muted-foreground text-sm">{profileData.position} • {profileData.hotel}</p>
            <p className="text-muted-foreground text-sm mt-1">{profileData.email}</p>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <UsersIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-foreground text-sm font-semibold">Напарники</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {partners.length === 0 ? (
              <button
                className="w-full text-center py-4 hover:bg-secondary/50 rounded-2xl transition-colors active:scale-[0.98]"
                onMouseDown={handlePartnerPressStart}
                onMouseUp={() => handlePartnerPressEnd('')}
                onMouseLeave={handlePartnerPressCancel}
                onTouchStart={handlePartnerPressStart}
                onTouchEnd={() => handlePartnerPressEnd('')}
                onTouchCancel={handlePartnerPressCancel}
              >
                <p className="text-xs text-muted-foreground mb-2">Нет напарников</p>
                <p className="text-xs text-muted-foreground">Нажмите и удерживайте для управления</p>
              </button>
            ) : (
              <>
                {partners.map((partner) => (
                  <button
                    key={partner.id}
                    className="relative flex items-center gap-2 rounded-2xl px-2.5 py-1.5 bg-secondary hover:bg-secondary/70 active:scale-95 transition-all"
                    onMouseDown={handlePartnerPressStart}
                    onMouseUp={() => handlePartnerPressEnd(partner.id)}
                    onMouseLeave={handlePartnerPressCancel}
                    onTouchStart={handlePartnerPressStart}
                    onTouchEnd={() => handlePartnerPressEnd(partner.id)}
                    onTouchCancel={handlePartnerPressCancel}
                  >
                    <Avatar className="w-6 h-6">
                      {partner.avatar ? (
                        <AvatarImage src={partner.avatar} alt={partner.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {partner.initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-xs text-foreground">{partner.name}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <Button 
          variant="default" 
          className="w-full mt-4 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setShowEditProfileDialog(true)}
        >
          <User className="w-5 h-5 mr-2" />
          {t('editProfile')}
        </Button>
      </motion.div>

      {/* Work Schedule */}
      <motion.div 
        className="mx-3 xs:mx-4 mb-4 bg-card rounded-3xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
      >
        <button
          onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
          className="w-full px-4 xs:px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <h3 className="text-foreground font-semibold truncate">График смен</h3>
            <span className="text-xs xs:text-sm text-muted-foreground hidden xs:inline">• {getScheduleMonths()}</span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              isScheduleExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {!isScheduleExpanded && (
          <div className="px-6 pb-4">
            <div className="p-3 bg-secondary rounded-2xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Текущая смена:</span>
                <span className="text-foreground">08:00 - 20:00</span>
              </div>
            </div>
          </div>
        )}
        
        {isScheduleExpanded && (
          <motion.div 
            className="px-6 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-7 gap-2 mb-4">
              {twoWeeks.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
                    dayInfo.isToday
                      ? 'bg-primary text-primary-foreground'
                      : dayInfo.isWorkDay
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-secondary'
                  }`}
                >
                  <span className="text-xs mb-0.5">{dayInfo.day}</span>
                  <span className={`text-sm ${dayInfo.isToday ? 'font-medium' : ''}`}>
                    {dayInfo.date}
                  </span>
                  {dayInfo.shift && (
                    <div className="mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 bg-secondary rounded-2xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Текущая смена:</span>
                <span className="text-foreground">08:00 - 20:00</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Action History Section */}
      <motion.div 
        className="mx-3 xs:mx-4 mb-4 bg-card rounded-3xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.1 }}
      >
        <button
          onClick={() => setIsActivityHistoryExpanded(!isActivityHistoryExpanded)}
          className="w-full px-4 xs:px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <h3 className="text-foreground font-semibold truncate">{t('activityHistory')}</h3>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              isActivityHistoryExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {isActivityHistoryExpanded && (
          <motion.div 
            className="px-6 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {actionHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t('noActivityYet')}
                </div>
              ) : (
                actionHistory.slice(0, 20).map((item) => {
                  const getIcon = () => {
                    if (item.category === 'task') return <ClipboardCheck className="w-4 h-4" />;
                    if (item.category === 'guest') return <UsersIcon className="w-4 h-4" />;
                    return <Activity className="w-4 h-4" />;
                  };

                  const getColor = () => {
                    if (item.category === 'task') return 'bg-primary/10 text-primary';
                    if (item.category === 'guest') return 'bg-green-500/10 text-green-600 dark:text-green-500';
                    return 'bg-secondary text-muted-foreground';
                  };

                  const formatTime = (timestamp: string) => {
                    const date = new Date(timestamp);
                    const now = new Date();
                    const diffMs = now.getTime() - date.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    
                    if (diffMins < 1) return 'Just now';
                    if (diffMins < 60) return `${diffMins}m ago`;
                    const diffHours = Math.floor(diffMins / 60);
                    if (diffHours < 24) return `${diffHours}h ago`;
                    const diffDays = Math.floor(diffHours / 24);
                    return `${diffDays}d ago`;
                  };

                  return (
                    <div 
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-secondary rounded-2xl"
                    >
                      <div className={`${getColor()} p-2 rounded-xl flex-shrink-0`}>
                        {getIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground text-xs truncate">{item.action}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(item.timestamp)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Guest History Section */}
      <motion.div 
        className="mx-3 xs:mx-4 mb-4 bg-card rounded-3xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.15 }}
      >
        <button
          onClick={() => setIsGuestHistoryExpanded(!isGuestHistoryExpanded)}
          className="w-full px-4 xs:px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <History className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <h3 className="text-foreground font-semibold truncate">История гостей</h3>
            <span className="text-xs xs:text-sm text-muted-foreground flex-shrink-0">• {departedGuests.length}</span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              isGuestHistoryExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {isGuestHistoryExpanded && (
          <motion.div 
            className="px-6 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {departedGuests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Нет выехавших гостей
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {departedGuests.map((guest) => {
                  const formatDate = (dateStr: string) => {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
                  };
                  
                  return (
                    <button
                      key={guest.id}
                      onClick={() => setSelectedHistoryGuest(guest)}
                      className="w-full flex items-center gap-2 p-2 bg-secondary rounded-2xl hover:bg-secondary/70 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs">{guest.room}</span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-foreground text-xs truncate">{guest.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(guest.checkIn)} - {formatDate(guest.checkOut)}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Settings Cards */}
      <div className="px-3 xs:px-4 pb-4 space-y-3">
        {/* Preferences Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-card border-border rounded-3xl shadow-sm">
            <div className="w-full px-4 py-3 flex items-center justify-between border-b border-border last:border-b-0 h-14">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{t('darkMode') || 'Dark Mode'}</span>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>

            <button 
              onClick={() => setShowNotificationsDialog(true)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border last:border-b-0 h-14"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{t('notifications')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button 
              onClick={() => setShowAppearanceDialog(true)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border last:border-b-0 h-14"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Appearance</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border last:border-b-0 h-14">
                  <div className="flex items-center gap-3">
                    <Languages className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{t('language')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{languageLabels[language]}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  {language === 'en' && <Check className="w-4 h-4 mr-2" />}
                  {language !== 'en' && <span className="w-4 mr-2" />}
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ru')}>
                  {language === 'ru' && <Check className="w-4 h-4 mr-2" />}
                  {language !== 'ru' && <span className="w-4 mr-2" />}
                  Русский
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        </motion.div>

        {/* General Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.25 }}
        >
          <Card className="overflow-hidden bg-card border-border rounded-3xl shadow-sm">
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border last:border-b-0 h-16">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{t('settings')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border last:border-b-0 h-14">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{t('privacySecurity')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border last:border-b-0 h-14">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{t('helpSupport')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button 
              onClick={() => setShowAboutDialog(true)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border last:border-b-0 h-14"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">About</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </motion.div>

        {/* Logout Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.3 }}
        >
          <Card className="overflow-hidden bg-card border-border rounded-3xl shadow-sm">
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-destructive/10 transition-colors h-16 rounded-3xl">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-destructive" />
                <span className="text-destructive">{t('logOut')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-destructive/60" />
            </button>
          </Card>
        </motion.div>
      </div>

      {/* About Dialog */}
      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>Butler Assistant</DialogTitle>
            <DialogDescription>Hotel Butler Management System</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm text-foreground">1.0.0 (Build 45)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Released</span>
              <span className="text-sm text-foreground">November 2025</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Framework</span>
              <span className="text-sm text-foreground">React + TypeScript</span>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs text-muted-foreground text-center">
                © 2025 Butler Assistant. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Designed for professional hotel butlers
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Settings Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>{t('notifications')}</DialogTitle>
            <DialogDescription>Manage your notification preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-foreground">Enable Notifications</div>
                  <div className="text-xs text-muted-foreground">Receive all notifications</div>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-foreground">Email Notifications</div>
                  <div className="text-xs text-muted-foreground">Get updates via email</div>
                </div>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
                disabled={!notificationsEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-foreground">Push Notifications</div>
                  <div className="text-xs text-muted-foreground">Get push notifications</div>
                </div>
              </div>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications}
                disabled={!notificationsEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-foreground">Sound & Vibration</div>
                  <div className="text-xs text-muted-foreground">Enable sound alerts</div>
                </div>
              </div>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled}
                disabled={!notificationsEnabled}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appearance Settings Dialog */}
      <Dialog open={showAppearanceDialog} onOpenChange={setShowAppearanceDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>Appearance</DialogTitle>
            <DialogDescription>Customize the look and feel of the app</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            {/* Theme Selection */}
            <div>
              <div className="text-sm text-foreground mb-3">Theme</div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-5 rounded-3xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400" />
                    </div>
                    <span className="text-sm text-foreground">Light</span>
                    {theme === 'light' && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-5 rounded-3xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-slate-700 flex items-center justify-center shadow-sm">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-500" />
                    </div>
                    <span className="text-sm text-foreground">Dark</span>
                    {theme === 'dark' && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Color Scheme Selection */}
            <div>
              <div className="text-sm text-foreground mb-3">Color Scheme</div>
              <div className="grid grid-cols-5 gap-3">
                <button
                  onClick={() => setColorScheme('blue')}
                  className={`p-3 rounded-3xl border-2 transition-all ${
                    colorScheme === 'blue'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#0a84ff]" />
                    {colorScheme === 'blue' && <Check className="w-3 h-3 text-primary" />}
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('purple')}
                  className={`p-3 rounded-3xl border-2 transition-all ${
                    colorScheme === 'purple'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#af52de] dark:bg-[#bf5af2]" />
                    {colorScheme === 'purple' && <Check className="w-3 h-3 text-primary" />}
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('green')}
                  className={`p-3 rounded-3xl border-2 transition-all ${
                    colorScheme === 'green'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#34c759] dark:bg-[#32d74b]" />
                    {colorScheme === 'green' && <Check className="w-3 h-3 text-primary" />}
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('orange')}
                  className={`p-3 rounded-3xl border-2 transition-all ${
                    colorScheme === 'orange'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#ff9500] dark:bg-[#ff9f0a]" />
                    {colorScheme === 'orange' && <Check className="w-3 h-3 text-primary" />}
                  </div>
                </button>
                <button
                  onClick={() => setColorScheme('red')}
                  className={`p-3 rounded-3xl border-2 transition-all ${
                    colorScheme === 'red'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#ff3b30] dark:bg-[#ff453a]" />
                    {colorScheme === 'red' && <Check className="w-3 h-3 text-primary" />}
                  </div>
                </button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                {colorSchemeLabels[colorScheme]}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest History Card Dialog */}
      <Dialog open={selectedHistoryGuest !== null} onOpenChange={() => setSelectedHistoryGuest(null)}>
        <DialogContent className="rounded-3xl max-w-md p-0 overflow-hidden" aria-describedby={undefined}>
          <div className="max-h-[80vh] overflow-y-auto">
            {selectedHistoryGuest && (
              <GuestCard 
                guest={selectedHistoryGuest} 
                onUpdateGuest={() => {}}
                isFromHistory={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Partner Info Dialog */}
      <Dialog open={selectedPartnerForView !== null} onOpenChange={() => setSelectedPartnerForView(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          {selectedPartnerForView && (
            <>
              <DialogHeader>
                <DialogTitle>Информация о напарнике</DialogTitle>
                <DialogDescription>Контактные данные и информация о коллеге</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-2">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    {selectedPartnerForView.avatar ? (
                      <AvatarImage src={selectedPartnerForView.avatar} alt={selectedPartnerForView.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {selectedPartnerForView.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-foreground">{selectedPartnerForView.name}</h3>
                    <p className="text-sm text-muted-foreground">{(selectedPartnerForView as any).position || 'Butler'}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-2xl">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm text-foreground">{(selectedPartnerForView as any).email || 'partner@hotel.com'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-2xl">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Телефон</p>
                      <p className="text-sm text-foreground">{(selectedPartnerForView as any).phone || '+7 (999) 000-00-00'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 rounded-2xl"
                    onClick={() => {
                      // Open WhatsApp or phone
                      setSelectedPartnerForView(null);
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Позвонить
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 rounded-2xl"
                    onClick={() => {
                      // Open email
                      setSelectedPartnerForView(null);
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Написать
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Partners Dialog */}
      <Dialog open={showManagePartnersDialog} onOpenChange={setShowManagePartnersDialog}>
        <DialogContent className="rounded-3xl max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Управление напарниками</DialogTitle>
            <DialogDescription>Добавьте или удалите напарников из вашей команды</DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 px-1">
            <div className="space-y-4 pt-4">
              {/* Add New Partner */}
              <div>
                <h3 className="text-sm text-foreground font-semibold mb-3">Добавить нового</h3>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Имя напарника"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    className="h-11 rounded-2xl flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newPartnerName.trim()) {
                        const initials = newPartnerName.trim().split(' ').map(n => n[0]).join('').toUpperCase();
                        const newPartner = {
                          id: Date.now().toString(),
                          name: newPartnerName.trim(),
                          initials: initials,
                          avatar: null,
                          position: 'Butler',
                          phone: '+7 (999) 000-00-00',
                          email: 'new.partner@hotel.com'
                        };
                        setPartners(prev => [...prev, newPartner]);
                        setAvailablePartners(prev => [...prev, newPartner]);
                        setNewPartnerName('');
                      }
                    }}
                  />
                  <Button 
                    className="h-11 rounded-2xl px-6"
                    disabled={!newPartnerName.trim()}
                    onClick={() => {
                      if (newPartnerName.trim()) {
                        const initials = newPartnerName.trim().split(' ').map(n => n[0]).join('').toUpperCase();
                        const newPartner = {
                          id: Date.now().toString(),
                          name: newPartnerName.trim(),
                          initials: initials,
                          avatar: null,
                          position: 'Butler',
                          phone: '+7 (999) 000-00-00',
                          email: 'new.partner@hotel.com'
                        };
                        setPartners(prev => [...prev, newPartner]);
                        setAvailablePartners(prev => [...prev, newPartner]);
                        setNewPartnerName('');
                      }
                    }}
                  >
                    Добавить
                  </Button>
                </div>
              </div>

              {/* Available Partners */}
              <div className="pt-2">
                <h3 className="text-sm text-foreground font-semibold mb-3">Доступные напарники</h3>
                <div className="space-y-2">
                  {availablePartners.filter(ap => !partners.find(p => p.id === ap.id)).map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => handleAddPartner(partner.id)}
                      className="w-full flex items-center gap-3 p-3 bg-secondary rounded-2xl hover:bg-secondary/70 transition-colors"
                    >
                      <Avatar className="w-8 h-8">
                        {partner.avatar ? (
                          <AvatarImage src={partner.avatar} alt={partner.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {partner.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm text-foreground flex-1 text-left">{partner.name}</span>
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                  {availablePartners.filter(ap => !partners.find(p => p.id === ap.id)).length === 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      Все доступные напарники уже добавлены
                    </div>
                  )}
                </div>
              </div>

              {/* Current Partners */}
              {partners.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-sm text-foreground font-semibold mb-3">Текущие напарники</h3>
                  <div className="space-y-2">
                    {partners.map((partner) => (
                      <div
                        key={partner.id}
                        className="flex items-center gap-3 p-3 bg-secondary rounded-2xl"
                      >
                        <Avatar className="w-8 h-8">
                          {partner.avatar ? (
                            <AvatarImage src={partner.avatar} alt={partner.name} />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {partner.initials}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm text-foreground flex-1">{partner.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setPartners(prev => prev.filter(p => p.id !== partner.id));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              className="flex-1 h-11 rounded-2xl"
              onClick={() => setShowManagePartnersDialog(false)}
            >
              Готово
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent className="rounded-3xl max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
            <DialogDescription>Обновите информацию о вашем профиле</DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 px-1">
            <div className="space-y-4 pt-4">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm text-foreground font-semibold mb-3">Личная информация</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Имя</label>
                      <Input 
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="h-11 rounded-2xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Фамилия</label>
                      <Input 
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="h-11 rounded-2xl"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Дата рождения</label>
                    <Input 
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      className="h-11 rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-2">
                <h3 className="text-sm text-foreground font-semibold mb-3">Контактная информация</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                    <Input 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="h-11 rounded-2xl"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Телефон</label>
                    <Input 
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="h-11 rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="pt-2">
                <h3 className="text-sm text-foreground mb-3">Рабочая информация</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Должность</label>
                    <Input 
                      value={profileData.position}
                      onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                      className="h-11 rounded-2xl"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Отель</label>
                    <Input 
                      value={profileData.hotel}
                      onChange={(e) => setProfileData({...profileData, hotel: e.target.value})}
                      className="h-11 rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Отдел</label>
                    <Input 
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      className="h-11 rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">ID сотрудника</label>
                    <Input 
                      value={profileData.employeeId}
                      onChange={(e) => setProfileData({...profileData, employeeId: e.target.value})}
                      className="h-11 rounded-2xl"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="flex-1 h-11 rounded-2xl"
              onClick={() => setShowEditProfileDialog(false)}
            >
              Отмена
            </Button>
            <Button 
              className="flex-1 h-11 rounded-2xl"
              onClick={() => {
                // Save logic here
                setShowEditProfileDialog(false);
              }}
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
