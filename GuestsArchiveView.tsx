import { useState } from 'react';
import { Guest } from '../App';
import { X, History } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageProvider';
import { SwipeableTabs } from './SwipeableTabs';
import { GuestCard } from './GuestCard';
import { motion } from 'motion/react';

interface GuestsArchiveViewProps {
  guests: Guest[];
  onUpdateGuestStatus?: (guestId: string, status: Guest['status']) => void;
  onUpdateGuestTransportation?: (guestId: string, transportation: Guest['transportation']) => void;
  onUpdateGuest?: (guestId: string, updates: Partial<Guest>) => void;
  onClose: () => void;
}

export function GuestsArchiveView({ 
  guests, 
  onUpdateGuestStatus, 
  onUpdateGuestTransportation, 
  onUpdateGuest,
  onClose 
}: GuestsArchiveViewProps) {
  const { t } = useLanguage();
  const [expandedGuestId, setExpandedGuestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('departed');
  const [tabDragOffset, setTabDragOffset] = useState(0);
  const [isTabDragging, setIsTabDragging] = useState(false);

  const handleExpandChange = (guestId: string, expanded: boolean) => {
    if (expanded) {
      setExpandedGuestId(guestId);
    } else {
      setExpandedGuestId(null);
    }
  };

  const departedGuests = guests.filter(guest => guest.status === 'departed');

  const tabs = [
    {
      id: 'departed',
      label: t('departed'),
      badge: departedGuests.length,
      content: (
        <div className="py-4 space-y-4 px-4">
          {departedGuests.length > 0 ? (
            departedGuests.map((guest) => (
              <GuestCard 
                key={guest.id} 
                guest={guest}
                onUpdateStatus={onUpdateGuestStatus}
                onUpdateTransportation={onUpdateGuestTransportation}
                onUpdateGuest={onUpdateGuest}
                isExpanded={expandedGuestId === guest.id}
                onExpandChange={handleExpandChange}
              />
            ))
          ) : (
            <motion.div 
              className="p-12 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t('noDepartedGuests')}
            </motion.div>
          )}
        </div>
      )
    }
  ];

  return (
    <motion.div 
      className="h-full flex flex-col bg-background"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-border">
        <div className="px-4 xs:px-5 sm:px-6 pt-6 xs:pt-7 sm:pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-foreground text-2xl xs:text-3xl flex items-center gap-2">
              <History className="w-7 h-7" />
              {t('archive') || 'Архив'}
            </h1>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-10 xs:h-11 sm:h-12 px-4 xs:px-5 sm:px-6 rounded-3xl flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              <span className="hidden xs:inline">{t('close') || 'Закрыть'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Headers */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="flex items-center relative">
          <div className="flex-1 flex px-2 xs:px-4 sm:px-6 relative">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedGuestId(null);
                }}
                className={`flex-1 px-1 xs:px-2 sm:px-4 py-3 relative transition-all duration-300 flex items-center justify-center min-w-0 ${
                  activeTab === tab.id ? 'text-foreground font-semibold' : 'text-muted-foreground'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center max-w-full text-sm sm:text-base gap-0.5 xs:gap-1">
                  <span className="truncate">{tab.label}</span>
                  {tab.badge !== undefined && <span className="text-xs opacity-60 flex-shrink-0">({tab.badge})</span>}
                </span>
              </button>
            ))}
            
            {/* Animated Indicator */}
            <motion.div
              className="absolute bottom-0 h-0.5 sm:h-1 bg-primary rounded-t-full"
              style={isTabDragging ? {
                left: `${((tabs.findIndex(t => t.id === activeTab) / tabs.length) * 100) + (tabDragOffset * 100)}%`,
                width: `${100 / tabs.length}%`
              } : undefined}
              animate={!isTabDragging ? {
                left: `${(tabs.findIndex(t => t.id === activeTab) / tabs.length) * 100}%`,
                width: `${100 / tabs.length}%`
              } : undefined}
              transition={!isTabDragging ? {
                type: 'spring',
                stiffness: 400,
                damping: 30,
                duration: 0.15
              } : undefined}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 relative">
        <SwipeableTabs 
          tabs={tabs} 
          defaultTab={activeTab} 
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            setExpandedGuestId(null);
          }}
          onDragUpdate={(offset, dragging) => {
            setTabDragOffset(offset);
            setIsTabDragging(dragging);
          }}
          showTabHeaders={false}
        />
      </div>
    </motion.div>
  );
}
