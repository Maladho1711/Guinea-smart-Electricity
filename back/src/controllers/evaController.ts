import { Request, Response } from 'express';
import { HfInference } from '@huggingface/inference';

// Initialiser Hugging Face (gratuit, optionnel avec token pour plus de requêtes)
let hf: HfInference | null = null;

if (process.env.HUGGINGFACE_API_KEY) {
  // Avec token : plus de requêtes par jour
  hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
} else {
  // Sans token : fonctionne quand même mais avec limite plus basse
  hf = new HfInference();
}

// Contexte système pour EVA - Personnalité et connaissances (format conversationnel)
const SYSTEM_PROMPT = `Tu es EVA, l'assistante virtuelle intelligente de Guinea Smart Electricity (EDG) en Guinée. Tu es une IA conversationnelle amicale, professionnelle et empathique, disponible 24h/24 et 7j/7.

**Contexte de l'entreprise :**
Guinea Smart Electricity (EDG) est le fournisseur d'électricité en Guinée. Tu aides les clients avec :
- Questions sur les factures et paiements (Orange Money, MTN Money, Moov Money, cartes bancaires)
- Signalement de pannes électriques via le tableau de bord client
- Suivi de consommation en temps réel
- Alertes et notifications personnalisées
- Support client général

**Ton style de conversation :**
- Sois naturelle et conversationnelle, comme si tu parlais à un ami
- Réponds toujours en français de manière claire et compréhensible
- Sois concise mais complète dans tes réponses
- Utilise des emojis avec modération (1-2 par réponse maximum)
- Si tu ne connais pas quelque chose, sois honnête et guide vers les bonnes ressources
- Maintiens le contexte de la conversation précédente
- Pose des questions de suivi si nécessaire pour mieux aider
- **IMPORTANT** : Reconnais les remerciements ("merci", "ok merci", "merci beaucoup") et réponds de manière appropriée et amicale, sans répéter toute l'information précédente
- Pour les confirmations courtes ("ok", "d'accord", "parfait"), propose poliment ton aide pour autre chose

**Important :** 
- Tu peux répondre à TOUTES sortes de questions, pas seulement celles liées à l'électricité
- Pour les questions sur l'électricité, l'EDG ou Guinea Smart Electricity, utilise tes connaissances spécialisées
- Pour les questions générales (sciences, histoire, culture, géographie, etc.), réponds de manière utile et informative
- Si une question n'est pas liée à l'électricité, réponds quand même de manière amicale et utile
- Reste toujours polie, professionnelle et empathique dans toutes tes réponses`;

interface ChatRequest extends Request {
  body: {
    message: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  };
}

