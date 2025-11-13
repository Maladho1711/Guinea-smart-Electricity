# 🔍 Où Trouver Root Directory dans Railway

## 📍 Emplacements Possibles

### Option 1 : Dans la Section "Source"

1. **Cliquez sur votre service** (le service dans Railway)
2. Allez dans **"Settings"** (en haut à droite)
3. Scroll jusqu'à la section **"Source"** ou **"Repository"**
4. Cherchez **"Root Directory"** ou **"Add Root Directory"**
5. Si vous voyez "Source Repo" → Cliquez dessus pour voir plus d'options

### Option 2 : Lors de la Création du Service

Si vous créez un nouveau service :
1. **New Service** → **GitHub Repo**
2. Sélectionnez `Guinea-smart-Electricity`
3. Railway peut vous demander **"Which directory?"** ou **"Root Directory"**
4. Sélectionnez ou tapez : `/back`

### Option 3 : Dans les Settings Avancés

1. **Settings** → Scroll en bas
2. Cherchez **"Advanced"** ou **"Repository Settings"**
3. **Root Directory** devrait être là

### Option 4 : Si Root Directory n'existe pas

Railway peut auto-détecter. Mais pour forcer `/back`, essayez :

1. **Supprimez le service actuel**
2. **New Service** → **GitHub Repo**
3. Sélectionnez `Guinea-smart-Electricity`
4. Railway devrait détecter qu'il y a un dossier `back/`
5. Si Railway vous demande, sélectionnez `/back`

## 🎯 Solution Alternative : Créer un Service Vide

1. **New Service** → **Empty Service**
2. **Settings** → **Source** → **Connect GitHub Repo**
3. Sélectionnez `Guinea-smart-Electricity`
4. **Root Directory** devrait apparaître maintenant
5. Tapez : `/back`

## 📝 Note Importante

Si Railway ne vous montre pas Root Directory, c'est peut-être parce que :
- Railway auto-détecte déjà le bon dossier
- L'interface a changé
- Vous devez d'abord connecter le repo

## ✅ Action Immédiate

**Essayez ceci** :
1. **Supprimez le service actuel** (si vous venez de le créer)
2. **New Service** → **GitHub Repo**
3. Sélectionnez `Guinea-smart-Electricity`
4. Lors de la configuration, Railway devrait vous montrer les options
5. Si Railway ne demande pas, allez dans **Settings** après création

## 🔧 Configuration Minimale

Même sans Root Directory visible, configurez au minimum :

1. **Start Command** : `npm start` (dans Settings → Deploy)
2. **Variables d'Environnement** (dans l'onglet Variables)
3. Railway peut auto-détecter le dossier `back/` si c'est le seul avec un `package.json`

---

**Si vous ne trouvez toujours pas**, dites-moi ce que vous voyez dans Settings et je vous guiderai plus précisément !

