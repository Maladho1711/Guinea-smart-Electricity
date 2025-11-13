# 🔧 Corriger l'Erreur Railway - "Error creating build plan"

## ⚠️ Problème

Railway affiche : `Error creating build plan with Nixpacks`

## ✅ Solution

### Option 1 : Supprimer railway.json (Recommandé)

Railway peut auto-détecter la configuration. Le fichier `railway.json` peut causer des conflits.

**Action** : Le fichier `back/railway.json` a été supprimé. Railway utilisera l'auto-détection.

### Option 2 : Configurer Manuellement dans Railway

1. **Allez sur [railway.app](https://railway.app)**
2. **Ouvrez votre projet**
3. **Settings** → **Service**

#### Configuration Requise :

1. **Root Directory** :
   - Cliquez sur **"Change Source"** ou **"Settings"**
   - **Root Directory** : `/back`
   - ⚠️ **IMPORTANT** : Doit être `/back` (avec le slash)

2. **Build Command** :
   - Laissez vide (Railway auto-détectera)
   - OU spécifiez : `npm install && npm run build`

3. **Start Command** :
   - `npm start`

### Option 3 : Créer un fichier nixpacks.toml (Alternative)

Si Railway a toujours des problèmes, créez `back/nixpacks.toml` :

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

## 🔧 Configuration dans Railway Dashboard

### 1. Variables d'Environnement

Dans Railway → **Variables**, ajoutez :

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
FRONTEND_URL=https://votre-url-vercel.vercel.app
HUGGINGFACE_API_KEY=votre_cle_huggingface
HUGGINGFACE_MODEL=google/flan-t5-large
```

### 2. Root Directory

**Settings** → **Service** → **Root Directory** : `/back`

### 3. Redéployer

1. **Deployments** → Cliquez sur le dernier déploiement
2. **Redeploy** ou supprimez et recréez le service

## 🐛 Dépannage

### Si l'erreur persiste :

1. **Supprimez le service Railway**
2. **Recréez-le** :
   - New Service → GitHub Repo
   - Sélectionnez `Guinea-smart-Electricity`
   - **Root Directory** : `/back`
   - Railway auto-détectera Node.js

3. **Configurez les variables d'environnement**
4. **Déployez**

### Vérifier les Logs

1. **Deployments** → Cliquez sur un déploiement
2. **View Logs**
3. Cherchez les erreurs spécifiques

## ✅ Checklist

- [ ] `railway.json` supprimé (fait ✅)
- [ ] Root Directory = `/back` dans Railway
- [ ] Variables d'environnement configurées
- [ ] Build Command laissé vide ou `npm install && npm run build`
- [ ] Start Command = `npm start`
- [ ] Redéploiement effectué

## 📝 Note

Railway utilise Nixpacks pour auto-détecter la configuration. En supprimant `railway.json`, Railway devrait mieux détecter votre projet Node.js/TypeScript.

