import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '../../config/api';

interface ChatMessage {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

export function EvaChatModal() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Message de bienvenue
    useEffect(() => {
        if (messages.length === 0) {
            const welcome: ChatMessage = {
                id: 'welcome',
                text: 'Bonjour ! Je suis EVA, votre assistante virtuelle intelligente. Je peux vous aider avec :\n\n• Analyse de votre consommation\n• Questions sur vos factures\n• Signalement de problèmes\n• Recommandations d\'économie d\'énergie\n• Génération de rapports\n\nComment puis-je vous aider aujourd\'hui ?',
                isBot: true,
                timestamp: new Date()
            };
            setMessages([welcome]);
        }
    }, []);

    // Scroll automatique
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus sur l'input
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: input.trim(),
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const conversationHistory = messages.map(msg => ({
                role: msg.isBot ? 'assistant' : 'user',
                content: msg.text
            }));

            const response = await apiRequest(API_ENDPOINTS.eva.chat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message: userMessage.text,
                    conversationHistory
                })
            });

            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: response.response || 'Désolé, je n\'ai pas pu traiter votre demande.',
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err: any) {
            console.error('Erreur lors de l\'envoi du message:', err);
            setError('Erreur de connexion. Veuillez réessayer.');
            
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Désolé, une erreur est survenue. Veuillez réessayer ou contacter le support.',
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                            {msg.isBot && (
                                <div className="flex items-center gap-2 mb-1">
                                    <Bot className="w-4 h-4 text-green-600" />
                                    <span className="text-xs font-semibold text-green-600">EVA</span>
                                </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
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
            <div className="border-t border-gray-200 p-4 bg-white">
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
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        aria-label="Envoyer le message"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

