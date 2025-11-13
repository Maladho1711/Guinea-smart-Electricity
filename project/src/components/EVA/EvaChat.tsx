import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '../../config/api';

interface ChatMessage {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

interface EvaChatProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    welcomeMessage?: string;
}

export function EvaChat({ position = 'bottom-right', welcomeMessage }: EvaChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Message de bienvenue
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcome: ChatMessage = {
                id: 'welcome',
                text: welcomeMessage || 'Bonjour ! Je suis EVA, votre assistante virtuelle intelligente. Comment puis-je vous aider aujourd\'hui ?',
                isBot: true,
                timestamp: new Date()
            };
            setMessages([welcome]);
        }
    }, [isOpen, welcomeMessage]);

    // Scroll automatique
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Focus sur l'input quand le chat s'ouvre
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Charger l'historique depuis localStorage
    useEffect(() => {
        if (isOpen) {
            const savedMessages = localStorage.getItem('eva_chat_history');
            if (savedMessages) {
                try {
                    const parsed = JSON.parse(savedMessages);
                    setMessages(parsed.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    })));
                } catch (e) {
                    console.error('Erreur lors du chargement de l\'historique:', e);
                }
            }
        }
    }, [isOpen]);

    // Sauvegarder l'historique dans localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('eva_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const handleSend = useCallback(async (prefilledMessage?: string) => {
        const message = prefilledMessage || input.trim();
        if (!message || loading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: message,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setError(null);
        setLoading(true);

        try {
            // Construire l'historique de conversation
            const conversationHistory = messages
                .filter(msg => msg.id !== 'welcome')
                .slice(-10)
                .map(msg => ({
                    role: msg.isBot ? 'assistant' as const : 'user' as const,
                    content: msg.text
                }));

            // Appeler l'API backend
            const response = await apiRequest(API_ENDPOINTS.eva.chat, {
                method: 'POST',
                body: JSON.stringify({
                    message: message,
                    conversationHistory: conversationHistory
                })
            });

            const botResponse = response.response || response.message ||
                'Désolé, je n\'ai pas pu générer de réponse. Pouvez-vous reformuler votre question ?';

            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setError(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            console.error('❌ Erreur lors de l\'appel à EVA:', errorMessage);

            if (error instanceof Error && 'status' in error) {
                const status = (error as { status?: number }).status;
                if (status === 429) {
                    setError('Trop de requêtes. Veuillez patienter quelques instants.');
                } else {
                    setError('Erreur de connexion. Veuillez réessayer.');
                }
            } else {
                setError('Erreur de connexion. Veuillez réessayer.');
            }

            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [input, loading, messages]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const positionClasses = {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50`}>
            {/* Bouton flottant */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    aria-label="Ouvrir le chat EVA"
                >
                    <Bot className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                </button>
            )}

            {/* Fenêtre de chat */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col border border-gray-200">
                    {/* Header */}
                    <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <h3 className="font-semibold">EVA - Assistante Virtuelle</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-green-700 rounded-full p-1 transition-colors"
                            aria-label="Fermer le chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        msg.isBot
                                            ? 'bg-white border border-gray-200 text-gray-800'
                                            : 'bg-green-600 text-white'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
                        {error && (
                            <p className="text-red-500 text-xs mb-2">{error}</p>
                        )}
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Tapez votre message..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={loading}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                aria-label="Envoyer le message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

