import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Bot, CreditCard, Bell, Zap, Shield, HeadphonesIcon, Send, X, Sparkles, Search, RotateCcw, Lightbulb } from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '../../config/api';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSection {
    title: string;
    icon: React.ComponentType<LucideProps>;
    items: FAQItem[];
}

interface ChatMessage {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

export function FAQ() {
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
    const [isEvaOpen, setIsEvaOpen] = useState(false);
    const [evaMessages, setEvaMessages] = useState<ChatMessage[]>([]);
    const [evaInput, setEvaInput] = useState('');
    const [evaLoading, setEvaLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [evaError, setEvaError] = useState<string | null>(null);
    const evaMessagesEndRef = useRef<HTMLDivElement>(null);
    const evaInputRef = useRef<HTMLInputElement>(null);

    // Suggestions de questions rapides
    const quickQuestions = useMemo(() => [
        'Comment payer ma facture ?',
        'Comment signaler une panne ?',
        'Comment suivre ma consommation ?',
        'Quels moyens de paiement sont acceptés ?',
        'Comment contacter le support ?'
    ], []);

    // Mémoriser faqData pour éviter les re-renders
    const faqData: FAQSection[] = useMemo(() => [
        {
            title: "À propos d'EVA (Assistant IA)",
            icon: Bot,
            items: [
                {
                    question: "Qu'est-ce qu'EVA et comment améliore-t-elle le service client EDG ?",
                    answer: "EVA est un assistant virtuel intelligent propulsé par l'intelligence artificielle qui révolutionne le service client EDG. Elle répond instantanément à vos questions, vous aide à gérer vos factures, prédit votre consommation et vous guide dans toutes vos démarches. Disponible 24h/24 et 7j/7, EVA améliore considérablement votre expérience client en réduisant les temps d'attente et en offrant un support personnalisé."
                },
                {
                    question: "Comment parler avec EVA ?",
                    answer: "Pour parler avec EVA, il suffit de cliquer sur l'icône de chat en bas à droite de votre écran une fois connecté à votre compte. EVA est accessible depuis votre tableau de bord client. Vous pouvez lui poser des questions en langage naturel, et elle vous répondra instantanément avec des informations précises et pertinentes."
                },
                {
                    question: "EVA peut-elle prédire ma consommation ?",
                    answer: "Oui ! EVA utilise des algorithmes d'intelligence artificielle avancés pour analyser vos habitudes de consommation passées et prédire votre consommation future. Elle peut vous alerter en cas de surconsommation inhabituelle et vous proposer des recommandations pour optimiser votre utilisation d'électricité."
                }
            ]
        },
        {
            title: "Paiements et Factures",
            icon: CreditCard,
            items: [
                {
                    question: "Quels moyens de paiement sont acceptés ?",
                    answer: "Guinea Smart Electricity accepte plusieurs moyens de paiement pour votre commodité : Orange Money, MTN Money, Moov Money, et les cartes bancaires. Tous les paiements sont sécurisés et traités instantanément. Vous recevrez une confirmation immédiate après chaque transaction."
                },
                {
                    question: "Comment consulter mes factures ?",
                    answer: "Vous pouvez consulter toutes vos factures depuis votre tableau de bord client. Accédez à la section 'Factures' pour voir l'historique complet de vos factures, télécharger les PDF, et suivre l'état de vos paiements. Les factures sont disponibles en ligne dès leur émission."
                },
                {
                    question: "Puis-je payer par tranches ?",
                    answer: "Oui, vous pouvez payer vos factures par tranches selon vos possibilités. Contactez le support client EDG ou utilisez EVA pour discuter des options de paiement échelonné disponibles. Nous proposons des solutions flexibles pour vous aider à gérer vos paiements."
                }
            ]
        },
        {
            title: "Alertes et Notifications",
            icon: Bell,
            items: [
                {
                    question: "Quel type d'alertes vais-je recevoir ?",
                    answer: "Vous recevrez des alertes pour : les nouvelles factures disponibles, les rappels de paiement, les alertes de surconsommation, les notifications de maintenance programmée, les mises à jour sur vos tickets de panne, et les informations importantes concernant votre service électrique. Toutes les alertes sont personnalisables selon vos préférences."
                },
                {
                    question: "Puis-je personnaliser mes notifications ?",
                    answer: "Absolument ! Vous pouvez personnaliser vos notifications depuis les paramètres de votre compte. Choisissez les types d'alertes que vous souhaitez recevoir, la fréquence, et le canal de communication (email, SMS, notifications push). Vous avez un contrôle total sur vos notifications."
                }
            ]
        },
        {
            title: "Consommation et Compteurs",
            icon: Zap,
            items: [
                {
                    question: "Comment suivre ma consommation en temps réel ?",
                    answer: "Votre tableau de bord client affiche votre consommation en temps réel avec des graphiques détaillés. Vous pouvez voir votre consommation quotidienne, hebdomadaire et mensuelle. Les données sont mises à jour automatiquement et vous permettent d'identifier vos habitudes de consommation pour mieux les gérer."
                },
                {
                    question: "Que faire en cas de surconsommation inhabituelle ?",
                    answer: "Si vous remarquez une surconsommation inhabituelle, EVA vous alertera automatiquement. Vous pouvez également signaler le problème via votre tableau de bord en créant un ticket. Notre équipe technique pourra vérifier votre compteur et identifier la cause du problème. En attendant, vérifiez vos appareils électriques et assurez-vous qu'aucun équipement ne fonctionne inutilement."
                },
                {
                    question: "Mon compteur affiche une erreur, que faire ?",
                    answer: "Si votre compteur affiche une erreur, créez immédiatement un ticket de panne depuis votre tableau de bord. Notre équipe technique sera notifiée et interviendra dans les plus brefs délais. En cas d'urgence, contactez le support EDG directement. Ne tentez jamais de manipuler le compteur vous-même pour des raisons de sécurité."
                }
            ]
        },
        {
            title: "Sécurité et Confidentialité",
            icon: Shield,
            items: [
                {
                    question: "Mes données sont-elles sécurisées ?",
                    answer: "Oui, la sécurité de vos données est notre priorité absolue. Nous utilisons des protocoles de chiffrement avancés (SSL/TLS) pour protéger toutes vos informations. Votre compte est protégé par authentification sécurisée, et nous respectons les normes internationales de protection des données. Vos informations financières sont traitées de manière sécurisée et ne sont jamais stockées en clair."
                },
                {
                    question: "Qui a accès à mes informations ?",
                    answer: "Seuls les membres autorisés de l'équipe EDG ayant besoin d'accéder à vos informations pour fournir le service ont accès à vos données. Tous les accès sont tracés et audités régulièrement. Nous ne partageons jamais vos informations avec des tiers sans votre consentement explicite, conformément à notre politique de confidentialité."
                }
            ]
        },
        {
            title: "Support Client EDG",
            icon: HeadphonesIcon,
            items: [
                {
                    question: "Comment contacter le support EDG ?",
                    answer: "Vous pouvez contacter le support EDG de plusieurs façons : via EVA (notre assistant IA disponible 24h/24), en créant un ticket depuis votre tableau de bord, par email à support@edg.gn, ou par téléphone au numéro dédié. EVA peut répondre à la plupart de vos questions instantanément, mais pour les cas complexes, notre équipe humaine prendra le relais."
                },
                {
                    question: "Quel est le délai de réponse ?",
                    answer: "EVA répond instantanément à vos questions. Pour les tickets créés, notre équipe s'engage à répondre dans un délai de 24 heures pour les demandes standard, et dans les 2 heures pour les urgences. Les tickets de panne sont traités en priorité selon leur niveau de criticité."
                },
                {
                    question: "Puis-je suggérer des améliorations ?",
                    answer: "Absolument ! Nous apprécions vos suggestions et vos retours. Vous pouvez suggérer des améliorations via EVA, en créant un ticket avec le type 'Suggestion', ou en contactant directement notre équipe. Votre feedback nous aide à améliorer continuellement nos services et votre expérience utilisateur."
                }
            ]
        }
    ], []);

    const toggleItem = useCallback((itemKey: string) => {
        setOpenItems(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    }, []);

    // Filtrer les FAQ selon la recherche
    const filteredFAQData = useMemo(() => {
        if (!searchQuery.trim()) return faqData;

        const query = searchQuery.toLowerCase();
        return faqData.map(section => ({
            ...section,
            items: section.items.filter(item =>
                item.question.toLowerCase().includes(query) ||
                item.answer.toLowerCase().includes(query) ||
                section.title.toLowerCase().includes(query)
            )
        })).filter(section => section.items.length > 0);
    }, [searchQuery, faqData]);

    // Fonction pour trouver la réponse dans la FAQ (mémorisée)
    const findAnswerInFAQ = useCallback((question: string): string | null => {
        const lowerQuestion = question.toLowerCase();

        // Parcourir toutes les sections et questions de la FAQ
        for (const section of faqData) {
            for (const item of section.items) {
                const lowerItemQuestion = item.question.toLowerCase();
                const lowerItemAnswer = item.answer.toLowerCase();

                // Vérifier si la question de l'utilisateur correspond à une question de la FAQ
                const questionKeywords = lowerItemQuestion.split(' ').filter(w => w.length > 3);
                const answerKeywords = lowerItemAnswer.split(' ').filter(w => w.length > 3);

                // Vérifier la correspondance avec la question
                const questionMatch = questionKeywords.some(keyword =>
                    lowerQuestion.includes(keyword) || lowerItemQuestion.includes(lowerQuestion.substring(0, 20))
                );

                // Vérifier la correspondance avec les mots-clés de la réponse
                const answerMatch = answerKeywords.some(keyword => lowerQuestion.includes(keyword));

                // Vérifier les mots-clés spécifiques
                const specificMatches = {
                    'eva': ['eva', 'assistant', 'ia', 'intelligence artificielle', 'bot', 'chatbot'],
                    'facture': ['facture', 'payer', 'paiement', 'argent', 'montant', 'prix', 'coût'],
                    'compteur': ['compteur', 'lecture', 'index', 'consommation'],
                    'panne': ['panne', 'coupure', 'problème', 'défaillance', 'erreur', 'dysfonctionnement'],
                    'alerte': ['alerte', 'notification', 'rappel', 'avertissement'],
                    'sécurité': ['sécurité', 'confidentialité', 'données', 'protection', 'privé'],
                    'support': ['support', 'contact', 'aide', 'assistance', 'service client']
                };

                for (const [category, keywords] of Object.entries(specificMatches)) {
                    if (keywords.some(kw => lowerQuestion.includes(kw))) {
                        // Trouver la section correspondante
                        const matchingSection = faqData.find(s =>
                            s.title.toLowerCase().includes(category) ||
                            s.items.some(i => i.answer.toLowerCase().includes(category))
                        );
                        if (matchingSection) {
                            const matchingItem = matchingSection.items.find(i =>
                                i.question.toLowerCase().includes(keywords.find(kw => lowerQuestion.includes(kw)) || '') ||
                                i.answer.toLowerCase().includes(keywords.find(kw => lowerQuestion.includes(kw)) || '')
                            );
                            if (matchingItem) {
                                return matchingItem.answer;
                            }
                        }
                    }
                }

                if (questionMatch || answerMatch) {
                    return item.answer;
                }
            }
        }

        return null;
    }, [faqData]);

    // Fonction améliorée pour obtenir la réponse d'EVA (mémorisée) - déclarée en premier
    const getEvaResponse = useCallback((userMessage: string): string | null => {
        const lowerMessage = userMessage.toLowerCase().trim();

        // Réponses aux salutations (priorité haute)
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('bonsoir') || lowerMessage.includes('bonne journée')) {
            return 'Bonjour ! Je suis EVA, votre assistante virtuelle intelligente pour Guinea Smart Electricity. Je peux répondre à vos questions sur les factures, les pannes, la consommation, et bien plus encore. Comment puis-je vous aider aujourd\'hui ?';
        }

        // Questions de recherche / chercher / trouver
        if (lowerMessage.includes('rechercher') || lowerMessage.includes('chercher') || lowerMessage.includes('trouver') ||
            lowerMessage.includes('recherche') || lowerMessage.includes('où') || lowerMessage.includes('comment trouver')) {
            return 'Je peux vous aider à trouver ce que vous cherchez ! Voici ce que vous pouvez rechercher :\n\n' +
                '🔍 **Dans la FAQ** : Utilisez la barre de recherche en haut de la page pour trouver rapidement des réponses\n' +
                '💳 **Factures** : Consultez vos factures depuis votre tableau de bord client\n' +
                '⚡ **Consommation** : Suivez votre consommation en temps réel sur votre dashboard\n' +
                '🎫 **Tickets** : Consultez l\'état de vos tickets de panne depuis votre espace\n' +
                '📞 **Support** : Contactez-nous via EVA, email (support@edg.gn) ou téléphone\n\n' +
                'Que souhaitez-vous rechercher spécifiquement ? Par exemple :\n' +
                '• "Comment trouver mes factures ?"\n' +
                '• "Où voir ma consommation ?"\n' +
                '• "Comment rechercher dans la FAQ ?"';
        }

        // Questions d'aide générale
        if (lowerMessage.includes('aide') || lowerMessage.includes('aider') || lowerMessage.includes('peux-tu') || lowerMessage.includes('peux tu') ||
            lowerMessage.includes('comment') && (lowerMessage.includes('faire') || lowerMessage.includes('utiliser') || lowerMessage.includes('m\'aider'))) {
            return 'Bien sûr ! Je suis là pour vous aider. Voici ce que je peux faire pour vous :\n\n' +
                '✅ Répondre à vos questions sur Guinea Smart Electricity\n' +
                '✅ Vous aider avec vos factures et paiements\n' +
                '✅ Vous guider pour signaler une panne ou un problème\n' +
                '✅ Vous expliquer comment suivre votre consommation\n' +
                '✅ Répondre à vos questions sur les alertes et notifications\n' +
                '✅ Vous informer sur la sécurité et la confidentialité\n\n' +
                'Posez-moi une question spécifique ou explorez la FAQ ci-dessous pour plus d\'informations !';
        }

        // Questions sur les capacités d'EVA
        if (lowerMessage.includes('qui es-tu') || lowerMessage.includes('qui es tu') || lowerMessage.includes('qu\'est-ce que tu') ||
            lowerMessage.includes('que peux-tu') || lowerMessage.includes('que peux tu') || lowerMessage.includes('ce que tu peux')) {
            // Chercher la réponse dans la FAQ sur EVA
            const evaSection = faqData.find(s => s.title.includes('EVA'));
            if (evaSection && evaSection.items.length > 0) {
                return evaSection.items[0].answer;
            }
            return 'Je suis EVA, votre assistante virtuelle intelligente propulsée par l\'intelligence artificielle. Je révolutionne le service client EDG en répondant instantanément à vos questions, en vous aidant à gérer vos factures, en prédisant votre consommation et en vous guidant dans toutes vos démarches. Disponible 24h/24 et 7j/7, j\'améliore votre expérience client en réduisant les temps d\'attente et en offrant un support personnalisé.';
        }

        // D'abord, chercher dans la FAQ (après les cas spéciaux)
        const faqAnswer = findAnswerInFAQ(userMessage);
        if (faqAnswer) {
            return faqAnswer;
        }

        // Questions sur les factures
        if (lowerMessage.includes('facture') || lowerMessage.includes('payer') || lowerMessage.includes('paiement') ||
            lowerMessage.includes('montant') || lowerMessage.includes('argent') || lowerMessage.includes('coût')) {
            const factureSection = faqData.find(s => s.title.includes('Factures'));
            if (factureSection && factureSection.items.length > 0) {
                return factureSection.items[0].answer + '\n\n💡 Vous pouvez aussi consulter vos factures depuis votre tableau de bord client.';
            }
        }

        // Questions sur les pannes
        if (lowerMessage.includes('panne') || lowerMessage.includes('coupure') || lowerMessage.includes('problème') ||
            lowerMessage.includes('défaillance') || lowerMessage.includes('erreur') || lowerMessage.includes('dysfonctionnement')) {
            return 'Je comprends que vous rencontrez un problème électrique. Pour signaler une panne, vous pouvez :\n\n' +
                '1️⃣ Créer un ticket depuis votre tableau de bord client\n' +
                '2️⃣ Décrire le problème en détail\n' +
                '3️⃣ Notre équipe technique interviendra rapidement selon la priorité\n\n' +
                'En cas d\'urgence, créez un ticket avec la priorité "CRITIQUE". Notre équipe sera immédiatement notifiée.';
        }

        // Questions sur la consommation
        if (lowerMessage.includes('consommation') || lowerMessage.includes('compteur') || lowerMessage.includes('kwh') ||
            lowerMessage.includes('électricité') && (lowerMessage.includes('suivre') || lowerMessage.includes('voir'))) {
            const consommationSection = faqData.find(s => s.title.includes('Consommation'));
            if (consommationSection && consommationSection.items.length > 0) {
                return consommationSection.items[0].answer;
            }
        }

        // Remerciements (détection améliorée)
        if (lowerMessage.includes('merci') || lowerMessage.includes('remercier') || lowerMessage.includes('gracie') ||
            lowerMessage === 'ok merci' || lowerMessage === 'ok, merci' ||
            (lowerMessage.startsWith('ok') && lowerMessage.includes('merci')) ||
            lowerMessage === 'merci beaucoup' || lowerMessage === 'merci bien') {
            // Note: Le contexte sera géré par l'IA via l'historique de conversation
            return 'De rien ! Je suis là pour vous aider. N\'hésitez pas si vous avez d\'autres questions. Bonne journée ! 😊';
        }

        // Confirmations courtes
        if (lowerMessage === 'ok' || lowerMessage === 'd\'accord' || lowerMessage === 'daccord' ||
            lowerMessage === 'parfait' || lowerMessage === 'super' || lowerMessage === 'très bien') {
            return 'Parfait ! Y a-t-il autre chose avec laquelle je peux vous aider ? 😊';
        }

        // Au revoir
        if (lowerMessage.includes('au revoir') || lowerMessage.includes('bye') || lowerMessage.includes('à bientôt') ||
            lowerMessage.includes('aurevoir') || lowerMessage.includes('bonne soirée')) {
            return 'Au revoir ! N\'hésitez pas à revenir si vous avez d\'autres questions. Bonne journée ! 👋';
        }

        // Réponse par défaut - laisser l'IA répondre même aux questions générales
        // Ne pas limiter aux sujets EDG, l'IA peut répondre à tout
        // Retourner null pour forcer l'utilisation de l'IA au lieu du fallback
        return null;
    }, [faqData, findAnswerInFAQ]);

    // Fonction pour envoyer un message à EVA (avec vraie IA) - mémorisée
    const handleEvaSend = useCallback(async (prefilledMessage?: string) => {
        const message = prefilledMessage || evaInput.trim();
        if (!message || evaLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: message,
            isBot: false,
            timestamp: new Date()
        };

        setEvaMessages(prev => [...prev, userMessage]);
        setEvaInput('');
        setEvaError(null);
        setEvaLoading(true);

        try {
            // Construire l'historique de conversation pour le contexte (format pour l'IA)
            // Inclure tous les messages sauf le message de bienvenue, pour un contexte complet
            const conversationHistory = evaMessages
                .filter(msg => msg.id !== 'welcome') // Exclure le message de bienvenue
                .slice(-12) // Garder les 12 derniers messages pour un meilleur contexte
                .map(msg => ({
                    role: msg.isBot ? 'assistant' as const : 'user' as const,
                    content: msg.text
                }));

            // Appeler l'API backend avec la vraie IA (toujours en priorité)
            const response = await apiRequest(API_ENDPOINTS.eva.chat, {
                method: 'POST',
                body: JSON.stringify({
                    message: message,
                    conversationHistory: conversationHistory // Envoyer l'historique complet pour le contexte
                })
            });

            // Vérifier que la réponse vient bien de l'IA (pas du fallback)
            const botResponse = response.response || response.message ||
                'Désolé, je n\'ai pas pu générer de réponse. Pouvez-vous reformuler votre question ?';

            // Si le modèle utilisé est 'fallback' ou 'fallback-intelligent', c'est qu'on n'a pas utilisé l'IA
            if (response.model && (response.model.includes('fallback'))) {
                console.warn('⚠️ Mode fallback utilisé au lieu de l\'IA');
            } else {
                console.log('✅ Réponse générée par l\'IA:', response.model || 'modèle inconnu');
            }

            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                isBot: true,
                timestamp: new Date()
            };

            setEvaMessages(prev => [...prev, botMessage]);
            setEvaError(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            console.error('❌ Erreur lors de l\'appel à EVA:', errorMessage);

            // Gestion spécifique des erreurs
            if (error instanceof Error && 'status' in error) {
                const status = (error as { status?: number }).status;
                if (status === 429) {
                    setEvaError('Trop de requêtes. Veuillez patienter quelques instants avant de réessayer.');
                } else if (status === 500 || status === 503) {
                    setEvaError('Service temporairement indisponible. Réessayez dans quelques instants.');
                } else {
                    setEvaError('Erreur de connexion. Utilisation du mode fallback.');
                }
            } else {
                setEvaError('Erreur de connexion. Utilisation du mode fallback.');
            }

            // En cas d'erreur critique, utiliser le fallback intelligent (logique basée sur règles)
            // Ceci ne devrait se produire que si l'IA est vraiment indisponible
            const fallbackResponse = getEvaResponse(message);

            // Si le fallback retourne null, cela signifie qu'on doit utiliser l'IA
            // Dans ce cas, afficher un message d'erreur mais ne pas utiliser de fallback
            if (fallbackResponse === null) {
                const errorMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    text: 'Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants. Si le problème persiste, l\'IA devrait être disponible bientôt.',
                    isBot: true,
                    timestamp: new Date()
                };
                setEvaMessages(prev => [...prev, errorMessage]);
            } else {
                const botMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    text: fallbackResponse,
                    isBot: true,
                    timestamp: new Date()
                };
                setEvaMessages(prev => [...prev, botMessage]);
            }
        } finally {
            setEvaLoading(false);

            // Scroll vers le bas
            setTimeout(() => {
                evaMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [evaInput, evaLoading, evaMessages, getEvaResponse]);

    // Fonction pour poser une question à EVA depuis la FAQ
    const askEva = useCallback((question: string) => {
        setIsEvaOpen(true);
        setEvaInput(question);
        setEvaError(null);
        // Attendre un peu pour que le chat s'ouvre, puis envoyer
        setTimeout(() => {
            if (evaInputRef.current) {
                evaInputRef.current.focus();
            }
            setTimeout(() => {
                handleEvaSend(question);
            }, 300);
        }, 100);
    }, [handleEvaSend]);

    // Fonction pour réinitialiser la conversation
    const resetConversation = useCallback(() => {
        setEvaMessages([]);
        setEvaError(null);
        setIsEvaOpen(true);
        // Réinitialiser avec le message de bienvenue
        const welcomeMessage: ChatMessage = {
            id: 'welcome',
            text: 'Bonjour ! Je suis EVA, votre assistante virtuelle intelligente. Je peux répondre à toutes vos questions sur Guinea Smart Electricity. Posez-moi une question ou explorez la FAQ ci-dessous !',
            isBot: true,
            timestamp: new Date()
        };
        setEvaMessages([welcomeMessage]);
    }, []);


    // Scroll automatique vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        if (evaMessages.length > 0) {
            evaMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [evaMessages]);

    // Initialiser EVA avec un message de bienvenue
    useEffect(() => {
        if (isEvaOpen && evaMessages.length === 0) {
            const welcomeMessage: ChatMessage = {
                id: 'welcome',
                text: 'Bonjour ! Je suis EVA, votre assistante virtuelle intelligente. Je peux répondre à toutes vos questions sur Guinea Smart Electricity. Posez-moi une question ou explorez la FAQ ci-dessous !',
                isBot: true,
                timestamp: new Date()
            };
            setEvaMessages([welcomeMessage]);
        }
    }, [isEvaOpen, evaMessages.length]);

    // Sauvegarder l'historique dans localStorage
    useEffect(() => {
        if (evaMessages.length > 1) {
            try {
                localStorage.setItem('eva_conversation_history', JSON.stringify(evaMessages));
            } catch (error) {
                console.warn('Impossible de sauvegarder l\'historique:', error);
            }
        }
    }, [evaMessages]);

    // Charger l'historique au montage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('eva_conversation_history');
            if (saved && isEvaOpen) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Convertir les timestamps en Date
                    const messages = parsed.map((msg: ChatMessage) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));
                    setEvaMessages(messages);
                }
            }
        } catch (error) {
            console.warn('Impossible de charger l\'historique:', error);
        }
    }, [isEvaOpen]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-32 pb-16">
            <div className="max-w-4xl mx-auto px-6">
                {/* En-tête */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-md">
                        <HeadphonesIcon className="w-4 h-4" />
                        <span>Support Client EDG Propulsé par l'IA</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
                        Questions Fréquentes
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-6">
                        Découvrez comment Guinea Smart Electricity révolutionne le service client EDG grâce à l'intelligence artificielle
                    </p>

                    {/* Barre de recherche */}
                    <div className="max-w-2xl mx-auto mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher dans la FAQ..."
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        {searchQuery && (
                            <p className="text-sm text-gray-600 mt-2">
                                {filteredFAQData.reduce((acc, section) => acc + section.items.length, 0)} résultat(s) trouvé(s)
                            </p>
                        )}
                    </div>
                </div>

                {/* Sections FAQ */}
                <div className="space-y-3 mb-12">
                    {filteredFAQData.length === 0 && searchQuery ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Aucun résultat trouvé pour "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-green-600 hover:text-green-700 font-semibold"
                            >
                                Effacer la recherche
                            </button>
                        </div>
                    ) : (
                        filteredFAQData.map((section, sectionIndex) => {
                            const IconComponent = section.icon;
                            return (
                                <div
                                    key={sectionIndex}
                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* En-tête de la carte avec titre et icône */}
                                    <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-green-100 rounded-lg">
                                                <IconComponent className="w-5 h-5 text-green-600" />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {section.title}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Questions visibles directement */}
                                    <div className="px-4 py-3 space-y-2">
                                        {section.items.map((item, itemIndex) => {
                                            const itemKey = `${section.title}-${itemIndex}`;
                                            return (
                                                <div
                                                    key={itemIndex}
                                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-green-300 transition-colors"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(itemKey)}
                                                        className="w-full flex items-center justify-between text-left p-3 hover:bg-green-50 transition-colors"
                                                    >
                                                        <span className="font-medium text-sm text-gray-800 pr-3 flex-1 text-left">
                                                            {item.question}
                                                        </span>
                                                        {openItems[itemKey] ? (
                                                            <ChevronUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                        )}
                                                    </button>
                                                    {openItems[itemKey] && (
                                                        <div className="px-3 pb-3 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-green-50/30">
                                                            <p className="text-sm mb-3">{item.answer}</p>
                                                            <button
                                                                onClick={() => askEva(item.question)}
                                                                className="flex items-center gap-2 text-xs text-green-600 hover:text-green-700 font-semibold transition-colors"
                                                            >
                                                                <Bot className="w-3 h-3" />
                                                                <span>Demander plus d'infos à EVA</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }))}
                </div>

                {/* Section CTA */}
                <div className="bg-green-600 rounded-xl shadow-xl p-8 text-center text-white hover:bg-green-700 transition-colors">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3">
                        Vous ne trouvez pas votre réponse ?
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                        EVA, notre assistant IA, est disponible 24h/24 pour améliorer votre expérience client EDG
                    </p>
                    <button
                        onClick={() => setIsEvaOpen(true)}
                        className="inline-block bg-yellow-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
                    >
                        Parler à EVA maintenant
                    </button>
                </div>
            </div>

            {/* Chat EVA intégré */}
            {isEvaOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border-2 border-green-200">
                    {/* En-tête EVA */}
                    <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white p-4 rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">EVA - Assistant IA</h3>
                                <p className="text-xs opacity-90">En ligne • Disponible 24/7</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {evaMessages.length > 1 && (
                                <button
                                    onClick={resetConversation}
                                    className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                                    title="Nouvelle conversation"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsEvaOpen(false)}
                                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                                title="Fermer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {/* Suggestions de questions rapides (si pas de messages ou seulement welcome) */}
                        {evaMessages.length <= 1 && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                                    <Lightbulb className="w-4 h-4" />
                                    <span className="font-semibold">Questions rapides :</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((question, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setEvaInput(question);
                                                setIsEvaOpen(true);
                                                setTimeout(() => {
                                                    handleEvaSend(question);
                                                }, 200);
                                            }}
                                            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-green-500 hover:bg-green-50 transition-colors text-gray-700"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {evaMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-lg ${msg.isBot
                                        ? 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                                        : 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white shadow-md'
                                        }`}
                                >
                                    {msg.isBot && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <Bot className="w-3 h-3 text-green-600" />
                                            <span className="text-xs font-semibold text-green-600">EVA</span>
                                        </div>
                                    )}
                                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {evaLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message d'erreur */}
                        {evaError && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                                <p className="font-semibold mb-1">⚠️ Avertissement</p>
                                <p>{evaError}</p>
                            </div>
                        )}

                        <div ref={evaMessagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-white rounded-b-xl">
                        <div className="flex space-x-2">
                            <input
                                ref={evaInputRef}
                                type="text"
                                value={evaInput}
                                onChange={(e) => setEvaInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleEvaSend()}
                                placeholder="Posez votre question à EVA..."
                                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                disabled={evaLoading}
                            />
                            <button
                                onClick={() => handleEvaSend()}
                                disabled={evaLoading || !evaInput.trim()}
                                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                                💡 EVA utilise l'IA pour répondre à vos questions
                            </p>
                            {evaMessages.length > 1 && (
                                <button
                                    onClick={resetConversation}
                                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                    title="Nouvelle conversation"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Nouveau</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bouton flottant pour ouvrir EVA */}
            {!isEvaOpen && (
                <button
                    onClick={() => setIsEvaOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 hover:scale-110 animate-pulse"
                    title="Parler à EVA"
                    aria-label="Ouvrir le chat EVA"
                >
                    <Bot className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </button>
            )}
        </div>
    );
}

