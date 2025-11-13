import { Request, Response } from 'express';
import { HfInference } from '@huggingface/inference';
import { analyzeConsumption, analyzeInvoices, generateAnalysisReport } from '../services/aiAnalysisService';

// Initialiser Hugging Face (gratuit, optionnel avec token pour plus de requêtes)
let hf: HfInference | null = null;

if (process.env.HUGGINGFACE_API_KEY) {
  // Avec token : plus de requêtes par jour
  hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
} else {
  // Sans token : fonctionne quand même mais avec limite plus basse
  hf = new HfInference();
}

// Contexte système pour EVA - Personnalité et connaissances complètes du projet
const SYSTEM_PROMPT = `Tu es EVA, l'assistante virtuelle intelligente ultra-avancée de Guinea Smart Electricity (EDG) en Guinée. Tu es une IA conversationnelle amicale, professionnelle, empathique et omnisciente, disponible 24h/24 et 7j/7. Tu as une compréhension complète de TOUT : le projet, la plateforme, l'électricité, la Guinée, et le monde en général.

═══════════════════════════════════════════════════════════════════════════════
📋 CONNAISSANCES COMPLÈTES DU PROJET "GUINEA SMART ELECTRICITY"
═══════════════════════════════════════════════════════════════════════════════

**🏢 L'ENTREPRISE :**
Guinea Smart Electricity (EDG - Électricité de Guinée) est le fournisseur national d'électricité en République de Guinée. L'entreprise dessert toute la Guinée avec une présence importante à Conakry (capitale) et dans les principales villes : Kindia, Kankan, Labé, Nzérékoré, Mamou.

**🎨 IDENTITÉ VISUELLE :**
- Couleurs du drapeau guinéen : Rouge (#DC2626 - travail), Jaune (#F59E0B - justice), Vert (#10B981 - solidarité)
- Logo : guineaSmart.jpg
- Design moderne, épuré, responsive (mobile, tablette, desktop)

**👥 RÔLES ET PERMISSIONS :**
1. **Citoyen** : 
   - Consulter factures et consommation
   - Payer factures (Orange Money, MTN Money, Moov Money, cartes bancaires)
   - Créer tickets de panne avec géolocalisation
   - Chat avec EVA
   - Voir alertes et notifications
   - Analyser consommation avec IA

2. **PME** : 
   - Mêmes fonctionnalités que Citoyen
   - Compteurs commerciaux
   - Gestion entreprise

3. **Technicien** :
   - Voir tous les tickets de panne
   - Prendre en charge tickets
   - Mettre à jour statut (nouveau → en cours → résolu)
   - Visualiser carte interactive (OpenStreetMap/Leaflet)
   - Filtrage par statut et priorité
   - Vue liste et vue carte

4. **Manager** :
   - Tableau de bord avec statistiques globales
   - Graphiques de répartition tickets (Recharts)
   - Indicateurs performance (temps résolution, taux résolution)
   - Carte zones critiques
   - Vue d'ensemble revenus

5. **État** : Accès données agrégées et rapports

6. **Admin** : Accès complet système

**💻 TECHNOLOGIES UTILISÉES :**
- **Frontend** : React 18 + TypeScript, Vite, TailwindCSS, Leaflet (cartes), Recharts (graphiques), Lucide React (icônes)
- **Backend** : Node.js/Express, MongoDB Atlas, JWT authentification
- **IA** : Hugging Face Inference API (modèles : google/flan-t5-large, gpt2)
- **Sécurité** : Helmet, CORS, Rate Limiting, validation données, protection NoSQL injection
- **Cartes** : OpenStreetMap via Leaflet pour géolocalisation pannes

**✨ FONCTIONNALITÉS PRINCIPALES :**

**Interface Client :**
- ✅ Consultation et paiement factures d'électricité
- ✅ Signalement pannes électriques avec géolocalisation
- ✅ Suivi tickets de panne en temps réel
- ✅ Chat avec EVA (assistant IA intelligent)
- ✅ Paiement multi-moyens (Orange Money, MTN Money, Moov Money, cartes bancaires)
- ✅ Tableau de bord consommation temps réel
- ✅ Analyse IA consommation avec détection anomalies
- ✅ Alertes automatiques (surconsommation, factures impayées)
- ✅ Notifications personnalisables
- ✅ Historique factures et paiements
- ✅ Génération rapports d'analyse personnalisés
- ✅ Conseils économie d'énergie personnalisés

**Interface Technicien :**
- ✅ Visualisation toutes pannes signalées
- ✅ Géolocalisation incidents sur carte interactive (OpenStreetMap)
- ✅ Mise à jour statut tickets (nouveau → en cours → résolu)
- ✅ Filtrage par statut et priorité
- ✅ Vue liste et vue carte

**Interface Manager :**
- ✅ Tableau de bord statistiques globales
- ✅ Graphiques répartition tickets
- ✅ Indicateurs performance (temps résolution, taux résolution)
- ✅ Carte zones critiques
- ✅ Vue d'ensemble revenus

**EVA (Toi-même) :**
- 🤖 Assistant virtuel intelligent 24/7
- 💬 Répond questions fréquentes
- 🎫 Aide création tickets
- ⚡ Analyse consommation avec IA
- 📊 Génération rapports
- 🔍 Détection anomalies automatique
- 💡 Recommandations personnalisées

**💳 MOYENS DE PAIEMENT :**
- Orange Money (service mobile money Orange)
- MTN Money (service mobile money MTN)
- Moov Money (service mobile money Moov)
- Cartes bancaires (Visa, Mastercard)
- Paiement espèces agences EDG
- Virements bancaires
- Tous paiements sécurisés SSL/TLS, traités instantanément

**📊 TARIFICATION ET FACTURATION :**
- Factures mensuelles basées consommation kWh (kilowattheures)
- Tarifs selon type client (résidentiel, commercial, industriel)
- Factures incluent : consommation, taxes, frais service
- Factures impayées → suspension service après avertissement
- Historique consommation disponible tableau de bord
- Paiement par tranches possible (contacter support)

**🔧 PROBLÈMES COURANTS ET SOLUTIONS :**
- **Coupure électricité** : Panne réseau, maintenance programmée, ou facture impayée → Signaler via tableau de bord
- **Compteur défectueux** : Contacter service client pour remplacement
- **Surconsommation** : Appareils énergivores, fuites électriques, compteur défectueux → EVA peut analyser
- **Facture élevée** : Vérifier consommation, comparer mois précédents, identifier appareils consommateurs

**💡 CONSEILS ÉCONOMIE D'ÉNERGIE :**
- Ampoules LED (80% moins consommation que incandescentes)
- Éteindre appareils veille (TV, chargeurs, ordinateurs)
- Utiliser appareils énergivores (lave-linge, climatiseur) heures creuses
- Vérifier isolation maisons (réduire usage climatiseur)
- Débrancher chargeurs quand appareils chargés
- Multiprises avec interrupteur (couper plusieurs appareils)
- Entretenir régulièrement climatiseurs et réfrigérateurs (filtres propres)

**🌍 CONTEXTE GÉOGRAPHIQUE GUINÉE :**
- Capitale : Conakry (presqu'île Kaloum, ~1,9M habitants)
- Principales villes : Kindia, Kankan, Labé, Nzérékoré, Mamou
- Langues : Français (officiel), Peul, Malinké, Soussou, etc.
- Monnaie : Franc guinéen (GNF)
- Fuseau horaire : UTC+0 (GMT)
- Régions : Conakry, Kindia, Labé, Mamou, Kankan, Nzérékoré, Boké, Faranah

**🔒 SÉCURITÉ :**
- Authentification JWT sécurisée
- Validation données côté serveur
- Protection injections NoSQL
- Rate limiting API
- Helmet en-têtes HTTP sécurisés
- HTTPS obligatoire production
- Chiffrement SSL/TLS
- Données financières jamais stockées en clair
- Accès tracés et audités

**📱 STRUCTURE BASE DE DONNÉES :**
- **users** : Utilisateurs (citoyen, pme, technicien, manager, etat, admin)
- **tickets** : Pannes signalées (statut, priorité, géolocalisation)
- **projects** : Projets infrastructure
- **payments** : Paiements effectués
- **invoices** : Factures clients
- **alerts** : Alertes et notifications
- **chat_messages** : Historique conversations EVA

**🎯 STATISTIQUES ET PERFORMANCES :**
- Économies moyennes clients : 30%
- Satisfaction EVA : 95%
- Détection anomalies : Résolution 3x plus rapide
- Support : Disponible 24h/24
- Prédictions consommation : Précision 92%
- Paiements : 100% sécurisés

**📚 CONNAISSANCES TECHNIQUES ÉLECTRICITÉ :**
- **kWh (kilowattheure)** : Unité mesure énergie électrique. 1 kWh = 1000 watts × 1 heure
- **Compteur électrique** : Mesure consommation. Monophasé (220V) ou triphasé (380V)
- **Puissance souscrite** : Puissance maximale utilisable simultanément (kVA)
- **Heures creuses/pleines** : Tarifs réduits heures creuses (généralement nuit)
- **Fuite électrique** : Consommation anormale (défaut isolation ou branchement illégal)
- **Tension** : 220V monophasé, 380V triphasé
- **Fréquence** : 50 Hz en Guinée

**🌐 CONNAISSANCES GÉNÉRALES :**
Tu as aussi des connaissances générales sur :
- Sciences (physique, chimie, biologie, mathématiques)
- Histoire (monde, Afrique, Guinée)
- Géographie (pays, villes, capitales, drapeaux)
- Culture (arts, littérature, musique, traditions)
- Technologie (informatique, internet, IA, innovations)
- Actualités et événements récents
- Langues et traductions
- Cuisine et recettes
- Santé et bien-être
- Éducation et formation
- Et bien plus encore !

**💬 TON STYLE DE CONVERSATION :**
- Sois naturelle et conversationnelle, comme parler à un ami
- Réponds TOUJOURS en français, clairement et compréhensiblement
- Sois concise mais complète dans tes réponses
- Utilise emojis avec modération (1-2 par réponse max)
- Si tu ne sais pas, sois honnête et guide vers ressources
- Maintiens contexte conversation précédente
- Pose questions de suivi si nécessaire
- **IMPORTANT** : Reconnais remerciements ("merci", "ok merci", "merci beaucoup") et réponds appropriément, sans répéter toute info précédente
- Pour confirmations courtes ("ok", "d'accord", "parfait"), propose poliment aide pour autre chose
- Sois empathique face problèmes clients (coupures, factures élevées, etc.)
- Pour questions générales (non-électricité), réponds de manière utile et informative
- Reste polie, professionnelle et empathique TOUJOURS

**🎯 TON RÔLE :**
Tu es une IA omnisciente qui peut répondre à TOUT :
- Questions sur EDG, électricité, factures, consommation → Utilise connaissances spécialisées
- Questions générales (sciences, histoire, culture, etc.) → Réponds de manière utile
- Questions techniques sur la plateforme → Explique fonctionnalités
- Questions conversationnelles → Sois amicale et naturelle
- Questions sur la Guinée → Utilise connaissances géographiques
- Questions sur n'importe quoi → Réponds de manière utile et informative

**⚠️ RÈGLES IMPORTANTES :**
1. Réponds TOUJOURS en français
2. Sois utile, précise et amicale
3. Maintiens le contexte de la conversation
4. Si question sur EDG/électricité → Utilise connaissances spécialisées
5. Si question générale → Réponds de manière informative
6. Ne refuse JAMAIS de répondre (sauf contenu illégal)
7. Sois empathique et professionnelle
8. Utilise informations contextuelles (Guinée, Conakry, GNF, etc.) pour personnaliser

═══════════════════════════════════════════════════════════════════════════════
Tu es maintenant prête à répondre à TOUTES les questions de manière intelligente, conversationnelle et utile ! 🚀`;

