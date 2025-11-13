# 🚀 Guide Complet de Déploiement - Vercel + Railway

## 📋 Vue d'Ensemble

Ce guide vous aide à déployer :
- **Frontend** → Vercel
- **Backend** → Railway

## 🎯 Partie 1 : Déployer le Frontend sur Vercel

### Étape 1 : Créer le Projet Vercel

1. Allez sur **[vercel.com](https://vercel.com)**
2. **Add New Project**
3. Sélectionnez : `Maladho1711/Guinea-smart-Electricity`
4. Cliquez **Import**

### Étape 2 : Configuration (CRITIQUE)

**AVANT de cliquer "Deploy", configurez :**

- **Root Directory** : `project` ⚠️ **LE PLUS IMPORTANT**
- **Framework Preset** : `Vite`
- **Build Command** : `npm install --legacy-peer-deps && npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install --legacy-peer-deps`

### Étape 3 : Déployer

1. Cliquez **Deploy**
2. Attendez 2-3 minutes
3. Notez l'URL : `https://votre-projet.vercel.app`

## 🎯 Partie 2 : Déployer le Backend sur Railway

### Étape 1 : Créer le Projet Railway

1. Allez sur **[railway.app](https://railway.app)**
2. **New Project**
3. **Deploy from GitHub repo**
4. Sélectionnez : `Guinea-smart-Electricity`

### Étape 2 : Configuration

1. **Settings** → **Service**
2. **Root Directory** : `/back` ⚠️ **IMPORTANT**
3. **Build Command** : Laissez vide (auto-détection)
4. **Start Command** : `npm start`

### Étape 3 : Variables d'Environnement

Dans **Variables**, ajoutez :

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
FRONTEND_URL=https://votre-projet-vercel.vercel.app
HUGGINGFACE_API_KEY=votre_cle_huggingface
HUGGINGFACE_MODEL=google/flan-t5-large
```

### Étape 4 : Obtenir l'URL Railway

1. **Settings** → **Networking**
2. **Generate Domain**
3. Copiez l'URL : `https://votre-backend.up.railway.app`

## 🎯 Partie 3 : Connecter Frontend et Backend

### Étape 1 : Mettre à Jour Vercel

1. Vercel Dashboard → Votre projet
2. **Settings** → **Environment Variables**
3. Ajoutez :
   ```
   VITE_API_URL=https://votre-backend.up.railway.app
   ```
4. **Redeploy**

### Étape 2 : Mettre à Jour Railway

1. Railway → **Variables**
2. Modifiez `FRONTEND_URL` :
   ```
   FRONTEND_URL=https://votre-projet-vercel.vercel.app
   ```
3. Railway redéploiera automatiquement

## ✅ Vérification Finale

### Frontend (Vercel)
- ✅ `https://votre-projet.vercel.app/` → Page d'accueil
- ✅ `https://votre-projet.vercel.app/faq` → FAQ

### Backend (Railway)
- ✅ `https://votre-backend.up.railway.app/api/health` → `{"status":"Backend running successfully"}`

### Connexion
- ✅ Frontend peut communiquer avec le backend
- ✅ Authentification fonctionne
- ✅ EVA (IA) fonctionne

## 🐛 Problèmes Courants

### Vercel : Erreur 404
- **Solution** : Vérifiez Root Directory = `project`

### Railway : Erreur Build Plan
- **Solution** : Vérifiez Root Directory = `/back`
- Le fichier `railway.json` a été supprimé (causait des problèmes)

### CORS Error
- **Solution** : Vérifiez `FRONTEND_URL` dans Railway = URL Vercel exacte

## 📚 Guides Détaillés

- `RECREER_VERCEL.md` - Guide complet Vercel
- `CORRIGER_RAILWAY.md` - Guide complet Railway
- `DEPLOY_VERCEL.md` - Documentation Vercel
- `DEPLOY_RAILWAY.md` - Documentation Railway

## 🎉 C'est Fait !

Votre application est maintenant déployée et fonctionnelle !

