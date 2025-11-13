# Guide de déploiement sur Vercel

## 🚀 Déploiement du Frontend sur Vercel

Vercel est parfait pour déployer votre application React. Voici comment procéder :

### Option 1 : Déploiement via l'interface Vercel (Recommandé)

1. **Installer Vercel CLI** (optionnel, mais recommandé)
   ```bash
   npm install -g vercel
   ```

2. **Se connecter à Vercel**
   ```bash
   vercel login
   ```

3. **Déployer depuis le dossier project**
   ```bash
   cd project
   vercel
   ```

4. **Suivre les instructions** :
   - Sélectionner le projet
   - Confirmer les paramètres
   - Ajouter les variables d'environnement

### Option 2 : Déploiement via GitHub (Automatique)

1. **Connecter votre dépôt GitHub à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre dépôt GitHub `Guinea-smart-Electricity`
   - Configurez :
     - **Root Directory** : `project`
     - **Framework Preset** : Vite
     - **Build Command** : `npm run build`
     - **Output Directory** : `dist`
     - **Install Command** : `npm install`

2. **Ajouter les variables d'environnement** :
   - `VITE_API_URL` : URL de votre backend (voir ci-dessous)

3. **Déployer** : Cliquez sur "Deploy"

## 🔧 Configuration des Variables d'Environnement

Dans Vercel, ajoutez ces variables d'environnement :

```
VITE_API_URL=https://votre-backend-url.vercel.app
```

## 🖥️ Déploiement du Backend

Le backend Node.js/Express peut être déployé de plusieurs façons :

### Option A : Vercel Serverless Functions (Recommandé pour Vercel)

Le backend doit être adapté pour utiliser les fonctions serverless de Vercel.

### Option B : Services séparés (Recommandé pour production)

Déployez le backend sur un service dédié :

#### 1. **Railway** (Gratuit avec limitations)
   - Allez sur [railway.app](https://railway.app)
   - Créez un nouveau projet
   - Connectez votre dépôt GitHub
   - Sélectionnez le dossier `back`
   - Ajoutez les variables d'environnement
   - Déployez

#### 2. **Render** (Gratuit avec limitations)
   - Allez sur [render.com](https://render.com)
   - Créez un nouveau "Web Service"
   - Connectez votre dépôt GitHub
   - Configuration :
     - **Root Directory** : `back`
     - **Build Command** : `npm install`
     - **Start Command** : `npm run dev` ou `npm start`
   - Ajoutez les variables d'environnement
   - Déployez

#### 3. **Heroku** (Payant après période d'essai)
   - Similaire à Render

### Configuration Backend pour Vercel

Si vous voulez déployer le backend sur Vercel, créez `back/vercel.json` :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

Et adaptez `back/src/server.ts` pour Vercel :

```typescript
// À la fin de server.ts, au lieu de app.listen()
export default app; // Pour Vercel
// OU garder app.listen() pour les autres services
```

## 📝 Variables d'Environnement à Configurer

### Frontend (Vercel)
- `VITE_API_URL` : URL de votre backend déployé

### Backend (Railway/Render/Heroku)
- `MONGODB_URI` : Votre URI MongoDB Atlas
- `JWT_SECRET` : Votre secret JWT
- `PORT` : Port (généralement géré automatiquement)
- `NODE_ENV` : `production`
- `FRONTEND_URL` : URL de votre frontend Vercel
- `HUGGINGFACE_API_KEY` : Votre clé API Hugging Face
- `HUGGINGFACE_MODEL` : `google/flan-t5-large`

## 🔗 Lier Frontend et Backend

Une fois les deux déployés :

1. **Mettre à jour `VITE_API_URL`** dans Vercel avec l'URL de votre backend
2. **Mettre à jour `FRONTEND_URL`** dans votre backend avec l'URL de votre frontend Vercel
3. **Redéployer** les deux services

## ✅ Vérification

Après le déploiement :
- Frontend accessible sur : `https://votre-projet.vercel.app`
- Backend accessible sur : `https://votre-backend.railway.app` (ou autre)

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL Vercel
- Vérifiez la configuration CORS dans `back/src/app.ts`

### Erreur de connexion API
- Vérifiez que `VITE_API_URL` est correctement configuré dans Vercel
- Vérifiez que le backend est bien démarré et accessible

### Erreur MongoDB
- Vérifiez que votre IP est autorisée dans MongoDB Atlas
- Pour les services cloud, autorisez `0.0.0.0/0` (toutes les IPs) dans MongoDB Atlas Network Access

