# 🔧 Modifier VITE_API_URL dans Vercel - Guide Complet

## ⚠️ Vous êtes au Mauvais Endroit

Vous êtes actuellement dans **"Shared Environment Variables"** (variables partagées de l'équipe).

Vous devez aller dans les **variables d'environnement du projet spécifique**.

## ✅ Navigation Correcte

### Étape 1 : Retourner au Projet

1. **Cliquez sur "Home"** ou **"Dashboard"** (en haut à gauche)
2. **Trouvez votre projet** "guinea-smart-electricity"
3. **Cliquez sur le nom du projet** (pas sur les variables)

### Étape 2 : Aller dans les Variables du Projet

1. **Une fois dans le projet**, vous verrez plusieurs onglets :
   - Overview
   - **Deployments**
   - **Settings** ← **CLIQUEZ ICI**
   - Analytics
   - etc.

2. **Cliquez sur "Settings"**

### Étape 3 : Aller dans Environment Variables

1. **Dans Settings**, vous verrez une liste à gauche :
   - General
   - **Environment Variables** ← **CLIQUEZ ICI**
   - Git
   - Domains
   - etc.

2. **Cliquez sur "Environment Variables"**

### Étape 4 : Modifier ou Ajouter VITE_API_URL

Vous verrez maintenant une liste de variables d'environnement du projet.

#### Si VITE_API_URL existe déjà :

1. **Trouvez `VITE_API_URL`** dans la liste
2. **Cliquez sur les 3 points** (⋯) à droite
3. **Cliquez sur "Edit"**
4. **Modifiez la Value** = `https://guinea-smart-electricity-production.up.railway.app`
5. **Vérifiez les environnements** (Production, Preview, Development)
6. **Cliquez sur "Save"**

#### Si VITE_API_URL n'existe pas :

1. **Cliquez sur "Add New"** (bouton en haut)
2. **Key** : `VITE_API_URL`
3. **Value** : `https://guinea-smart-electricity-production.up.railway.app`
4. **Environments** : Cochez **Production**, **Preview**, et **Development**
5. **Cliquez sur "Save"**

### Étape 5 : Redéployer

1. **Allez dans l'onglet "Deployments"**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Attendez 2-3 minutes**

## 📋 Chemin Complet

```
Vercel Dashboard
  → Projet "guinea-smart-electricity"
    → Settings
      → Environment Variables
        → Add New ou Edit VITE_API_URL
```

## ✅ Après Modification

1. **Redéployez** le frontend
2. **Testez le site** - les appels API devraient maintenant aller vers Railway
3. **Vérifiez la console du navigateur** pour confirmer

---

**Action** : Retournez au Dashboard → Cliquez sur votre projet → Settings → Environment Variables !

