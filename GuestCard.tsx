import { useState, useRef } from 'react';
import { Guest, Move } from '../App';
import { Badge } from './ui/badge';
import { Phone, Calendar, DoorOpen, Info, MessageCircle, Car, ParkingSquare, ChevronDown, Check, ArrowRightLeft, Edit, X, Upload, Trash2, Image as ImageIcon, Plus, Minus, Users, User, Baby, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from './LanguageProvider';
import { AddMoveDialog } from './AddMoveDialog';
import { EditMoveDialog } from './EditMoveDialog';

interface GuestCardProps {
  guest: Guest;
  onUpdateStatus?: (guestId: string, status: Guest['status']) => void;
  onUpdateTransportation?: (guestId: string, transportation: Guest['transportation']) => void;
  onUpdateGuest?: (guestId: string, updates: Partial<Guest>) => void;
  isFromHistory?: boolean;
  isExpanded?: boolean;
  onExpandChange?: (guestId: string, expanded: boolean) => void;
}

const roomCategoryConfig = {
  'DTS': { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
  'DKS': { color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400 border-pink-200 dark:border-pink-800' }
};

export function GuestCard({ guest, onUpdateStatus, onUpdateTransportation, onUpdateGuest, isFromHistory = false, isExpanded: controlledExpanded, onExpandChange }: GuestCardProps) {
  const { t, language, formatDate } = useLanguage();
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  
  const setIsExpanded = (value: boolean) => {
    if (onExpandChange) {
      onExpandChange(guest.id, value);
    } else {
      setInternalExpanded(value);
    }
  };
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Guest['status'] | null>(null);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isGuestCountDialogOpen, setIsGuestCountDialogOpen] = useState(false);
  const [isConfirmGuestCountOpen, setIsConfirmGuestCountOpen] = useState(false);
  const [isGuestCountExpanded, setIsGuestCountExpanded] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isEditMoveDialogOpen, setIsEditMoveDialogOpen] = useState(false);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const parkingPhotoInputRef = useRef<HTMLInputElement>(null);
  
  // Edit state for car details and parking
  const [editCarMake, setEditCarMake] = useState(guest.carMake || '');
  const [editCarModel, setEditCarModel] = useState(guest.carModel || '');
  const [editLicensePlate, setEditLicensePlate] = useState(guest.licensePlate || '');
  const [editParkingSpot, setEditParkingSpot] = useState(guest.parkingSpot || '');
  const [editParkingPhoto, setEditParkingPhoto] = useState(guest.parkingPhoto || '');
  
  const [editPreferences, setEditPreferences] = useState(guest.preferences || '');
  
  // Edit state for room details
  const [editRoom, setEditRoom] = useState(guest.room || '');
  const [editRoomCategory, setEditRoomCategory] = useState<'DTS' | 'DKS'>(guest.roomCategory || 'DTS');
  
  // Edit state for guest count
  const [editAdults, setEditAdults] = useState(guest.adults || 0);
  const [editChildren, setEditChildren] = useState(guest.children || 0);
  const [editInfants, setEditInfants] = useState(guest.infants || 0);

  const statusConfig = {
    'checked-in': { label: t('checkedIn'), color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800' },
    'waiting': { label: t('waiting'), color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
    'departed': { label: t('departed'), color: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-700' }
  };

  const transportationConfig = {
    'car': { label: t('personalCar'), color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
    'taxi': { label: t('taxi'), color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
    'transfer': { label: t('transfer'), color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-purple-200 dark:border-purple-800' }
  };

  const handleStatusClick = (e: Event, newStatus: Guest['status']) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingStatus(newStatus);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus && onUpdateStatus) {
      onUpdateStatus(guest.id, pendingStatus);
    }
    setIsConfirmDialogOpen(false);
    setPendingStatus(null);
  };

  const handleTransportationChange = (e: Event, transportation: Guest['transportation']) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUpdateTransportation) {
      onUpdateTransportation(guest.id, transportation);
    }
  };

  const handleOpenCarDialog = () => {
    setEditCarMake(guest.carMake || '');
    setEditCarModel(guest.carModel || '');
    setEditLicensePlate(guest.licensePlate || '');
    setEditParkingSpot(guest.parkingSpot || '');
    setEditParkingPhoto(guest.parkingPhoto || '');
    setIsCarDialogOpen(true);
  };

  const handleSaveCarDetails = () => {
    if (onUpdateGuest) {
      onUpdateGuest(guest.id, {
        carMake: editCarMake,
        carModel: editCarModel,
        licensePlate: editLicensePlate,
        parkingSpot: editParkingSpot,
        parkingPhoto: editParkingPhoto
      });
    }
    setIsCarDialogOpen(false);
  };

  const handleParkingPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditParkingPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveParkingPhoto = () => {
    setEditParkingPhoto('');
  };

  const handleOpenGuestCountDialog = () => {
    setEditAdults(guest.adults || 0);
    setEditChildren(guest.children || 0);
    setEditInfants(guest.infants || 0);
    setIsGuestCountDialogOpen(true);
  };

  const handleSaveGuestCount = () => {
    setIsGuestCountDialogOpen(false);
    setIsConfirmGuestCountOpen(true);
  };

  const handleConfirmGuestCount = () => {
    if (onUpdateGuest) {
      onUpdateGuest(guest.id, {
        adults: editAdults,
        children: editChildren,
        infants: editInfants
      });
    }
    setIsConfirmGuestCountOpen(false);
  };

  const updateGuestCount = (field: 'adults' | 'children' | 'infants', delta: number) => {
    if (field === 'adults') {
      setEditAdults(Math.max(0, editAdults + delta));
    } else if (field === 'children') {
      setEditChildren(Math.max(0, editChildren + delta));
    } else if (field === 'infants') {
      setEditInfants(Math.max(0, editInfants + delta));
    }
  };

  const handleSaveNotes = () => {
    if (onUpdateGuest) {
      onUpdateGuest(guest.id, {
        preferences: editPreferences
      });
    }
    setIsEditingNotes(false);
  };

  // Long press handlers for room number
  const handleRoomTouchStart = () => {
    const timer = setTimeout(() => {
      setEditRoom(guest.room);
      setEditRoomCategory(guest.roomCategory);
      setIsRoomDialogOpen(true);
    }, 500); // 500ms long press
    setLongPressTimer(timer);
  };

  const handleRoomTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleSaveRoomDetails = () => {
    if (onUpdateGuest) {
      onUpdateGuest(guest.id, {
        room: editRoom,
        roomCategory: editRoomCategory
      });
    }
    setIsRoomDialogOpen(false);
  };

  const handleAddMoves = (newMoves: Omit<Move, 'id'>[]) => {
    const movesWithIds: Move[] = newMoves.map((move, index) => ({
      ...move,
      id: `${Date.now()}-${index}`
    }));

    if (onUpdateGuest) {
      const existingMoves = guest.moves || [];
      onUpdateGuest(guest.id, {
        moves: [...existingMoves, ...movesWithIds]
      });
    }
  };

  const getVehicleDisplayText = () => {
    if (guest.transportation === 'car' && guest.carMake && guest.carModel) {
      return `${guest.carMake} ${guest.carModel}`;
    }
    if (guest.transportation === 'taxi' && guest.carMake) {
      return guest.carMake;
    }
    if (guest.transportation === 'transfer' && guest.carMake) {
      return guest.carMake;
    }
    return '-';
  };

  // Check if guest has a move tomorrow
  const hasMoveTomorrow = () => {
    if (!guest.moves || guest.moves.length === 0) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return guest.moves.some(move => {
      // Parse date string in YYYY-MM-DD format
      const [year, month, day] = move.date.split('-').map(Number);
      const moveDate = new Date(year, month - 1, day);
      moveDate.setHours(0, 0, 0, 0);
      return moveDate.getTime() === tomorrow.getTime();
    });
  };

  // Get the room number for move tomorrow
  const getMoveTomorrowRoom = () => {
    if (!guest.moves || guest.moves.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tomorrowMove = guest.moves.find(move => {
      // Parse date string in YYYY-MM-DD format
      const [year, month, day] = move.date.split('-').map(Number);
      const moveDate = new Date(year, month - 1, day);
      moveDate.setHours(0, 0, 0, 0);
      return moveDate.getTime() === tomorrow.getTime();
    });
    
    return tomorrowMove || null;
  };

  const handleDeleteMove = (moveId: string) => {
    if (onUpdateGuest) {
      const updatedMoves = (guest.moves || []).filter(move => move.id !== moveId);
      onUpdateGuest(guest.id, {
        moves: updatedMoves
      });
    }
  };

  const handleEditMove = (move: Move) => {
    setSelectedMove(move);
    setIsEditMoveDialogOpen(true);
  };

  const handleUpdateMove = (updatedMove: Move) => {
    if (onUpdateGuest) {
      const updatedMoves = (guest.moves || []).map(move => 
        move.id === updatedMove.id ? updatedMove : move
      );
      onUpdateGuest(guest.id, {
        moves: updatedMoves
      });
    }
  };

  const isMovingTomorrow = hasMoveTomorrow();
  const moveTomorrow = getMoveTomorrowRoom();

  // Extract last name for compact view
  const getLastName = (fullName: string) => {
    const parts = fullName.split(' ');
    return parts[parts.length - 1];
  };

  // Determine status color for indicator
  const getStatusColor = () => {
    switch (guest.status) {
      case 'checked-in':
        return 'bg-green-500 dark:bg-green-400';
      case 'waiting':
        return 'bg-amber-500 dark:bg-amber-400';
      case 'departed':
        return 'bg-slate-400 dark:bg-slate-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <>
      <Dialog>
        <motion.div 
          className="mx-4 bg-card rounded-3xl shadow-sm transition-all"
          layout
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            type: 'tween',
            duration: 0.15
          }}
        >
          {/* Compact View */}
          {!isExpanded && (
            <div 
              className="p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => setIsExpanded(true)}
            >
              {/* Room Number with Category */}
              <div 
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${
                  isMovingTomorrow 
                    ? 'bg-blue-100 dark:bg-blue-950 ring-2 ring-blue-400 dark:ring-blue-600' 
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
                onTouchStart={handleRoomTouchStart}
                onTouchEnd={handleRoomTouchEnd}
                onMouseDown={handleRoomTouchStart}
                onMouseUp={handleRoomTouchEnd}
                onMouseLeave={handleRoomTouchEnd}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={`${isMovingTomorrow ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                  {guest.room}
                </span>
                {/* Room Category Badge inside room box */}
                <span className={`text-[9px] mt-0.5 opacity-60 ${isMovingTomorrow ? 'text-blue-600 dark:text-blue-500' : 'text-slate-600 dark:text-slate-400'}`}>
                  {guest.roomCategory || 'DTS'}
                </span>
              </div>

              {/* Guest Last Name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-slate-900 dark:text-white truncate">{getLastName(guest.name)}</h3>
                
                {/* Guest Count - Compact Icons Only */}
                {((guest.adults || 0) > 0 || (guest.children || 0) > 0 || (guest.infants || 0) > 0) && (
                  <div className="flex items-center gap-2 mt-1">
                    {(guest.adults || 0) > 0 && (
                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{guest.adults}</span>
                      </div>
                    )}
                    {(guest.children || 0) > 0 && (
                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>{guest.children}</span>
                      </div>
                    )}
                    {(guest.infants || 0) > 0 && (
                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <Baby className="w-3.5 h-3.5" />
                        <span>{guest.infants}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className={`w-4 h-4 rounded-full ${getStatusColor()} flex-shrink-0`} />

              {/* Expand Icon */}
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
            </div>
          )}

          {/* Expanded View */}
          {isExpanded && (
            <DialogTrigger asChild>
              <div 
                className="p-5 cursor-pointer"
                onClick={() => {}}
              >
                <div className="flex items-start gap-4">
                  {/* Room Number with Category Inside */}
                  <div className="flex-shrink-0">
                    <div 
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform ${
                        isMovingTomorrow 
                          ? 'bg-blue-100 dark:bg-blue-950 ring-2 ring-blue-400 dark:ring-blue-600' 
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onTouchStart={handleRoomTouchStart}
                      onTouchEnd={handleRoomTouchEnd}
                      onMouseDown={handleRoomTouchStart}
                      onMouseUp={handleRoomTouchEnd}
                      onMouseLeave={handleRoomTouchEnd}
                    >
                      <span className={`text-lg ${isMovingTomorrow ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {guest.room}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`${
                          isMovingTomorrow 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-300 dark:border-blue-700' 
                            : roomCategoryConfig[guest.roomCategory].color
                        } text-xs px-1.5 py-0 h-4 border mt-0.5`}
                      >
                        {guest.roomCategory}
                      </Badge>
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name and Collapse Button */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-slate-900 dark:text-white text-lg flex-1 min-w-0">{guest.name}</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400 rotate-180" />
                      </button>
                    </div>

                    {/* Guest Count - Display Only */}
                    {((guest.adults || 0) > 0 || (guest.children || 0) > 0 || (guest.infants || 0) > 0) && (
                      <div className="mb-3">
                        <div className="flex items-center gap-3">
                          {(guest.adults || 0) > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">{guest.adults}</span>
                            </div>
                          )}
                          {(guest.children || 0) > 0 && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">{guest.children}</span>
                            </div>
                          )}
                          {(guest.infants || 0) > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Baby className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">{guest.infants}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Move Tomorrow Badge */}
                    {isMovingTomorrow && moveTomorrow && guest.status === 'checked-in' && (
                      <div className="mb-2">
                        <Badge 
                          variant="outline" 
                          className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-300 dark:border-blue-700 px-2 py-0.5"
                        >
                          {t('move')} <ArrowRight className="w-3 h-3 mx-1 inline" /> {moveTomorrow.room}
                        </Badge>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(guest.checkIn)}</span>
                      <span className="text-slate-300 dark:text-slate-600">→</span>
                      <span>{formatDate(guest.checkOut)}</span>
                    </div>

                    {/* Chat and Status Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 rounded-xl bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          const phoneNumber = guest.phone.replace(/\D/g, '');
                          window.open(`https://wa.me/${phoneNumber}`, '_blank');
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        {t('chat')}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`flex-1 h-9 rounded-xl ${statusConfig[guest.status].color}`}
                          >
                            {statusConfig[guest.status].label}
                            <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl">
                          <DropdownMenuItem onClick={(e) => handleStatusClick(e, 'waiting')}>
                            {guest.status === 'waiting' && <Check className="w-4 h-4 mr-2" />}
                            {guest.status !== 'waiting' && <span className="w-4 mr-2" />}
                            {t('waiting')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleStatusClick(e, 'checked-in')}>
                            {guest.status === 'checked-in' && <Check className="w-4 h-4 mr-2" />}
                            {guest.status !== 'checked-in' && <span className="w-4 mr-2" />}
                            {t('checkedIn')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleStatusClick(e, 'departed')}>
                            {guest.status === 'departed' && <Check className="w-4 h-4 mr-2" />}
                            {guest.status !== 'departed' && <span className="w-4 mr-2" />}
                            {t('checkOut')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
          )}
        </motion.div>
        <DialogTrigger asChild>
          <div className="hidden" />
        </DialogTrigger>

        <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 [&>button[data-slot='dialog-close']]:hidden">
          {/* Floating Close Button */}
          <DialogClose className="fixed right-6 top-6 z-50 rounded-2xl opacity-80 ring-offset-background transition-all hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-card/90 backdrop-blur-md p-3 shadow-xl">
            <X className="h-7 w-7" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl pr-8">{t('guestDetails')}</DialogTitle>
              <DialogDescription className="sr-only">{t('viewEditGuestDetails')}</DialogDescription>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-5">
            {/* Room & Name & Status */}
            <div className="flex items-center gap-4 pt-2">
              <div 
                className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
                onTouchStart={handleRoomTouchStart}
                onTouchEnd={handleRoomTouchEnd}
                onMouseDown={handleRoomTouchStart}
                onMouseUp={handleRoomTouchEnd}
                onMouseLeave={handleRoomTouchEnd}
              >
                <span className="text-slate-900 dark:text-white text-2xl">{guest.room}</span>
                <Badge 
                  variant="outline" 
                  className={`${roomCategoryConfig[guest.roomCategory].color} text-xs px-2 py-0.5 h-5 border-2 mt-1`}
                >
                  {guest.roomCategory}
                </Badge>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white text-xl mb-1.5">{guest.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="outline-none">
                      <Badge variant="outline" className={`${statusConfig[guest.status].color} cursor-pointer hover:bg-opacity-20 transition-colors px-3 py-1`}>
                        {statusConfig[guest.status].label}
                        <ChevronDown className="w-3.5 h-3.5 ml-1" />
                      </Badge>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-2xl">
                    <DropdownMenuItem onClick={() => { setPendingStatus('waiting'); setIsConfirmDialogOpen(true); }}>
                      {guest.status === 'waiting' && <Check className="w-4 h-4 mr-2" />}
                      {guest.status !== 'waiting' && <span className="w-4 mr-2" />}
                      {t('waiting')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setPendingStatus('checked-in'); setIsConfirmDialogOpen(true); }}>
                      {guest.status === 'checked-in' && <Check className="w-4 h-4 mr-2" />}
                      {guest.status !== 'checked-in' && <span className="w-4 mr-2" />}
                      {t('checkedIn')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setPendingStatus('departed'); setIsConfirmDialogOpen(true); }}>
                      {guest.status === 'departed' && <Check className="w-4 h-4 mr-2" />}
                      {guest.status !== 'departed' && <span className="w-4 mr-2" />}
                      {t('checkOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Guest Count - Compact with Expand */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden">
              <button
                onClick={() => setIsGuestCountExpanded(!isGuestCountExpanded)}
                className="w-full p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('guests')}:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      {(guest.adults || 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{guest.adults}</span>
                        </div>
                      )}
                      {(guest.children || 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{guest.children}</span>
                        </div>
                      )}
                      {(guest.infants || 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Baby className="w-4 h-4" />
                          <span className="text-sm">{guest.infants}</span>
                        </div>
                      )}
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${
                        isGuestCountExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </button>
              
              {/* Expandable Guest Count Controls */}
              {isGuestCountExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 space-y-3"
                >
                  {/* Adults Counter */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{t('adults')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if ((guest.adults || 0) > 0) {
                            onUpdateGuest?.(guest.id, { adults: (guest.adults || 0) - 1 });
                          }
                        }}
                        className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
                        disabled={(guest.adults || 0) <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-slate-900 dark:text-white">{guest.adults || 0}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateGuest?.(guest.id, { adults: (guest.adults || 0) + 1 });
                        }}
                        className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{t('children')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if ((guest.children || 0) > 0) {
                            onUpdateGuest?.(guest.id, { children: (guest.children || 0) - 1 });
                          }
                        }}
                        className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
                        disabled={(guest.children || 0) <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-slate-900 dark:text-white">{guest.children || 0}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateGuest?.(guest.id, { children: (guest.children || 0) + 1 });
                        }}
                        className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Infants Counter */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Baby className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{t('infants')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if ((guest.infants || 0) > 0) {
                            onUpdateGuest?.(guest.id, { infants: (guest.infants || 0) - 1 });
                          }
                        }}
                        className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
                        disabled={(guest.infants || 0) <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-slate-900 dark:text-white">{guest.infants || 0}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateGuest?.(guest.id, { infants: (guest.infants || 0) + 1 });
                        }}
                        className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="text-slate-900 dark:text-white">{guest.phone}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 rounded-xl"
                  onClick={() => window.open(`tel:${guest.phone}`, '_self')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t('call')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 rounded-xl bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                  onClick={() => {
                    const phoneNumber = guest.phone.replace(/\D/g, '');
                    window.open(`https://wa.me/${phoneNumber}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Stay Info */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <span className="text-slate-600 dark:text-slate-400">{t('checkIn')}: </span>
                  <span className="text-slate-900 dark:text-white">{formatDate(guest.checkIn)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <DoorOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div>
                  <span className="text-slate-600 dark:text-slate-400">{t('checkOut2')}: </span>
                  <span className="text-slate-900 dark:text-white">{formatDate(guest.checkOut)}</span>
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl"
                  onClick={() => setIsMoveDialogOpen(true)}
                >
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  {t('addMove')}
                </Button>
              </div>
            </div>

            {/* Moves List */}
            {guest.moves && guest.moves.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4">
                <div className="flex items-center gap-3 text-sm mb-3">
                  <ArrowRightLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{t('moves')}: </span>
                </div>
                <div className="space-y-2 ml-8">
                  {guest.moves.map((move) => (
                    <div key={move.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm text-slate-900 dark:text-white">{formatDate(move.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-900 dark:text-white">{move.room}</span>
                          <Badge 
                            variant="outline" 
                            className={`${roomCategoryConfig[move.roomCategory].color} text-xs px-1.5 py-0 h-4 border`}
                          >
                            {move.roomCategory}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => handleEditMove(move)}
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => handleDeleteMove(move.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      </div>
                      {move.comment && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{move.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transportation & Parking Combined */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 text-sm flex-1">
                  <Car className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-slate-600 dark:text-slate-400">{t('transportation')}: </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="outline-none">
                            <Badge variant="outline" className={`${transportationConfig[guest.transportation].color} ml-2 cursor-pointer hover:bg-opacity-20 transition-colors px-3 py-1`}>
                              {transportationConfig[guest.transportation].label}
                              <ChevronDown className="w-3.5 h-3.5 ml-1" />
                            </Badge>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="rounded-2xl">
                          <DropdownMenuItem onClick={(e) => handleTransportationChange(e, 'car')}>
                            {guest.transportation === 'car' && <Check className="w-4 h-4 mr-2" />}
                            {guest.transportation !== 'car' && <span className="w-4 mr-2" />}
                            {t('personalCar')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleTransportationChange(e, 'taxi')}>
                            {guest.transportation === 'taxi' && <Check className="w-4 h-4 mr-2" />}
                            {guest.transportation !== 'taxi' && <span className="w-4 mr-2" />}
                            {t('taxi')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleTransportationChange(e, 'transfer')}>
                            {guest.transportation === 'transfer' && <Check className="w-4 h-4 mr-2" />}
                            {guest.transportation !== 'transfer' && <span className="w-4 mr-2" />}
                            {t('transfer')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="text-slate-900 dark:text-white text-sm">
                      {getVehicleDisplayText()}
                      {guest.licensePlate && (
                        <span className="font-mono ml-2 text-slate-600 dark:text-slate-400">
                          • {guest.licensePlate}
                        </span>
                      )}
                      {guest.parkingSpot && (
                        <span className="ml-2 text-slate-600 dark:text-slate-400">
                          • <ParkingSquare className="w-3.5 h-3.5 inline mr-1" />
                          <span className="font-mono">{guest.parkingSpot}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleOpenCarDialog}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 text-sm">
                  <Info className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-400">{t('notes')}: </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsEditingNotes(!isEditingNotes);
                    if (!isEditingNotes) {
                      setEditPreferences(guest.preferences || '');
                    }
                  }}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              {!isEditingNotes ? (
                <p className="text-slate-900 dark:text-white text-sm ml-8">{guest.preferences || '-'}</p>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={editPreferences}
                    onChange={(e) => setEditPreferences(e.target.value)}
                    placeholder={t('notes')}
                    rows={3}
                    className="rounded-2xl"
                  />
                  <Button onClick={handleSaveNotes} className="w-full h-12 rounded-2xl">
                    {t('save')}
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" className="h-14 rounded-2xl" asChild>
                <a href={`tel:${guest.phone}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {t('call')}
                </a>
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:hover:bg-green-900" asChild>
                <a href={`https://wa.me/${guest.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-400">{t('chat')}</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vehicle & Parking Details Dialog - Combined */}
      <Dialog open={isCarDialogOpen} onOpenChange={setIsCarDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('vehicleDetails')}</DialogTitle>
            <DialogDescription className="sr-only">{t('editVehicleDetails')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {guest.transportation === 'car' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('carMake')}</label>
                  <Input
                    value={editCarMake}
                    onChange={(e) => setEditCarMake(e.target.value)}
                    placeholder={t('carMake')}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('carModel')}</label>
                  <Input
                    value={editCarModel}
                    onChange={(e) => setEditCarModel(e.target.value)}
                    placeholder={t('carModel')}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('licensePlate')}</label>
                  <Input
                    value={editLicensePlate}
                    onChange={(e) => setEditLicensePlate(e.target.value)}
                    placeholder={t('licensePlate')}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('parkingSpot')}</label>
                  <Input
                    value={editParkingSpot}
                    onChange={(e) => setEditParkingSpot(e.target.value)}
                    placeholder={t('parkingSpot')}
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
            )}
            {(guest.transportation === 'taxi' || guest.transportation === 'transfer') && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('companyName')}</label>
                  <Input
                    value={editCarMake}
                    onChange={(e) => setEditCarMake(e.target.value)}
                    placeholder={t('companyName')}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('driverName')}</label>
                  <Input
                    value={editCarModel}
                    onChange={(e) => setEditCarModel(e.target.value)}
                    placeholder={t('driverName')}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('licensePlate')}</label>
                  <Input
                    value={editLicensePlate}
                    onChange={(e) => setEditLicensePlate(e.target.value)}
                    placeholder={t('licensePlate')}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('parkingSpot')}</label>
                  <Input
                    value={editParkingSpot}
                    onChange={(e) => setEditParkingSpot(e.target.value)}
                    placeholder={t('parkingSpot')}
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
            )}
            
            {/* Parking Photo Section */}
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('parkingPhoto')}</label>
              {editParkingPhoto ? (
                <div className="space-y-3">
                  <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                    <img 
                      src={editParkingPhoto} 
                      alt="Parking" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => parkingPhotoInputRef.current?.click()}
                      className="flex-1 h-12 rounded-2xl"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t('uploadPhoto')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveParkingPhoto}
                      className="h-12 rounded-2xl text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => parkingPhotoInputRef.current?.click()}
                  className="w-full h-24 rounded-2xl border-dashed"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('uploadPhoto')}</span>
                  </div>
                </Button>
              )}
              <input
                ref={parkingPhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleParkingPhotoChange}
                className="hidden"
              />
            </div>
            
            <Button onClick={handleSaveCarDetails} className="w-full h-12 rounded-2xl">
              {t('save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Details Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('room')}</DialogTitle>
            <DialogDescription className="sr-only">{t('editRoomDetails')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('room')}</label>
              <Input
                value={editRoom}
                onChange={(e) => setEditRoom(e.target.value)}
                placeholder={t('room')}
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('roomCategory')}</label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={editRoomCategory === 'DTS' ? 'default' : 'outline'}
                  onClick={() => setEditRoomCategory('DTS')}
                  className="flex-1 h-12 rounded-2xl"
                >
                  DTS
                </Button>
                <Button
                  type="button"
                  variant={editRoomCategory === 'DKS' ? 'default' : 'outline'}
                  onClick={() => setEditRoomCategory('DKS')}
                  className="flex-1 h-12 rounded-2xl"
                >
                  DKS
                </Button>
              </div>
            </div>
            <Button onClick={handleSaveRoomDetails} className="w-full h-12 rounded-2xl">
              {t('save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Count Dialog */}
      <Dialog open={isGuestCountDialogOpen} onOpenChange={setIsGuestCountDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('guests')}</DialogTitle>
            <DialogDescription className="sr-only">{t('editGuestCount')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Adults */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="text-sm text-slate-900 dark:text-white">{t('adults')}</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount('adults', -1)}
                  className="h-10 w-10 rounded-full p-0"
                  disabled={editAdults === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-slate-900 dark:text-white text-lg">{editAdults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount('adults', 1)}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="text-sm text-slate-900 dark:text-white">{t('children')}</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount('children', -1)}
                  className="h-10 w-10 rounded-full p-0"
                  disabled={editChildren === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-slate-900 dark:text-white text-lg">{editChildren}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount('children', 1)}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="text-sm text-slate-900 dark:text-white">{t('infants')}</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount('infants', -1)}
                  className="h-10 w-10 rounded-full p-0"
                  disabled={editInfants === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-slate-900 dark:text-white text-lg">{editInfants}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateGuestCount('infants', 1)}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button onClick={handleSaveGuestCount} className="w-full h-12 rounded-2xl">
              {t('save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Count Confirmation Dialog */}
      <AlertDialog open={isConfirmGuestCountOpen} onOpenChange={setIsConfirmGuestCountOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('confirmGuestCount')}</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {t('confirmGuestCountText')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 rounded-2xl">{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGuestCount} className="h-12 rounded-2xl">{t('confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('confirmStatusChange')}</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {language === 'ru' 
                ? `Вы уверены, что хотите изменить статус гостя ${guest.name} (${guest.room}, ${guest.roomCategory}) на `
                : `Are you sure you want to change the status of guest ${guest.name} (${guest.room}, ${guest.roomCategory}) to `
              }
              <span className="font-semibold">
                {pendingStatus && statusConfig[pendingStatus].label}
              </span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 rounded-2xl">{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange} className="h-12 rounded-2xl">{t('confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Move Dialog */}
      <AddMoveDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        onAddMoves={handleAddMoves}
        currentRoom={guest.room}
        currentRoomCategory={guest.roomCategory}
      />

      {/* Edit Move Dialog */}
      <EditMoveDialog
        open={isEditMoveDialogOpen}
        onOpenChange={setIsEditMoveDialogOpen}
        onUpdateMove={handleUpdateMove}
        move={selectedMove}
      />
    </>
  );
}
