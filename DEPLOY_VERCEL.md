# 🚀 Déploiement sur Vercel - Guide Rapide

## 📦 Déploiement du Frontend (Recommandé)

### Méthode 1 : Via l'interface Vercel (Le plus simple)

1. **Allez sur [vercel.com](https://vercel.com)** et connectez-vous avec GitHub

2. **Cliquez sur "Add New Project"**

3. **Importez votre dépôt** :
   - Sélectionnez `Maladho1711/Guinea-smart-Electricity`
   - Cliquez sur "Import"

4. **Configurez le projet** :
   - **Root Directory** : `project` ⚠️ IMPORTANT
   - **Framework Preset** : Vite (détecté automatiquement)
   - **Build Command** : `npm run build` (automatique)
   - **Output Directory** : `dist` (automatique)
   - **Install Command** : `npm install` (automatique)

5. **Ajoutez les variables d'environnement** :
   - Cliquez sur "Environment Variables"
   - Ajoutez :
     ```
     VITE_API_URL = https://votre-backend-url.railway.app
     ```
     (Vous ajouterez l'URL du backend après l'avoir déployé)

6. **Cliquez sur "Deploy"** 🎉

Votre frontend sera déployé en quelques minutes !

## 🖥️ Déploiement du Backend

### Option recommandée : Railway (Gratuit et simple)

1. **Allez sur [railway.app](https://railway.app)** et connectez-vous avec GitHub

2. **Créez un nouveau projet** :
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez `Guinea-smart-Electricity`

3. **Configurez le service** :
   - Cliquez sur "Add Service" → "GitHub Repo"
   - Sélectionnez votre dépôt
   - Dans les settings :
     - **Root Directory** : `back`
     - **Start Command** : `npm run dev` (ou `npm start` en production)

4. **Ajoutez les variables d'environnement** :
   - Cliquez sur "Variables"
   - Ajoutez toutes les variables de `back/.env` :
     ```
     MONGODB_URI = mongodb+srv://...
     JWT_SECRET = votre_secret
     PORT = 3000
     NODE_ENV = production
     FRONTEND_URL = https://votre-frontend.vercel.app
     HUGGINGFACE_API_KEY = votre_cle
     HUGGINGFACE_MODEL = google/flan-t5-large
     ```

5. **Déployez** : Railway déploie automatiquement !

6. **Récupérez l'URL** : Railway vous donne une URL comme `https://votre-projet.railway.app`

## 🔗 Lier Frontend et Backend

1. **Dans Vercel** (Frontend) :
   - Allez dans Settings → Environment Variables
   - Mettez à jour `VITE_API_URL` avec l'URL Railway de votre backend
   - Redéployez

2. **Dans Railway** (Backend) :
   - Mettez à jour `FRONTEND_URL` avec l'URL Vercel de votre frontend
   - Redéployez

## ✅ Vérification

- Frontend : `https://votre-projet.vercel.app`
- Backend : `https://votre-projet.railway.app`

## 🔧 Alternative : Render.com

Si Railway ne fonctionne pas, utilisez [Render.com](https://render.com) :

1. Créez un nouveau "Web Service"
2. Connectez votre dépôt GitHub
3. Configuration :
   - **Root Directory** : `back`
   - **Build Command** : `npm install`
   - **Start Command** : `npm run dev`
4. Ajoutez les variables d'environnement
5. Déployez

## 📝 Notes importantes

- ⚠️ **MongoDB Atlas** : Autorisez toutes les IPs (`0.0.0.0/0`) dans Network Access pour que les services cloud puissent se connecter
- ⚠️ **CORS** : Le backend est déjà configuré pour accepter les requêtes depuis votre frontend Vercel
- ⚠️ **Variables d'environnement** : Ne commitez JAMAIS vos fichiers `.env` (déjà dans `.gitignore`)

## 🎉 C'est tout !

Votre application sera en ligne en quelques minutes !

