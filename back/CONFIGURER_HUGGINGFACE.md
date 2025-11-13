# 🚀 Guide Rapide : Configurer Hugging Face pour EVA

## 📝 Étapes Simples (5 minutes)

### Étape 1 : Créer un compte Hugging Face (GRATUIT)

1. Allez sur **https://huggingface.co/**
2. Cliquez sur **"Sign Up"** (Inscription)
3. Créez votre compte (c'est gratuit, pas besoin de carte bancaire)
4. Vérifiez votre email si nécessaire

### Étape 2 : Créer un Token d'Accès

1. Une fois connecté, cliquez sur votre **avatar** en haut à droite
2. Allez dans **"Settings"** (Paramètres)
3. Dans le menu de gauche, cliquez sur **"Access Tokens"**
4. Cliquez sur **"New token"** (Nouveau token)
5. Donnez-lui un nom (ex: "EVA-GSE")
6. Sélectionnez **"Read"** (Lecture seule - suffisant)
7. Cliquez sur **"Generate a token"**
8. **⚠️ IMPORTANT** : Copiez le token immédiatement (il commence par `hf_`). Vous ne pourrez plus le voir après !

### Étape 3 : Ajouter le Token dans votre Projet

1. Ouvrez le fichier `back/.env` dans votre éditeur
2. Ajoutez ces lignes (ou modifiez si elles existent déjà) :

```env
# Hugging Face Configuration (GRATUIT)
HUGGINGFACE_API_KEY=hf_votre-token-ici
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

3. Remplacez `hf_votre-token-ici` par le token que vous avez copié
4. Sauvegardez le fichier

### Étape 4 : Redémarrer le Serveur

1. Arrêtez le serveur backend (Ctrl+C dans le terminal)
2. Redémarrez-le :

```bash
cd back
npm run dev
```

### Étape 5 : Tester EVA

1. Allez sur la page FAQ de votre application
2. Cliquez sur le bouton EVA (icône de chat en bas à droite)
3. Posez une question comme "Bonjour, comment ça marche ?"
4. Vous devriez voir une réponse générée par l'IA au lieu du mode fallback !

## ✅ Vérification

Si tout fonctionne, dans les logs du serveur backend, vous verrez :
- ✅ Pas d'erreur "fallback"
- ✅ Le modèle utilisé sera `mistralai/Mistral-7B-Instruct-v0.2` ou celui que vous avez configuré

## 🔧 Modèles Disponibles (Gratuits)

Vous pouvez changer le modèle dans `.env` pour une conversation plus naturelle :

### Modèles Recommandés pour Conversations (comme ChatGPT) :

- **`mistralai/Mistral-7B-Instruct-v0.2`** ⭐ (par défaut, excellent en français, très conversationnel)
- **`mistralai/Mixtral-8x7B-Instruct-v0.1`** (plus puissant, meilleur contexte)
- **`meta-llama/Llama-2-7b-chat-hf`** (très performant, optimisé pour chat)
- **`meta-llama/Llama-2-13b-chat-hf`** (plus de contexte, meilleures réponses)
- **`google/flan-t5-large`** (rapide mais moins conversationnel)
- **`microsoft/DialoGPT-large`** (spécialisé conversation mais plus ancien)

### Pour une expérience ChatGPT-like :

Utilisez **Mistral-7B-Instruct** ou **Llama-2-7b-chat-hf** pour des conversations naturelles et contextuelles.

**Note :** Les modèles plus grands (13B, Mixtral) offrent de meilleures réponses mais peuvent être plus lents.

## ❓ Problèmes Courants

### "Token invalide"
- Vérifiez que vous avez bien copié tout le token (il commence par `hf_`)
- Vérifiez qu'il n'y a pas d'espaces avant/après dans le `.env`

### "Rate limit"
- Sans token : ~30 requêtes/heure
- Avec token : ~1000 requêtes/jour
- Attendez quelques minutes et réessayez

### "Model not found"
- Le modèle que vous avez choisi n'est peut-être pas disponible
- Utilisez `mistralai/Mistral-7B-Instruct-v0.2` qui est très fiable

## 🎉 C'est Tout !

Une fois configuré, EVA utilisera la vraie IA pour répondre à toutes les questions !