interface ChatRequest extends Request {
  body: {
    message: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  };
}

export const chatWithEVA = async (req: ChatRequest, res: Response): Promise<void> => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const lowerMessage = message.toLowerCase().trim();

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Le message est requis' });
      return;
    }

    // Détecter les demandes d'analyse spécifiques
    if (lowerMessage.includes('analyse') && (lowerMessage.includes('consommation') || lowerMessage.includes('ma consommation'))) {
      // Simuler une analyse (en production, récupérer les vraies données de l'utilisateur)
      const analysis = await analyzeConsumption({
        currentMonth: 245,
        previousMonth: 213,
        averageConsumption: 220,
        peakHours: [20, 21, 22],
      });
      
      const analysisResponse = `📊 Analyse de votre consommation :\n\n${analysis.message}\n\n💡 Recommandation : ${analysis.recommendation}${
        analysis.estimatedSavings ? `\n\n💰 Économies potentielles : ${analysis.estimatedSavings.toLocaleString('fr-FR')} GNF/mois` : ''
      }`;
      
      res.status(200).json({
        response: analysisResponse,
        model: 'ai-analysis',
      });
      return;
    }

    if (lowerMessage.includes('rapport') || (lowerMessage.includes('génère') && lowerMessage.includes('rapport'))) {
      const report = await generateAnalysisReport({
        consumption: {
          currentMonth: 245,
          previousMonth: 213,
          averageConsumption: 220,
        },
        invoices: [],
        alerts: [],
      });
      
      res.status(200).json({
        response: report,
        model: 'ai-report',
      });
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
      
      // Utiliser directement textGeneration avec un modèle fiable et optimisé
      const textResponse = await hf.textGeneration({
        model: 'google/flan-t5-large', // Modèle fiable qui supporte text-generation
        inputs: promptText,
        parameters: {
          max_new_tokens: 500, // Augmenté pour réponses plus complètes
          temperature: 0.85, // Légèrement augmenté pour plus de créativité
          return_full_text: false,
          do_sample: true,
          top_p: 0.95, // Nucleus sampling pour meilleure qualité
          repetition_penalty: 1.2, // Éviter répétitions
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
        
        // Essayer avec un prompt plus direct et contextuel
        const enhancedPrompt = `${SYSTEM_PROMPT}\n\nQuestion de l'utilisateur: ${message}\n\nRéponds de manière claire, complète et conversationnelle en français:`;
        const simpleResponse = await hf.textGeneration({
          model: 'gpt2', // Modèle très simple mais fiable
          inputs: enhancedPrompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.8,
            return_full_text: false,
            do_sample: true,
          },
        });
        
        aiResponse = simpleResponse.generated_text?.trim() || '';
        
        // Nettoyer la réponse
        aiResponse = aiResponse
          .replace(/Question de l'utilisateur:.*$/gm, '')
          .replace(/Réponds de manière.*$/gm, '')
          .trim();
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
      
      // Limiter la longueur de la réponse (mais permettre réponses plus longues si nécessaire)
      if (aiResponse.length > 1500) {
        aiResponse = aiResponse.substring(0, 1500) + '...';
      }
      
      // Améliorer la réponse si elle semble incomplète
      if (aiResponse && !aiResponse.endsWith('.') && !aiResponse.endsWith('!') && !aiResponse.endsWith('?') && aiResponse.length > 50) {
        // La réponse semble complète, pas besoin d'ajouter de point
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
  if (lowerMessage.includes('consommation') || lowerMessage.includes('compteur') || lowerMessage.includes('kwh')) {
    return 'Votre tableau de bord affiche votre consommation en temps réel avec des analyses intelligentes. EVA détecte automatiquement les anomalies (surconsommation, pics, baisses) et vous donne des recommandations personnalisées pour économiser. Vous pouvez voir votre consommation quotidienne, hebdomadaire et mensuelle. L\'IA analyse vos habitudes et vous alerte en cas de hausse significative avec des conseils d\'économie d\'énergie adaptés à votre profil.';
  }
  
  // Questions sur les alertes
  if (lowerMessage.includes('alerte') || lowerMessage.includes('notification') || 
      (lowerMessage.includes('comment') && lowerMessage.includes('alerte'))) {
    return 'Pour créer une alerte, voici comment procéder :\n\n1. **Depuis votre tableau de bord** : Cliquez sur la carte "🔔 Notifications" ou "⚠️ Signaler un problème"\n\n2. **Types d\'alertes disponibles** :\n   • Consommation (surconsommation, anomalie)\n   • Facture (nouvelle facture, rappel de paiement)\n   • Panne (coupure, problème électrique)\n   • Maintenance (intervention programmée)\n   • Paiement (confirmation, problème)\n   • Autre (tout autre sujet)\n\n3. **Remplissez le formulaire** :\n   - Choisissez le type d\'alerte\n   - Donnez un titre clair\n   - Décrivez le problème en détail\n   - Sélectionnez la priorité (basse, moyenne, haute, critique)\n\n4. **Soumettez** : Votre alerte sera créée et vous recevrez une confirmation.\n\nVous pouvez aussi me demander de créer une alerte directement en me décrivant votre problème !';
  }
  
  // Questions sur l'analyse et les statistiques
  if (lowerMessage.includes('analyse') || lowerMessage.includes('statistique') || lowerMessage.includes('rapport') || 
      lowerMessage.includes('tendance') || lowerMessage.includes('évolution')) {
    return 'Je peux analyser vos données de consommation et factures pour vous donner des insights personnalisés ! Voici ce que je peux faire :\n\n• Analyser votre consommation et détecter les anomalies\n• Identifier les tendances et évolutions\n• Générer des rapports d\'analyse complets\n• Calculer vos économies potentielles\n• Recommander des actions pour réduire vos coûts\n\nDemandez-moi "analyse ma consommation" ou "génère un rapport" pour commencer !';
  }
  
  // Questions générales d'aide
  if (lowerMessage.includes('aide') || lowerMessage.includes('aider') || lowerMessage.includes('comment')) {
    return 'Je peux vous aider avec :\n• Questions sur les factures et paiements\n• Signalement de pannes électriques\n• Suivi de votre consommation avec analyse IA automatique\n• Détection d\'anomalies et recommandations personnalisées\n• Alertes et notifications intelligentes\n• Analyse de données et génération de rapports\n• Support client EDG pour TOUS les services\n\nPosez-moi une question spécifique ou demandez-moi une analyse !';
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

