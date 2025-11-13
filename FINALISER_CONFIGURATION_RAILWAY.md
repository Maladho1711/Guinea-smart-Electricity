# ✅ Finaliser la Configuration Railway

## 🎯 Configuration Actuelle

✅ **Root Directory** : `/back` (déjà configuré !)

## ⚠️ Action Requise : Start Command

### Étape 1 : Configurer Start Command

1. **Trouvez la section "Deploy"** dans Settings
2. **Trouvez "Custom Start Command"** ou "Start Command"
3. **Dans le champ "Start Command"**, tapez : `npm start`
4. **Sauvegardez** (cliquez sur Save ou le bouton de sauvegarde)

### Étape 2 : Build Command (Optionnel)

- **Laissez "Build Command" VIDE** (Railway auto-détectera)
- OU si vous voulez spécifier : `npm install && npm run build`

## 🔧 Variables d'Environnement (CRITIQUE)

1. **Cliquez sur l'onglet "Variables"** (en haut, à côté de Settings)
2. **Cliquez sur "New Variable"** ou **"Add Variable"**
3. **Ajoutez ces 7 variables une par une** :

### Variable 1 : NODE_ENV
```
Key: NODE_ENV
Value: production
```

### Variable 2 : PORT
```
Key: PORT
Value: 3000
```

### Variable 3 : MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
```

### Variable 4 : JWT_SECRET
```
Key: JWT_SECRET
Value: (générez avec la commande ci-dessous)
```

**Générer JWT_SECRET** (PowerShell) :
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Variable 5 : FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://guinea-smart-electricity.vercel.app
```

### Variable 6 : HUGGINGFACE_API_KEY (Optionnel)
```
Key: HUGGINGFACE_API_KEY
Value: (laissez vide si vous n'avez pas de token)
```

### Variable 7 : HUGGINGFACE_MODEL (Optionnel)
```
Key: HUGGINGFACE_MODEL
Value: google/flan-t5-large
```

## ✅ Checklist Finale

- [x] Root Directory = `/back` ✅ (déjà fait)
- [ ] Start Command = `npm start` ⚠️ À FAIRE
- [ ] Build Command = vide ✅ (laissez vide)
- [ ] 7 variables d'environnement ajoutées ⚠️ À FAIRE

## 🚀 Après Configuration

1. Railway va **automatiquement détecter les changements**
2. Le **déploiement va commencer**
3. Allez dans **"Deployments"** pour voir le progrès
4. **Attendez 2-3 minutes**

## 📍 Obtenir l'URL Railway

Une fois déployé :
1. **Settings** → **Networking**
2. **Generate Domain** ou **Public Domain**
3. **Copiez l'URL** : `https://votre-backend.up.railway.app`

## 🔗 Connecter au Frontend

1. **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. Modifiez `VITE_API_URL` = `https://votre-backend.up.railway.app`
4. **Redeploy**

---

**Action immédiate** : 
1. Configurez **Start Command** = `npm start`
2. Allez dans **Variables** et ajoutez les 7 variables
3. Railway déploiera automatiquement !

