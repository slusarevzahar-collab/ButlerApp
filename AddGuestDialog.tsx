import { useState } from 'react';
import { Guest } from '../App';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Minus, Scan, Edit3 } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
}

type AddMethodStep = 'select-method' | 'scan-profile' | 'manual';

export function AddGuestDialog({ open, onOpenChange, onAddGuest }: AddGuestDialogProps) {
  const { t } = useLanguage();
  const [addMethod, setAddMethod] = useState<AddMethodStep>('select-method');
  
  const [formData, setFormData] = useState({
    name: '',
    room: '',
    roomCategory: 'DTS' as 'DTS' | 'DKS',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    phone: '',
    email: '',
    preferences: '',
    transportation: 'car' as 'car' | 'taxi' | 'transfer',
    adults: 2,
    children: 0,
    infants: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    onAddGuest({
      name: formData.name,
      room: formData.room,
      roomCategory: formData.roomCategory,
      checkIn: formatDate(formData.checkIn),
      checkOut: formatDate(formData.checkOut),
      status: 'waiting',
      phone: formData.phone,
      email: formData.email,
      preferences: formData.preferences,
      transportation: formData.transportation,
      adults: formData.adults,
      children: formData.children,
      infants: formData.infants,
    });

    // Reset form
    setFormData({
      name: '',
      room: '',
      roomCategory: 'DTS',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      phone: '',
      email: '',
      preferences: '',
      transportation: 'car',
      adults: 2,
      children: 0,
      infants: 0,
    });
    
    onOpenChange(false);
  };

  const updateGuestCount = (field: 'adults' | 'children' | 'infants', delta: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

  const handleMethodSelect = (method: AddMethodStep) => {
    setAddMethod(method);
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset to method selection when closing
      setAddMethod('select-method');
    }
    onOpenChange(isOpen);
  };

  const handleBack = () => {
    setAddMethod('select-method');
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="rounded-3xl max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('addGuest')}</DialogTitle>
          <DialogDescription className="sr-only">
            {addMethod === 'select-method' 
              ? t('selectMethodDescription') 
              : addMethod === 'scan-profile' 
              ? t('scanProfileDescription') 
              : t('manualAddDescription')}
          </DialogDescription>
        </DialogHeader>
        
        {addMethod === 'select-method' && (
          <div className="space-y-3 py-4">
            <Button
              type="button"
              onClick={() => handleMethodSelect('scan-profile')}
              className="w-full h-20 rounded-3xl flex items-center justify-start gap-4 px-6"
              variant="outline"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Scan className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg">{t('scanProfile')}</span>
            </Button>
            
            <Button
              type="button"
              onClick={() => handleMethodSelect('manual')}
              className="w-full h-20 rounded-3xl flex items-center justify-start gap-4 px-6"
              variant="outline"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg">{t('addManually')}</span>
            </Button>
          </div>
        )}

        {addMethod === 'scan-profile' && (
          <div className="space-y-4 py-4">
            <div className="bg-secondary rounded-3xl p-8 text-center">
              <Scan className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {t('scanProfileComingSoon')}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleBack}
              className="w-full h-12 rounded-2xl"
              variant="outline"
            >
              {t('cancel')}
            </Button>
          </div>
        )}

        {addMethod === 'manual' && (
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Name */}
          <div>
            <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('guestName')}</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('guestName')}
              className="h-12 rounded-2xl"
            />
          </div>

          {/* Room Number and Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('room')}</Label>
              <Input
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="501"
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('roomCategory')}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.roomCategory === 'DTS' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, roomCategory: 'DTS' })}
                  className="flex-1 h-12 rounded-2xl"
                >
                  DTS
                </Button>
                <Button
                  type="button"
                  variant={formData.roomCategory === 'DKS' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, roomCategory: 'DKS' })}
                  className="flex-1 h-12 rounded-2xl"
                >
                  DKS
                </Button>
              </div>
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('guests')}</Label>
            <div className="space-y-3">
              {/* Adults */}
              <div className="flex items-center justify-between p-3 bg-secondary rounded-2xl">
                <span className="text-sm text-foreground">{t('adults')}</span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuestCount('adults', -1)}
                    className="h-8 w-8 rounded-full p-0"
                    disabled={formData.adults === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center text-foreground">{formData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuestCount('adults', 1)}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between p-3 bg-secondary rounded-2xl">
                <span className="text-sm text-foreground">{t('children')}</span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuestCount('children', -1)}
                    className="h-8 w-8 rounded-full p-0"
                    disabled={formData.children === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center text-foreground">{formData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuestCount('children', 1)}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between p-3 bg-secondary rounded-2xl">
                <span className="text-sm text-foreground">{t('infants')}</span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuestCount('infants', -1)}
                    className="h-8 w-8 rounded-full p-0"
                    disabled={formData.infants === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center text-foreground">{formData.infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuestCount('infants', 1)}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Check-in and Check-out */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('checkIn')}</Label>
              <Input
                type="date"
                required
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('checkOut2')}</Label>
              <Input
                type="date"
                required
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="h-12 rounded-2xl"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('phone')}</Label>
            <Input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="h-12 rounded-2xl"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('email')}</Label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="guest@email.com"
              className="h-12 rounded-2xl"
            />
          </div>

          {/* Transportation */}
          <div>
            <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">{t('transportation')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.transportation === 'car' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, transportation: 'car' })}
                className="flex-1 h-12 rounded-2xl"
              >
                {t('personalCar')}
              </Button>
              <Button
                type="button"
                variant={formData.transportation === 'taxi' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, transportation: 'taxi' })}
                className="flex-1 h-12 rounded-2xl"
              >
                {t('taxi')}
              </Button>
              <Button
                type="button"
                variant={formData.transportation === 'transfer' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, transportation: 'transfer' })}
                className="flex-1 h-12 rounded-2xl"
              >
                {t('transfer')}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button 
              type="button" 
              onClick={handleBack}
              className="h-12 rounded-2xl"
              variant="outline"
            >
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1 h-12 rounded-2xl">
              {t('addGuest')}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
