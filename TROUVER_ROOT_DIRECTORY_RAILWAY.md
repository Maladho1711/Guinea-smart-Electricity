# 🔍 Comment Trouver Root Directory dans Railway

## 📍 Où se trouve Root Directory ?

### Option 1 : Dans les Settings du Service

1. **Cliquez sur votre service** (le service créé dans Railway)
2. Allez dans l'onglet **"Settings"** (en haut à droite)
3. Scroll jusqu'à la section **"Source"** ou **"Repository"**
4. Vous devriez voir **"Root Directory"** ou **"Add Root Directory"**

### Option 2 : Dans la Configuration du Service

1. **Cliquez sur votre service**
2. Cherchez **"Source"** ou **"Repository Settings"**
3. Il y a un champ **"Root Directory"** ou un bouton **"Add Root Directory"**

### Option 3 : Si vous ne voyez pas Root Directory

Railway peut avoir changé l'interface. Essayez :

1. **Cliquez sur les 3 points** (⋯) à côté du nom du service
2. Cherchez **"Settings"** ou **"Configure"**
3. Ou allez dans **"Variables"** d'abord, puis revenez à **"Settings"**

## 🎯 Alternative : Configurer via le Fichier railway.json

Si vous ne trouvez pas l'option dans l'interface, Railway peut auto-détecter. Mais pour être sûr, créons un fichier de configuration :

### Créer railway.json dans le dossier back/

Créez un fichier `back/railway.json` avec :

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Mais attendez, on avait supprimé ce fichier car il causait des problèmes. Laissez-moi vérifier une meilleure solution.

## 🔧 Solution : Railway Auto-Détection

Railway peut auto-détecter le dossier si vous créez le service correctement :

1. **Supprimez le service actuel** (si nécessaire)
2. **Créez un nouveau service**
3. Lors de la création, Railway vous demande de sélectionner le repo
4. **Sélectionnez le repo** : `Guinea-smart-Electricity`
5. Railway devrait détecter automatiquement qu'il y a un dossier `back/`

## 📝 Instructions Détaillées

### Si Root Directory n'apparaît pas :

1. **Vérifiez que vous êtes dans Settings du SERVICE** (pas du projet)
2. **Scroll en bas** de la page Settings
3. Cherchez **"Source"** ou **"Repository"**
4. Il devrait y avoir une option pour changer le dossier

### Alternative : Créer un Service Séparé pour /back

1. Dans votre projet Railway
2. **New Service** → **GitHub Repo**
3. Sélectionnez `Guinea-smart-Electricity`
4. Railway devrait vous demander quel dossier utiliser
5. Sélectionnez `/back`

## 🆘 Si Rien Ne Fonctionne

Essayez cette approche :

1. **Supprimez le service actuel**
2. **New Service** → **Empty Service**
3. **Settings** → **Source** → **Connect GitHub Repo**
4. Sélectionnez `Guinea-smart-Electricity`
5. **Root Directory** devrait apparaître maintenant

---

**Note** : L'interface Railway peut varier. Le Root Directory se trouve généralement dans Settings → Source ou Repository.

