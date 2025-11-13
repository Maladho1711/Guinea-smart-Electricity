import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, Send, X } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  is_bot: boolean;
  created_at: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('panne') || lowerMessage.includes('coupure') || lowerMessage.includes('électricité')) {
      return 'Je comprends que vous rencontrez un problème électrique. Pour signaler une panne, utilisez le formulaire de création de ticket sur votre tableau de bord. Décrivez le problème et notre équipe technique interviendra rapidement.';
    }

    if (lowerMessage.includes('facture') || lowerMessage.includes('payer') || lowerMessage.includes('paiement')) {
      return 'Pour consulter et payer vos factures, rendez-vous dans la section "Mes Factures". Vous pouvez payer par Orange Money, MTN Money, Moov Money ou carte bancaire.';
    }

    if (lowerMessage.includes('délai') || lowerMessage.includes('combien de temps') || lowerMessage.includes('quand')) {
      return 'Les délais d\'intervention dépendent de la priorité : Critique (2-4h), Haute (8-12h), Moyenne (24-48h), Basse (3-5 jours). Vous recevrez des notifications sur l\'avancement de votre ticket.';
    }

    if (lowerMessage.includes('urgence') || lowerMessage.includes('urgent')) {
      return 'Pour une urgence électrique, créez un ticket avec la priorité "CRITIQUE". Notre équipe sera immédiatement notifiée. En cas de danger immédiat, contactez également les services d\'urgence.';
    }

    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return 'Bonjour ! Je suis EVA, votre assistante virtuelle GSE. Je peux vous aider à signaler une panne, consulter vos factures ou répondre à vos questions. Comment puis-je vous aider ?';
    }

    return 'Je suis EVA, votre assistante GSE. Je peux vous aider avec les pannes électriques, les factures et les questions générales. Pouvez-vous reformuler votre question ?';
  };

  const handleSend = async () => {
    if (!input.trim() || !user || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const { data: userMsg, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
          is_bot: false,
        })
        .select()
        .single();

      if (userError) throw userError;

      setMessages((prev) => [...prev, userMsg]);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botResponse = getBotResponse(userMessage);

      const { data: botMsg, error: botError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: botResponse,
          is_bot: true,
        })
        .select()
        .single();

      if (botError) throw botError;

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-bold">EVA - Assistante GSE</h3>
            <p className="text-xs opacity-90">En ligne</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Bonjour ! Comment puis-je vous aider ?</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_bot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.is_bot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