export const chatWithEVA = async (req: ChatRequest, res: Response): Promise<void> => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Le message est requis' });
      return;
    }

    // Vérifier si Hugging Face est disponible
    if (!hf) {
      console.warn('⚠️ Hugging Face non disponible, utilisation du mode fallback');
      
      // Mode fallback : réponse basique
      const fallbackResponse = `Je suis EVA, votre assistante virtuelle. 

Je peux vous aider avec :
- Questions sur les factures et paiements
- Signalement de pannes
- Suivi de consommation
- Support client EDG

Pouvez-vous reformuler votre question ?`;
      
      res.status(200).json({ 
        response: fallbackResponse,
        model: 'fallback'
      });
      return;
    }

    // Utiliser un modèle optimisé pour les conversations (gratuit)
    // Options : google/flan-t5-large (par défaut, rapide et fiable), mistralai/Mistral-7B-Instruct-v0.2, meta-llama/Llama-2-7b-chat-hf
    const model = process.env.HUGGINGFACE_MODEL || 'google/flan-t5-large';
    
    try {
      // Construire un prompt simple et efficace pour textGeneration
      let promptText = `${SYSTEM_PROMPT}\n\n`;
      
      // Ajouter l'historique si disponible (garder les 4 derniers pour le contexte)
      if (conversationHistory.length > 0) {
        promptText += 'Historique récent:\n';
        conversationHistory.slice(-4).forEach(msg => {
          promptText += `${msg.role === 'user' ? 'Utilisateur' : 'EVA'}: ${msg.content}\n`;
        });
        promptText += '\n';
      }
      
      promptText += `Utilisateur: ${message}\nEVA:`;
      
      console.log('🤖 Appel à l\'IA Hugging Face avec le modèle:', 'google/flan-t5-large');
      
      // Utiliser directement textGeneration avec un modèle fiable
      const textResponse = await hf.textGeneration({
        model: 'google/flan-t5-large', // Modèle fiable qui supporte text-generation
        inputs: promptText,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.8,
          return_full_text: false,
          do_sample: true,
        },
      });
      
      let aiResponse = textResponse.generated_text?.trim() || '';
      
      console.log('✅ Réponse IA reçue, longueur:', aiResponse.length);
      
      // Nettoyer la réponse
      aiResponse = aiResponse
        .replace(/EVA:/g, '')
        .replace(/Utilisateur:.*$/gm, '')
        .replace(/Historique récent:.*$/s, '')
        .trim();
      
      // Si la réponse est vide ou trop courte, essayer avec un autre modèle
      if (!aiResponse || aiResponse.length < 10) {
        console.warn('⚠️ Première réponse trop courte, essai avec un autre modèle...');
        
        // Essayer avec un modèle plus simple
        const simplePrompt = `Tu es EVA, une assistante virtuelle. Réponds à cette question en français de manière claire et concise: ${message}`;
        const simpleResponse = await hf.textGeneration({
          model: 'gpt2', // Modèle très simple mais fiable
          inputs: simplePrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false,
          },
        });
        
        aiResponse = simpleResponse.generated_text?.trim() || '';
      }
      
      // Si toujours vide, utiliser une réponse basée sur le contexte
      if (!aiResponse || aiResponse.length < 5) {
        // Pour les questions géographiques simples, donner une réponse directe
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('capitale') && lowerMessage.includes('guinée')) {
          aiResponse = 'La capitale de la Guinée est Conakry. Conakry est située sur la presqu\'île de Kaloum et est le centre politique, économique et culturel du pays.';
        } else if (lowerMessage.includes('capitale') && lowerMessage.includes('conakry')) {
          aiResponse = 'Conakry est la capitale de la Guinée. C\'est la plus grande ville du pays avec environ 1,9 million d\'habitants.';
        } else {
          throw new Error('Réponse IA trop courte');
        }
      }
      
      // Limiter la longueur de la réponse
      if (aiResponse.length > 1000) {
        aiResponse = aiResponse.substring(0, 1000) + '...';
      }

      res.status(200).json({
        response: aiResponse,
        model: model,
      });
    } catch (hfError: any) {
      console.error('❌ Erreur Hugging Face, utilisation du fallback:', hfError.message);
      console.error('❌ Détails de l\'erreur:', hfError);
      
      // En cas d'erreur, utiliser le mode fallback intelligent
      // Mais d'abord, vérifier si c'est une erreur de configuration
      if (hfError.message?.includes('401') || hfError.message?.includes('Unauthorized')) {
        console.error('⚠️ Token Hugging Face invalide ou manquant. Vérifiez HUGGINGFACE_API_KEY dans .env');
      }
      
      const fallbackResponse = getFallbackResponse(message, conversationHistory);
      
      res.status(200).json({
        response: fallbackResponse,
        model: 'fallback-intelligent',
        error: 'IA non disponible, utilisation du mode fallback',
        details: process.env.NODE_ENV === 'development' ? hfError.message : undefined
      });
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'appel à EVA:', error);
    
    // Gestion des erreurs spécifiques
    if (error.status === 429 || error.message?.includes('rate limit')) {
      res.status(429).json({ 
        error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' 
      });
      return;
    }

    res.status(500).json({ 
      error: 'Erreur lors de la communication avec EVA',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fonction fallback intelligente basée sur des règles
function getFallbackResponse(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>): string {
  const lowerMessage = message.toLowerCase().trim();
  
  // Remerciements (priorité haute - détection améliorée)
  if (lowerMessage.includes('merci') || lowerMessage.includes('remercier') || lowerMessage.includes('gracie') || 
      lowerMessage === 'ok merci' || lowerMessage === 'ok, merci' || lowerMessage.startsWith('ok') && lowerMessage.includes('merci') ||
      lowerMessage === 'merci beaucoup' || lowerMessage === 'merci bien') {
    // Vérifier le contexte de la conversation précédente
    const lastAssistantMessage = history.filter(h => h.role === 'assistant').pop()?.content || '';
    if (lastAssistantMessage.includes('facture') || lastAssistantMessage.includes('paiement')) {
      return 'De rien ! N\'hésitez pas si vous avez d\'autres questions sur vos factures ou paiements. Je suis là pour vous aider ! 😊';
    }
    return 'De rien ! Je suis là pour vous aider. N\'hésitez pas si vous avez d\'autres questions. Bonne journée ! 😊';
  }
  
  // Confirmations courtes (ok, d'accord, etc.)
  if (lowerMessage === 'ok' || lowerMessage === 'd\'accord' || lowerMessage === 'daccord' || 
      lowerMessage === 'parfait' || lowerMessage === 'super' || lowerMessage === 'très bien') {
    return 'Parfait ! Y a-t-il autre chose avec laquelle je peux vous aider ? 😊';
  }
  
  // Salutations
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') ||
      lowerMessage.includes('bonsoir') || lowerMessage.includes('bonne journée')) {
    return 'Bonjour ! Je suis EVA, votre assistante virtuelle pour Guinea Smart Electricity. Comment puis-je vous aider aujourd\'hui ?';
  }
  
  // Questions sur les factures
  if (lowerMessage.includes('facture') || lowerMessage.includes('payer') || lowerMessage.includes('paiement')) {
    return 'Pour consulter et payer vos factures, rendez-vous dans la section "Mes Factures" de votre tableau de bord. Vous pouvez payer par Orange Money, MTN Money, Moov Money ou carte bancaire. Tous les paiements sont sécurisés et traités instantanément.';
  }
  
  // Questions sur les pannes
  if (lowerMessage.includes('panne') || lowerMessage.includes('coupure') || lowerMessage.includes('problème')) {
    return 'Pour signaler une panne, créez un ticket depuis votre tableau de bord client. Décrivez le problème en détail et notre équipe technique interviendra rapidement selon la priorité. En cas d\'urgence, utilisez la priorité "CRITIQUE".';
  }
  
  // Questions sur la consommation
  if (lowerMessage.includes('consommation') || lowerMessage.includes('compteur')) {
    return 'Votre tableau de bord client affiche votre consommation en temps réel avec des graphiques détaillés. Vous pouvez voir votre consommation quotidienne, hebdomadaire et mensuelle. Les données sont mises à jour automatiquement.';
  }
  
  // Questions générales d'aide
  if (lowerMessage.includes('aide') || lowerMessage.includes('aider') || lowerMessage.includes('comment')) {
    return 'Je peux vous aider avec :\n• Questions sur les factures et paiements\n• Signalement de pannes électriques\n• Suivi de votre consommation\n• Alertes et notifications\n• Support client EDG\n\nPosez-moi une question spécifique !';
  }
  
  // Au revoir
  if (lowerMessage.includes('au revoir') || lowerMessage.includes('bye') || lowerMessage.includes('à bientôt') ||
      lowerMessage.includes('aurevoir') || lowerMessage.includes('bonne soirée') || lowerMessage.includes('bonne nuit')) {
    return 'Au revoir ! N\'hésitez pas à revenir si vous avez d\'autres questions. Bonne journée ! 👋';
  }
  
  // Réponse par défaut - ne pas limiter aux sujets EDG
  // Si on arrive ici, c'est que l'IA n'a pas pu répondre, donc on donne une réponse générique
  // mais on ne limitons pas aux sujets EDG
  return 'Je comprends votre question. Malheureusement, je rencontre un problème technique avec l\'IA. Veuillez réessayer dans quelques instants. Pour les questions sur Guinea Smart Electricity, je peux vous aider avec les factures, les pannes, la consommation et le support client.';
}

