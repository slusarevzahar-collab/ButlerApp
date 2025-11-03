import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (dateStr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    guests: 'Guests',
    guest: 'Guest',
    tasks: 'Tasks',
    profile: 'Profile',
    aiAssistant: 'AI Assistant',
    
    // Guests View
    all: 'All',
    waiting: 'Waiting',
    departed: 'Departed',
    searchGuests: 'Search guests or rooms...',
    noGuestsFound: 'No guests found',
    noWaitingGuests: 'No waiting guests',
    noDepartedGuests: 'No departed guests',
    
    // Guest Card
    guestDetails: 'Guest Details',
    checkedIn: 'in house',
    checkOut: 'Checked Out',
    call: 'Call',
    email: 'Email',
    chat: 'Chat',
    addMove: 'Add a Move',
    transportation: 'Transportation',
    vehicle: 'Vehicle',
    licensePlate: 'License Plate',
    parkingSpot: 'Parking Spot',
    preferences: 'Preferences',
    checkIn: 'Check-in',
    checkOut2: 'Check-out',
    personalCar: 'Personal Car',
    taxi: 'Taxi',
    transfer: 'Transfer',
    
    // Status Confirmation
    confirmStatusChange: 'Confirm Status Change',
    confirmStatusText: 'Are you sure you want to change the status of',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
    // Profile
    editProfile: 'Edit Profile',
    tasksDone: 'Tasks Done',
    activeGuests: 'Active Guests',
    rating: 'Rating',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    language: 'Language',
    settings: 'Settings',
    privacySecurity: 'Privacy & Security',
    helpSupport: 'Help & Support',
    logOut: 'Log Out',
    
    // Tasks
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    addTask: 'Add Task',
    newTask: 'New Task',
    high: 'High',
    urgent: 'Urgent',
    normal: 'Normal',
    low: 'Low',
    noTasks: 'No tasks',
    noUrgentTasks: 'No urgent tasks',
    mainTasks: 'Main Tasks',
    officeTasks: 'Office',
    
    // Edit
    edit: 'Edit',
    save: 'Save',
    ok: 'OK',
    notes: 'Notes',
    editTransportation: 'Edit Transportation',
    editNotes: 'Edit Notes',
    carMake: 'Car Make',
    carModel: 'Car Model',
    vehicleDetails: 'Vehicle Details',
    companyName: 'Company Name',
    driverName: 'Driver Name',
    guestHistory: 'Guest History',
    changePhoto: 'Change Photo',
    previousStays: 'Previous Stays',
    totalNights: 'Total Nights',
    averageRating: 'Average Rating',
    room: 'Room',
    roomCategory: 'Room Category',
    parking: 'Parking',
    activityHistory: 'Activity History',
    noActivityYet: 'No activity yet',
    uploadPhoto: 'Upload Photo',
    removePhoto: 'Remove Photo',
    parkingPhoto: 'Parking Photo',
    addGuest: 'Add Guest',
    guestName: 'Guest Name',
    adults: 'Adults',
    adultsLower: 'adults',
    children: 'Children',
    childrenLower: 'children',
    infants: 'Infants',
    infantsLower: 'infants',
    phone: 'Phone',
    confirmGuestCount: 'Confirm Guest Count',
    confirmGuestCountText: 'Are you sure you want to update the guest count?',
    pullToSearch: 'Pull to search',
    releaseToSearch: 'Release to search',
    scanProfile: 'Scan Profile',
    addManually: 'Add Manually',
    selectAddMethod: 'Select Add Method',
    guests: 'Guests',
    scanProfileComingSoon: 'Profile scanning feature will be available in the next version',
    selectMethodDescription: 'Choose how to add a new guest',
    scanProfileDescription: 'Scan guest profile document',
    manualAddDescription: 'Manually enter guest information',
    viewEditGuestDetails: 'View and edit guest information',
    editVehicleDetails: 'Edit vehicle and parking information',
    editRoomDetails: 'Edit room information',
    editGuestCount: 'Edit number of guests',
    move: 'Move',
    moveDate: 'Move Date',
    selectDate: 'Select Date',
    comment: 'Comment',
    addComment: 'Add a comment',
    addAnotherMove: 'Add Another Move',
    addMoveDescription: 'Add room move information for the guest',
    editMove: 'Edit Move',
    editMoveDescription: 'Edit room move information',
    moves: 'Moves',
    noMovesYet: 'No moves scheduled yet',
    archive: 'Archive',
    close: 'Close',
  },
  ru: {
    // Navigation
    guests: 'Гости',
    tasks: 'Задачи',
    profile: 'Профиль',
    aiAssistant: 'AI Ассистент',
    
    // Guests View
    all: 'Все',
    waiting: 'Ожидаются',
    departed: 'Выехали',
    searchGuests: 'Поиск гостей или номеров...',
    noGuestsFound: 'Гости не найдены',
    noWaitingGuests: 'Нет ожидающих гостей',
    noDepartedGuests: 'Нет выехавших гостей',
    
    // Guest Card
    guestDetails: 'Данные гостя',
    checkedIn: 'Проживают',
    checkOut: 'Выехали',
    call: 'Позвонить',
    email: 'Email',
    chat: 'Чат',
    addMove: 'Добавить переезд',
    transportation: 'Транспорт',
    vehicle: 'Автомобиль',
    licensePlate: 'Номер',
    parkingSpot: 'Парковка',
    preferences: 'Предпочтения',
    checkIn: 'Заезд',
    checkOut2: 'Выезд',
    personalCar: 'Личный автомобиль',
    taxi: 'Такси',
    transfer: 'Трансфер',
    movingTomorrow: 'Переезд',
    
    // Status Confirmation
    confirmStatusChange: 'Подтвердите изменение статуса',
    confirmStatusText: 'Вы уверены, что хотите изменить статус',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    
    // Profile
    editProfile: 'Редактировать профиль',
    tasksDone: '��ыполнено задач',
    activeGuests: 'Активных гостей',
    rating: 'Рейтинг',
    notifications: 'Уведомления',
    darkMode: 'Темная тема',
    language: 'Язык',
    settings: 'Настройки',
    privacySecurity: 'Конфиденциальность',
    helpSupport: 'Помощь',
    logOut: 'Выйти',
    
    // Tasks
    pending: 'Ожидание',
    inProgress: 'В работе',
    completed: 'Выполнено',
    addTask: 'Добавить задачу',
    newTask: 'Новая задача',
    high: 'Высокий',
    urgent: 'Срочно',
    normal: 'Обычный',
    low: 'Низкий',
    noTasks: 'Нет задач',
    noUrgentTasks: 'Нет срочных задач',
    mainTasks: 'Основные',
    officeTasks: 'Офис',
    
    // Edit
    edit: 'Изменить',
    save: 'Сохранить',
    ok: 'ОК',
    notes: 'Заметки',
    editTransportation: 'Редактировать транспорт',
    editNotes: 'Редактировать заметки',
    carMake: 'Марка',
    carModel: 'Модель',
    vehicleDetails: 'Детали транспорта',
    companyName: 'Название компании',
    driverName: 'Имя водителя',
    guestHistory: 'История гостя',
    changePhoto: 'Сменить фото',
    previousStays: 'Предыдущие визиты',
    totalNights: 'Всего ночей',
    averageRating: 'Средний рейтинг',
    room: 'Номер',
    roomCategory: 'Категория номера',
    parking: 'Парковка',
    activityHistory: 'История действий',
    noActivityYet: 'Пока нет активности',
    uploadPhoto: 'Загрузить фото',
    removePhoto: 'Удалить фото',
    parkingPhoto: 'Фото парковки',
    addGuest: 'Добавить гостя',
    guestName: 'Имя гостя',
    adults: 'Взрослые',
    adultsLower: 'Взрослые',
    children: 'Дети',
    childrenLower: 'Дети',
    infants: 'Младенцы',
    infantsLower: 'Младенцы',
    phone: 'Телефон',
    confirmGuestCount: 'Подтвердите количество гостей',
    confirmGuestCountText: 'Вы уверены, что хотите изменить количество гостей?',
    pullToSearch: 'Потяните для поиска',
    releaseToSearch: 'Отпустите для поиска',
    parking: 'Парковка',
    scanProfile: 'Сканировать Профайл',
    addManually: 'Добавит�� вручную',
    selectAddMethod: 'Выберите способ добавления',
    guest: 'Гость',
    guests: 'Гости',
    scanProfileComingSoon: 'Функция сканирования профиля будет доступна в следующей версии',
    selectMethodDescription: 'Выберите способ добавления нового гостя',
    scanProfileDescription: 'Сканировать документ профиля гостя',
    manualAddDescription: 'Ввести данные гостя вручную',
    viewEditGuestDetails: 'Просмотр и редактирование информации о госте',
    editVehicleDetails: 'Редактирование информации о транспорте и парковке',
    editRoomDetails: 'Редактирование информации о номере',
    editGuestCount: 'Редактирование количества гостей',
    move: 'Переезд',
    moveDate: 'Дата переезда',
    selectDate: 'Выберите дату',
    comment: 'Комментарий',
    addComment: 'Добавьте комментарий',
    addAnotherMove: 'Добавить ещё один переезд',
    addMoveDescription: 'Добавление информации о переезде гостя',
    editMove: 'Редактировать переезд',
    editMoveDescription: 'Редактирование информации о переезде',
    moves: 'Переезды',
    noMovesYet: 'Переездов пока не запланировано',
    archive: 'Архив',
    close: 'Закрыть',
  }
};

