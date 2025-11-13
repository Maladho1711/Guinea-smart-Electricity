# ⚙️ Configurer le Service Railway - Guide Rapide

## 🎯 Vous êtes dans le Service "Guinea-smart-Electricity"

Vous voyez les onglets : Deployments, Variables, Metrics, Settings

### ✅ Action Immédiate

1. **Cliquez sur l'onglet "Settings"** (le dernier onglet à droite)
2. Dans Settings, vous trouverez :
   - **Source** ou **Repository** → **Root Directory** ici
   - **Deploy** → **Start Command** ici

## 📋 Configuration dans Settings

### 1. Root Directory

1. Dans **Settings**, scroll jusqu'à **"Source"** ou **"Repository"**
2. Cherchez **"Root Directory"** ou **"Add Root Directory"**
3. **Tapez** : `/back`
4. **Save**

### 2. Start Command

1. Dans **Settings**, scroll jusqu'à **"Deploy"** ou **"Deployment"**
2. Cherchez **"Custom Start Command"** ou **"Start Command"**
3. **Tapez** : `npm start`
4. **Save**

### 3. Variables d'Environnement

1. **Cliquez sur l'onglet "Variables"** (pas Settings)
2. **New Variable** ou **Add Variable**
3. Ajoutez les 7 variables (voir ci-dessous)

## 🔧 Variables à Ajouter (Onglet Variables)

Cliquez sur **"Variables"** et ajoutez :

1. **NODE_ENV** = `production`
2. **PORT** = `3000`
3. **MONGODB_URI** = `mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03`
4. **JWT_SECRET** = (générez avec PowerShell - voir ci-dessous)
5. **FRONTEND_URL** = `https://guinea-smart-electricity.vercel.app`
6. **HUGGINGFACE_API_KEY** = (optionnel, laissez vide)
7. **HUGGINGFACE_MODEL** = `google/flan-t5-large`

### Générer JWT_SECRET

Ouvrez PowerShell et exécutez :
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## ✅ Checklist

- [ ] Aller dans Settings du service
- [ ] Configurer Root Directory = `/back`
- [ ] Configurer Start Command = `npm start`
- [ ] Aller dans Variables
- [ ] Ajouter les 7 variables d'environnement
- [ ] Railway va déployer automatiquement

## 🚀 Après Configuration

1. Railway détectera les changements
2. Le déploiement commencera automatiquement
3. Allez dans **"Deployments"** pour voir le progrès
4. Attendez 2-3 minutes

---

**Action** : Cliquez sur **"Settings"** maintenant et configurez Root Directory et Start Command !

