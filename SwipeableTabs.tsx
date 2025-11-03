import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number;
}

interface SwipeableTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  showTabHeaders?: boolean;
  onDragUpdate?: (dragOffset: number, isDragging: boolean) => void;
}

export function SwipeableTabs({ tabs, defaultTab, onTabChange, showTabHeaders = true, onDragUpdate }: SwipeableTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  // Sync with external defaultTab changes
  React.useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  if (!tabs || tabs.length === 0) {
    return <div>Loading...</div>;
  }

  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDirection(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !containerRef.current) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    const containerWidth = containerRef.current.offsetWidth;
    
    // Normalize the drag offset to -1 to 1 range
    let normalizedOffset = diff / containerWidth;
    
    // Prevent dragging beyond boundaries
    if ((safeIndex === 0 && normalizedOffset > 0) || 
        (safeIndex === tabs.length - 1 && normalizedOffset < 0)) {
      normalizedOffset = normalizedOffset * 0.3; // Add resistance at boundaries
    }
    
    setDragOffset(normalizedOffset);
    
    // Notify parent about drag
    if (onDragUpdate) {
      onDragUpdate(normalizedOffset, true);
    }
    
    // Determine direction
    if (normalizedOffset < 0) {
      setDirection('left');
    } else if (normalizedOffset > 0) {
      setDirection('right');
    }
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 0.2; // 20% swipe to trigger tab change
    
    // Swipe left (next tab)
    if (dragOffset < -threshold && safeIndex < tabs.length - 1) {
      handleTabChange(tabs[safeIndex + 1].id);
    } 
    // Swipe right (previous tab)
    else if (dragOffset > threshold && safeIndex > 0) {
      handleTabChange(tabs[safeIndex - 1].id);
    }
    
    // Notify parent that dragging ended
    if (onDragUpdate) {
      onDragUpdate(0, false);
    }
    
    // Reset
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setDirection(null);
  };

  // Calculate indicator position during drag
  const getIndicatorPosition = () => {
    if (!isDragging || dragOffset === 0) {
      return {
        left: `${(safeIndex / tabs.length) * 100}%`,
        width: `${100 / tabs.length}%`
      };
    }
    
    // Calculate position based on drag
    const basePosition = (safeIndex / tabs.length) * 100;
    const dragPercentage = dragOffset * 100;
    
    return {
      left: `${basePosition + dragPercentage}%`,
      width: `${100 / tabs.length}%`
    };
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tab Headers */}
      {showTabHeaders && (
        <div className="flex px-2 xs:px-4 sm:px-6 relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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
            style={isDragging ? getIndicatorPosition() : undefined}
            animate={!isDragging ? {
              left: `${(safeIndex / tabs.length) * 100}%`,
              width: `${100 / tabs.length}%`
            } : undefined}
            transition={!isDragging ? {
              type: 'spring',
              stiffness: 400,
              damping: 30,
              duration: 0.15
            } : undefined}
          />
        </div>
      )}

      {/* Tab Content with Slide + Fade Animation */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {isDragging ? (
          // During drag: show current and adjacent tabs with slide + fade
          <>
            {/* Current tab */}
            <div 
              className="absolute inset-0 overflow-y-auto"
              style={{ 
                transform: `translateX(${dragOffset * 100}%)`,
                opacity: 1 - Math.abs(dragOffset) * 0.5
              }}
            >
              {tabs[safeIndex]?.content}
            </div>
            
            {/* Next tab (when swiping left) */}
            {safeIndex < tabs.length - 1 && dragOffset < 0 && (
              <div 
                className="absolute inset-0 overflow-y-auto"
                style={{ 
                  transform: `translateX(${100 + dragOffset * 100}%)`,
                  opacity: Math.abs(dragOffset)
                }}
              >
                {tabs[safeIndex + 1]?.content}
              </div>
            )}
            
            {/* Previous tab (when swiping right) */}
            {safeIndex > 0 && dragOffset > 0 && (
              <div 
                className="absolute inset-0 overflow-y-auto"
                style={{ 
                  transform: `translateX(${-100 + dragOffset * 100}%)`,
                  opacity: Math.abs(dragOffset)
                }}
              >
                {tabs[safeIndex - 1]?.content}
              </div>
            )}
          </>
        ) : (
          // When not dragging: animated transition with slide + fade
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ 
                x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
                opacity: 0 
              }}
              animate={{ 
                x: 0,
                opacity: 1 
              }}
              exit={{ 
                x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
                opacity: 0 
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              className="h-full overflow-y-auto absolute inset-0"
            >
              {tabs[safeIndex]?.content}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
