# Guide de Déploiement Backend sur Railway

## 🚂 Déploiement du Backend sur Railway

Railway est une plateforme de déploiement simple et gratuite pour les backends Node.js.

### 📋 Prérequis

1. Un compte GitHub (déjà créé ✅)
2. Un compte Railway (gratuit) : [railway.app](https://railway.app)
3. MongoDB Atlas (déjà configuré ✅)

### 🚀 Étapes de Déploiement

#### 1. Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **"Start a New Project"**
3. Connectez-vous avec GitHub
4. Autorisez Railway à accéder à votre compte GitHub

#### 2. Créer un Nouveau Projet

1. Dans Railway, cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez votre repository : `Guinea-smart-Electricity`
4. Railway détectera automatiquement le dossier `back/`

#### 3. Configurer le Dossier Source

1. Dans les **Settings** du projet Railway :
   - **Root Directory** : `/back`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`

#### 4. Configurer les Variables d'Environnement

Dans Railway, allez dans **Variables** et ajoutez :

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
FRONTEND_URL=https://guinea-smart-electricity.vercel.app
HUGGINGFACE_API_KEY=votre_cle_huggingface
HUGGINGFACE_MODEL=google/flan-t5-large
```

**⚠️ Important :**
- Remplacez `JWT_SECRET` par une chaîne aléatoire sécurisée
- Remplacez `HUGGINGFACE_API_KEY` par votre vraie clé API Hugging Face
- Le `MONGODB_URI` doit inclure le nom de la base de données si nécessaire

#### 5. Déployer

1. Railway va automatiquement détecter les changements
2. Le build va commencer automatiquement
3. Attendez que le déploiement soit terminé (2-3 minutes)

#### 6. Obtenir l'URL du Backend

1. Une fois déployé, Railway génère une URL automatique
2. Allez dans **Settings** → **Networking**
3. Cliquez sur **"Generate Domain"**
4. Copiez l'URL (ex: `guinea-smart-electricity-backend.up.railway.app`)

#### 7. Mettre à Jour le Frontend

1. Allez sur Vercel → Votre projet → **Settings** → **Environment Variables**
2. Ajoutez/modifiez :
   ```
   VITE_API_URL=https://votre-backend-railway.up.railway.app
   ```
3. Redéployez le frontend sur Vercel (push sur GitHub ou redéploiement manuel)

### 🔧 Configuration Avancée

#### Ajouter un Domaine Personnalisé (Optionnel)

1. Dans Railway → **Settings** → **Networking**
2. Cliquez sur **"Custom Domain"**
3. Ajoutez votre domaine (ex: `api.votredomaine.com`)
4. Configurez les DNS selon les instructions Railway

#### Monitoring et Logs

- **Logs** : Disponibles dans Railway → Votre service → **Deployments** → Cliquez sur un déploiement
- **Metrics** : Railway affiche automatiquement CPU, RAM, etc.

### 🐛 Dépannage

#### Le backend ne démarre pas

1. Vérifiez les logs dans Railway
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que `MONGODB_URI` est correct

#### Erreur de connexion MongoDB

1. Vérifiez que MongoDB Atlas autorise les connexions depuis n'importe quelle IP (0.0.0.0/0)
2. Vérifiez que le mot de passe dans `MONGODB_URI` est correct

#### Erreur CORS

1. Vérifiez que `FRONTEND_URL` dans Railway correspond à l'URL Vercel
2. Vérifiez la configuration CORS dans `back/src/app.ts`

### 📊 Plan Gratuit Railway

- **500 heures/mois** gratuites
- **$5 de crédit** par mois
- Parfait pour les projets de démonstration

### 🔄 Mises à Jour Automatiques

Railway redéploie automatiquement à chaque push sur la branche `main` dans le dossier `back/`.

### ✅ Checklist de Déploiement

- [ ] Compte Railway créé
- [ ] Projet Railway créé et connecté à GitHub
- [ ] Dossier source configuré (`/back`)
- [ ] Variables d'environnement configurées
- [ ] Backend déployé avec succès
- [ ] URL backend obtenue
- [ ] `VITE_API_URL` mis à jour dans Vercel
- [ ] Frontend redéployé sur Vercel
- [ ] Test de connexion frontend → backend réussi

### 🎉 C'est Fait !

Votre backend est maintenant déployé sur Railway et accessible publiquement !