const monthTranslations = {
  en: {
    'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr', 'May': 'May', 'Jun': 'Jun',
    'Jul': 'Jul', 'Aug': 'Aug', 'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dec',
    'January': 'January', 'February': 'February', 'March': 'March', 'April': 'April',
    'June': 'June', 'July': 'July', 'August': 'August', 'September': 'September',
    'October': 'October', 'November': 'November', 'December': 'December'
  },
  ru: {
    'Jan': 'янв', 'Feb': 'фев', 'Mar': 'мар', 'Apr': 'апр', 'May': 'май', 'Jun': 'июн',
    'Jul': 'июл', 'Aug': 'авг', 'Sep': 'сен', 'Oct': 'окт', 'Nov': 'ноя', 'Dec': 'дек',
    'January': 'января', 'February': 'февраля', 'March': 'марта', 'April': 'апреля',
    'May': 'мая', 'June': 'июня', 'July': 'июля', 'August': 'августа',
    'September': 'сентября', 'October': 'октября', 'November': 'ноября', 'December': 'декабря'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const formatDate = (dateStr: string): string => {
    // Check if date is in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      const monthNames = {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      };
      
      const monthName = monthNames[language][date.getMonth()];
      return language === 'en' ? `${monthName} ${day}` : `${day} ${monthName}`;
    }
    
    // Original format handling (e.g., "Nov 3, 2025")
    // Remove year from date (e.g., ", 2025" or ", 2024")
    let formattedDate = dateStr.replace(/,\s*\d{4}/, '');
    
    if (language === 'en') return formattedDate;
    
    // Replace English months with Russian months
    Object.keys(monthTranslations.en).forEach((enMonth) => {
      const ruMonth = monthTranslations.ru[enMonth as keyof typeof monthTranslations['en']];
      formattedDate = formattedDate.replace(enMonth, ruMonth);
    });
    
    return formattedDate;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
