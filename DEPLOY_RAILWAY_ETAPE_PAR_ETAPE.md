# 🚂 Déploiement Backend sur Railway - Guide Étape par Étape

## 🎯 Objectif

Déployer le backend (`back/`) sur Railway pour que l'application soit complète.

## 📋 Prérequis

- ✅ Compte GitHub (déjà créé)
- ✅ Compte Railway (à créer si nécessaire)
- ✅ MongoDB Atlas configuré (déjà fait ✅)

## 🚀 Étapes Détaillées

### Étape 1 : Créer un Compte Railway

1. Allez sur **[railway.app](https://railway.app)**
2. Cliquez sur **"Start a New Project"** ou **"Login"**
3. Choisissez **"Login with GitHub"**
4. Autorisez Railway à accéder à votre compte GitHub

### Étape 2 : Créer un Nouveau Projet

1. Dans Railway, cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Dans la liste, trouvez : **`Guinea-smart-Electricity`**
4. Cliquez dessus pour le sélectionner
5. Railway va commencer à détecter automatiquement

### Étape 3 : Configurer le Root Directory (CRITIQUE)

**⚠️ IMPORTANT** : Railway doit pointer vers le dossier `back/`

1. Une fois le repo importé, Railway va créer un service
2. Cliquez sur le service créé
3. Allez dans **"Settings"** (en haut à droite)
4. Trouvez **"Root Directory"** ou **"Source"**
5. Cliquez sur **"Change"** ou **"Edit"**
6. **Tapez** : `/back` (avec le slash au début)
7. Cliquez **"Save"** ou **"Update"**

### Étape 4 : Vérifier la Configuration Auto

Railway devrait auto-détecter :
- **Build Command** : `npm install && npm run build` (ou laissez vide pour auto)
- **Start Command** : `npm start` (doit être configuré)

Si ce n'est pas le cas :
- **Settings** → **Deploy**
- **Start Command** : `npm start`
- **Build Command** : Laissez vide (Railway auto-détectera)

### Étape 5 : Configurer les Variables d'Environnement

1. Dans Railway, cliquez sur votre service
2. Allez dans l'onglet **"Variables"** (ou **"Environment Variables"**)
3. Cliquez sur **"New Variable"** ou **"Add Variable"**

#### Ajoutez ces variables une par une :

**1. NODE_ENV**
```
Key: NODE_ENV
Value: production
```

**2. PORT**
```
Key: PORT
Value: 3000
```

**3. MONGODB_URI**
```
Key: MONGODB_URI
Value: mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
```

**4. JWT_SECRET**
```
Key: JWT_SECRET
Value: votre_secret_jwt_super_securise_changez_moi_en_production
```
⚠️ **Générez un secret fort** (voir ci-dessous)

**5. FRONTEND_URL**
```
Key: FRONTEND_URL
Value: https://guinea-smart-electricity.vercel.app
```

**6. HUGGINGFACE_API_KEY** (Optionnel mais recommandé)
```
Key: HUGGINGFACE_API_KEY
Value: (laissez vide si vous n'avez pas de token)
```

**7. HUGGINGFACE_MODEL** (Optionnel)
```
Key: HUGGINGFACE_MODEL
Value: google/flan-t5-large
```

### Étape 6 : Générer un JWT_SECRET Sécurisé

**Sur Windows (PowerShell)** :
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Sur Linux/Mac** :
```bash
openssl rand -base64 32
```

Copiez le résultat et utilisez-le comme valeur pour `JWT_SECRET`.

### Étape 7 : Déployer

1. Railway va automatiquement détecter les changements
2. Le déploiement va commencer automatiquement
3. Allez dans l'onglet **"Deployments"** pour voir le progrès
4. Attendez 2-3 minutes

### Étape 8 : Obtenir l'URL du Backend

1. Une fois déployé, allez dans **"Settings"** → **"Networking"**
2. Cliquez sur **"Generate Domain"** ou **"Public Domain"**
3. Railway génère une URL automatique
4. **Copiez l'URL** : `https://votre-backend.up.railway.app`

### Étape 9 : Tester le Backend

Testez l'endpoint de santé :
```
https://votre-backend.up.railway.app/api/health
```

Vous devriez voir :
```json
{
  "status": "Backend running successfully",
  "timestamp": "..."
}
```

### Étape 10 : Connecter Frontend et Backend

1. Allez sur **Vercel Dashboard**
2. Votre projet → **Settings** → **Environment Variables**
3. Trouvez `VITE_API_URL`
4. Cliquez **Edit**
5. Changez la valeur en : `https://votre-backend.up.railway.app`
6. **Save**
7. Allez dans **Deployments** → **Redeploy**

## ✅ Checklist de Déploiement

- [ ] Compte Railway créé
- [ ] Projet Railway créé et connecté à GitHub
- [ ] Root Directory = `/back` configuré
- [ ] Start Command = `npm start`
- [ ] Variables d'environnement ajoutées (toutes les 7)
- [ ] JWT_SECRET généré et ajouté
- [ ] Déploiement réussi
- [ ] URL Railway obtenue
- [ ] Test `/api/health` fonctionne
- [ ] `VITE_API_URL` mis à jour dans Vercel
- [ ] Frontend redéployé sur Vercel

## 🐛 Dépannage

### Erreur "Error creating build plan"

- ✅ **Déjà corrigé** : Le fichier `railway.json` a été supprimé
- Vérifiez que Root Directory = `/back`
- Laissez Build Command vide (auto-détection)

### Erreur de connexion MongoDB

1. Vérifiez que `MONGODB_URI` est correct
2. Vérifiez que MongoDB Atlas autorise les connexions depuis n'importe quelle IP (0.0.0.0/0)
3. Vérifiez le mot de passe dans l'URI

### Erreur CORS

1. Vérifiez que `FRONTEND_URL` = URL Vercel exacte
2. Vérifiez la configuration CORS dans `back/src/app.ts`

### Le backend ne démarre pas

1. Vérifiez les **Logs** dans Railway
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que `MONGODB_URI` est correct

## 🎉 Résultat Final

Une fois tout configuré :
- ✅ Backend déployé sur Railway
- ✅ Frontend connecté au backend
- ✅ Authentification fonctionnelle
- ✅ EVA (IA) fonctionnelle
- ✅ Application complète et opérationnelle !

---

**Temps estimé** : 10-15 minutes

