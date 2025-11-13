# 🚀 Guide Complet : Comment Vercel Fonctionne et Obtenir le Lien

## 📖 Comment Vercel Fonctionne

Vercel est une plateforme de déploiement qui :
1. **Connecte votre code GitHub** → Vercel surveille votre dépôt
2. **Détecte automatiquement** le framework (React, Vite, etc.)
3. **Build automatiquement** votre application à chaque push
4. **Déploie instantanément** sur un CDN global
5. **Génère un lien unique** pour votre application

## 🎯 Étapes pour Déployer et Obtenir le Lien

### Étape 1 : Créer un Compte Vercel

1. Allez sur **[vercel.com](https://vercel.com)**
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"** (recommandé)
4. Autorisez Vercel à accéder à votre compte GitHub

### Étape 2 : Importer Votre Projet

1. Une fois connecté, cliquez sur **"Add New..."** → **"Project"**
2. Vous verrez la liste de vos dépôts GitHub
3. Trouvez **"Guinea-smart-Electricity"** et cliquez sur **"Import"**

### Étape 3 : Configurer le Projet

⚠️ **IMPORTANT** : Configurez ces paramètres :

```
Project Name: guinea-smart-electricity (ou le nom de votre choix)
Root Directory: project  ← TRÈS IMPORTANT !
Framework Preset: Vite (détecté automatiquement)
Build Command: npm run build (automatique)
Output Directory: dist (automatique)
Install Command: npm install (automatique)
```

### Étape 4 : Ajouter les Variables d'Environnement

1. Cliquez sur **"Environment Variables"**
2. Ajoutez cette variable :
   ```
   Name: VITE_API_URL
   Value: http://localhost:3000
   ```
   (Vous la mettrez à jour plus tard avec l'URL de votre backend déployé)

3. Cliquez sur **"Add"** pour chaque variable

### Étape 5 : Déployer

1. Cliquez sur le bouton **"Deploy"** en bas
2. Attendez 2-3 minutes pendant que Vercel :
   - Installe les dépendances (`npm install`)
   - Build votre application (`npm run build`)
   - Déploie sur leur CDN

### Étape 6 : Obtenir le Lien 🎉

Une fois le déploiement terminé :

1. **Vous verrez un écran de succès** avec :
   - ✅ Un lien de production : `https://guinea-smart-electricity.vercel.app`
   - ✅ Un lien de preview pour chaque commit

2. **Le lien est automatiquement généré** au format :
   ```
   https://[nom-du-projet].vercel.app
   ```

3. **Vous pouvez le personnaliser** :
   - Allez dans **Settings** → **Domains**
   - Ajoutez votre propre domaine (optionnel)

## 🔄 Déploiements Automatiques

Vercel déploie automatiquement :
- ✅ **À chaque push sur `main`** → Nouvelle version de production
- ✅ **À chaque pull request** → Preview URL unique
- ✅ **À chaque commit** → Nouvelle version

## 📍 Où Trouver Votre Lien

### Après le Premier Déploiement

1. **Dashboard Vercel** :
   - Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
   - Cliquez sur votre projet
   - Le lien est affiché en haut : `https://votre-projet.vercel.app`

2. **Dans GitHub** :
   - Vercel ajoute un commentaire sur chaque commit avec le lien

3. **Dans les Emails** :
   - Vercel vous envoie un email avec le lien après chaque déploiement

## 🔗 Types de Liens Vercel

### 1. Lien de Production
```
https://guinea-smart-electricity.vercel.app
```
- Toujours actif
- Mis à jour à chaque push sur `main`

### 2. Lien de Preview
```
https://guinea-smart-electricity-git-branch-username.vercel.app
```
- Créé pour chaque branche/PR
- Unique par commit

## 🛠️ Commandes Vercel CLI (Optionnel)

Si vous préférez utiliser la ligne de commande :

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer depuis le dossier project
cd project
vercel

# Déployer en production
vercel --prod
```

## 📊 Dashboard Vercel

Une fois déployé, vous pouvez :
- ✅ Voir les logs de déploiement
- ✅ Voir les analytics (visiteurs, performance)
- ✅ Gérer les variables d'environnement
- ✅ Voir l'historique des déploiements
- ✅ Configurer un domaine personnalisé

## 🔧 Mettre à Jour le Lien Backend

Une fois votre backend déployé (Railway, Render, etc.) :

1. **Récupérez l'URL de votre backend** (ex: `https://votre-backend.railway.app`)

2. **Dans Vercel** :
   - Allez dans votre projet → **Settings** → **Environment Variables**
   - Modifiez `VITE_API_URL` avec l'URL de votre backend
   - Cliquez sur **"Save"**
   - **Redéployez** (Vercel le fait automatiquement ou cliquez sur "Redeploy")

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Ouvrez votre lien Vercel dans le navigateur
2. L'application devrait se charger
3. Testez la connexion/inscription
4. Vérifiez que les appels API fonctionnent

## 🎉 C'est Tout !

Votre application est maintenant en ligne avec un lien permanent !

**Exemple de lien** : `https://guinea-smart-electricity-xyz123.vercel.app`

