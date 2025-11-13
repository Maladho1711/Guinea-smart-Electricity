# Configuration d'EVA avec Hugging Face (GRATUIT) 🎉

## 🎁 Gratuit et Sans Limite (presque)

EVA utilise maintenant **Hugging Face Inference API** qui est **100% GRATUIT** !

## 📋 Configuration (Optionnelle mais Recommandée)

### Option 1 : Sans Configuration (Fonctionne Déjà !)

EVA fonctionne **immédiatement** sans aucune configuration ! Hugging Face permet des requêtes sans authentification.

### Option 2 : Avec Token (Recommandé pour Plus de Requêtes)

Pour augmenter la limite de requêtes par jour :

1. Créez un compte gratuit sur https://huggingface.co/
2. Allez dans Settings > Access Tokens
3. Créez un nouveau token (lecture seule suffit)
4. Ajoutez-le dans `back/.env` :

```env
# Hugging Face Configuration (GRATUIT)
HUGGINGFACE_API_KEY=hf_votre-token-ici
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

**Modèles gratuits disponibles :**
- `mistralai/Mistral-7B-Instruct-v0.2` (recommandé, excellent en français)
- `meta-llama/Llama-2-7b-chat-hf` (très performant)
- `google/flan-t5-large` (rapide et efficace)
- `microsoft/DialoGPT-large` (spécialisé conversation)

### 3. Redémarrer le serveur backend

```bash
cd back
npm run dev
```

## 💰 Coûts

**ZÉRO COÛT !** 🎉 Hugging Face Inference API est complètement gratuit.

- Sans token : ~30 requêtes/heure (suffisant pour la plupart des cas)
- Avec token gratuit : ~1000 requêtes/jour (plus que suffisant)

## 🔒 Sécurité

Le token Hugging Face est optionnel et peut être partagé (lecture seule). Mais par sécurité, gardez-le dans `.env` qui est déjà dans `.gitignore`.

## 🚀 Mode Fallback Intelligent

Si l'API Hugging Face rencontre un problème, EVA utilise automatiquement un mode "fallback intelligent" basé sur des règles, qui fonctionne toujours.

## 📝 Test

1. **Sans configuration** : Testez EVA directement, ça fonctionne !
2. **Avec token** : Ajoutez votre token pour plus de requêtes

## 🌟 Avantages de Hugging Face

✅ **100% Gratuit**
✅ **Pas besoin de carte bancaire**
✅ **Fonctionne immédiatement**
✅ **Modèles open-source**
✅ **Pas de limite de temps**
✅ **Excellent support du français**

