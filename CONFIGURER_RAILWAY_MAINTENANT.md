# ⚙️ Configuration Railway - Guide Visuel

## 🎯 Vous êtes sur la Page Settings de Railway

### ⚠️ ACTION CRITIQUE : Root Directory

1. **Trouvez la section "Add Root Directory"** (ou "Root Directory")
2. **Cliquez sur "Add Root Directory"** ou le champ existant
3. **Tapez** : `/back` (avec le slash au début)
4. **Sauvegardez**

### 📋 Configuration Complète

#### 1. Root Directory
- **Valeur** : `/back`
- ⚠️ **C'EST LE PLUS IMPORTANT !**

#### 2. Build Settings

**Builder** : Laissez "Railpack" (par défaut)

**Custom Build Command** : 
- Laissez **VIDE** (Railway auto-détectera)
- OU si vous voulez spécifier : `npm install && npm run build`

**Metal Build Environment** : 
- Laissez **décoché** pour l'instant (beta)

#### 3. Deploy Settings

**Custom Start Command** :
- **Valeur** : `npm start`
- ⚠️ **IMPORTANT** : Doit être configuré !

**Restart Policy** :
- **On Failure** ✅ (déjà configuré)
- **Max restart retries** : 10 ✅ (déjà configuré)

#### 4. Resource Limits

- **CPU** : 2 vCPU ✅ (par défaut)
- **Memory** : 1 GB ✅ (par défaut)
- C'est suffisant pour commencer

### 🔧 Variables d'Environnement

**Allez dans l'onglet "Variables"** (pas dans Settings, mais dans le menu principal du service)

Ajoutez ces 7 variables :

1. **NODE_ENV** = `production`
2. **PORT** = `3000`
3. **MONGODB_URI** = `mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03`
4. **JWT_SECRET** = (générez un secret - voir ci-dessous)
5. **FRONTEND_URL** = `https://guinea-smart-electricity.vercel.app`
6. **HUGGINGFACE_API_KEY** = (optionnel, laissez vide si pas de token)
7. **HUGGINGFACE_MODEL** = `google/flan-t5-large`

### 🔑 Générer JWT_SECRET

**Sur Windows (PowerShell)** :
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copiez le résultat et utilisez-le pour `JWT_SECRET`.

### ✅ Checklist de Configuration

- [ ] Root Directory = `/back` configuré
- [ ] Start Command = `npm start` configuré
- [ ] Build Command = vide (auto-détection) OU `npm install && npm run build`
- [ ] 7 variables d'environnement ajoutées dans l'onglet "Variables"
- [ ] JWT_SECRET généré et ajouté

### 🚀 Après Configuration

1. Railway va automatiquement détecter les changements
2. Le déploiement va commencer
3. Allez dans **"Deployments"** pour voir le progrès
4. Attendez 2-3 minutes

### 📍 Obtenir l'URL

Une fois déployé :
1. **Settings** → **Networking**
2. **Generate Domain** ou **Public Domain**
3. Copiez l'URL Railway

---

**Action immédiate** : Configurez Root Directory = `/back` et Start Command = `npm start` !

