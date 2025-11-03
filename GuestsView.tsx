import { useState } from 'react';
import { Guest } from '../App';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageProvider';
import { SwipeableTabs } from './SwipeableTabs';
import { GuestCard } from './GuestCard';
import { GuestsArchiveView } from './GuestsArchiveView';
import { motion } from 'motion/react';

interface GuestsViewProps {
  guests: Guest[];
  onUpdateGuestStatus?: (guestId: string, status: Guest['status']) => void;
  onUpdateGuestTransportation?: (guestId: string, transportation: Guest['transportation']) => void;
  onUpdateGuest?: (guestId: string, updates: Partial<Guest>) => void;
  onAddGuest?: () => void;
}

export function GuestsView({ guests, onUpdateGuestStatus, onUpdateGuestTransportation, onUpdateGuest, onAddGuest }: GuestsViewProps) {
  const { t } = useLanguage();
  const [expandedGuestId, setExpandedGuestId] = useState<string | null>(null);
  const [showArchiveView, setShowArchiveView] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('in-house');
  const [tabDragOffset, setTabDragOffset] = useState(0);
  const [isTabDragging, setIsTabDragging] = useState(false);

  const handleExpandChange = (guestId: string, expanded: boolean) => {
    if (expanded) {
      setExpandedGuestId(guestId);
    } else {
      setExpandedGuestId(null);
    }
  };

  const filterGuests = (status: string) => {
    let filtered = guests;
    
    if (status === 'in-house') {
      filtered = filtered.filter(guest => guest.status === 'checked-in');
    } else if (status === 'waiting') {
      filtered = filtered.filter(guest => guest.status === 'waiting');
    }

    return filtered;
  };

  const inHouseGuests = filterGuests('in-house');
  const waitingGuests = filterGuests('waiting');

  const tabs = [
    {
      id: 'in-house',
      label: t('checkedIn'),
      badge: inHouseGuests.length,
      content: (
        <div className="py-4 space-y-4">
          {inHouseGuests.length > 0 ? (
            inHouseGuests.map((guest) => (
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
              {t('noGuestsFound')}
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'waiting',
      label: t('waiting'),
      badge: waitingGuests.length,
      content: (
        <div className="py-4 space-y-4">
          {waitingGuests.length > 0 ? (
            waitingGuests.map((guest) => (
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
              {t('noWaitingGuests')}
            </motion.div>
          )}
        </div>
      )
    }
  ];

  // Show archive view if requested
  if (showArchiveView) {
    return (
      <GuestsArchiveView
        guests={guests}
        onUpdateGuestStatus={onUpdateGuestStatus}
        onUpdateGuestTransportation={onUpdateGuestTransportation}
        onUpdateGuest={onUpdateGuest}
        onClose={() => setShowArchiveView(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with OneUI style */}
      <motion.div 
        className="flex-shrink-0 bg-card relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="px-4 xs:px-5 sm:px-6 pt-6 xs:pt-7 sm:pt-8 pb-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-foreground text-2xl xs:text-3xl truncate">{t('guests')}</h1>
            <Button size="sm" onClick={onAddGuest} className="h-10 xs:h-11 sm:h-12 px-4 xs:px-5 sm:px-6 rounded-3xl shadow-sm flex-shrink-0">
              <Plus className="w-4 h-4 xs:w-5 xs:h-5 sm:mr-2" />
              <span className="hidden xs:inline">{t('addGuest')}</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tab Headers with Archive Button */}
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
            
            {/* Animated Indicator - follows finger during drag */}
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
          
          {/* Archive Button - appears after "waiting" tab */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowArchiveView(true)}
            className="h-11 px-2.5 xs:px-3 rounded-2xl flex items-center gap-1 flex-shrink-0 mr-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Swipeable Tabs Content - Only In-House and Waiting */}
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
    </div>
  );
}
