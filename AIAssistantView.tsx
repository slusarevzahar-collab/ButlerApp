import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Send, Sparkles, Plus, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SwipeableTabs } from './SwipeableTabs';
import { useLanguage } from './LanguageProvider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Suggestion {
  id: string;
  text: string;
  action: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'dismissed';
}

export function AIAssistantView() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Я ваш AI-помощник дворецкого. Чем могу помочь? Я могу помочь с запросами гостей, приоритизацией задач, информацией об отеле и многим другим.',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      text: 'Гости в номере 501 просили принести вазу для цветов.',
      action: 'Добавить задачу в список?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    },
    {
      id: '2',
      text: 'Елена Сергеевна Иванова (номер 205) запросила вегетарианское меню на завтрак.',
      action: 'Создать задачу для room service?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    },
    {
      id: '3',
      text: 'Завтра заезд Дмитрия Александровича Козлова (номер 410) с ранним заездом в 10:00.',
      action: 'Подготовить номер заранее?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    },
    {
      id: '4',
      text: 'В номере 312 гость запросил дополнительные подушки (без перьев).',
      action: 'Добавить задачу для housekeeping?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    }
  ]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Я помогу вам с этим. Давайте проверю текущий статус и вернусь к вам с деталями.",
        "На основе предпочтений гостя, я рекомендую назначить этому запросу высокий приоритет.",
        "Я проанализировал текущую загрузку. Вот что я предлагаю: сначала сосредоточьтесь на срочных запросах, затем займитесь подготовкой к заезду.",
        "Отличный вопрос! Для VIP-гостей мы обычно готовим приветственные удобства за 2 часа до заезда.",
        "Я могу создать задачу для этого. Хотите, чтобы я добавил её в ваш список задач с высоким приоритетом?",
        "У гостя в номере 501 есть предпочтения по гипоаллергенному постельному белью. Я отмечу это для housekeeping."
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAcceptSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => s.id === id ? { ...s, status: 'accepted' } : s)
    );
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => s.id === id ? { ...s, status: 'dismissed' } : s)
    );
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  const chatTab = (
    <div className="h-full flex flex-col bg-background">
      {/* Messages area - takes all space except input */}
      <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`py-6 px-4 xs:px-5 sm:px-6 ${
                message.role === 'assistant' 
                  ? 'bg-background' 
                  : 'bg-slate-50 dark:bg-slate-900/30'
              }`}
            >
              <div className="flex gap-3 xs:gap-4 items-start">
                <div className={`flex-shrink-0 w-9 h-9 xs:w-10 xs:h-10 rounded-2xl flex items-center justify-center ${
                  message.role === 'assistant' 
                    ? 'bg-gradient-to-br from-primary to-purple-600' 
                    : 'bg-secondary'
                }`}>
                  {message.role === 'assistant' ? (
                    <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
                  ) : (
                    <span className="text-foreground text-sm">Я</span>
                  )}
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="py-6 px-4 xs:px-5 sm:px-6 bg-background">
              <div className="flex gap-3 xs:gap-4 items-start">
                <div className="flex-shrink-0 w-9 h-9 xs:w-10 xs:h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
                </div>
                <div className="pt-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto p-3 xs:p-4">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="flex-1 px-4 xs:px-5 py-3 xs:py-3.5 pr-12 xs:pr-14 rounded-3xl bg-secondary border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground shadow-sm text-sm xs:text-base"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 h-9 w-9 xs:h-10 xs:w-10 rounded-2xl"
            >
              <Send className="w-4 h-4 xs:w-5 xs:h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI может делать ошибки. Проверяйте важную информацию.
          </p>
        </div>
      </div>
    </div>
  );

  const suggestionsTab = (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      <div className="flex-1 px-3 xs:px-4 py-4 space-y-3">
        {pendingSuggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Пока нет новых предложений
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              AI будет предлагать действия на основе активности гостей
            </p>
          </div>
        ) : (
          pendingSuggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden"
            >
              <div className="p-4 xs:p-5">
                <div className="flex gap-3 mb-3">
                  <div className="flex-shrink-0 w-9 h-9 xs:w-10 xs:h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed break-words">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestion.timestamp}
                    </p>
                  </div>
                </div>
                
                <div className="pl-0 xs:pl-[52px]">
                  <p className="text-sm font-medium text-foreground mb-3">
                    {suggestion.action}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptSuggestion(suggestion.id)}
                      className="flex-1 h-9 xs:h-10 rounded-2xl bg-primary hover:bg-primary/90 text-xs xs:text-sm"
                    >
                      <Check className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1 xs:mr-1.5" />
                      <span className="truncate">Принять</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDismissSuggestion(suggestion.id)}
                      className="flex-1 h-9 xs:h-10 rounded-2xl text-xs xs:text-sm"
                    >
                      <X className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1 xs:mr-1.5" />
                      <span className="truncate">Отклонить</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Show recently processed suggestions */}
        {suggestions.filter(s => s.status !== 'pending').length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              Обработанные
            </h3>
            {suggestions
              .filter(s => s.status !== 'pending')
              .map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="bg-card rounded-2xl shadow-sm border border-border p-3 xs:p-4 mb-2"
                >
                  <div className="flex items-start gap-2">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      suggestion.status === 'accepted' 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'bg-muted'
                    }`}>
                      {suggestion.status === 'accepted' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex-1 line-through">
                      {suggestion.text}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'chat',
      label: 'Чат',
      content: chatTab
    },
    {
      id: 'suggestions',
      label: 'Советы',
      badge: pendingSuggestions.length,
      content: suggestionsTab
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <SwipeableTabs tabs={tabs} defaultTab="chat" />
    </div>
  );
}
