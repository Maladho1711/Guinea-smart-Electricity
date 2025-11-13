# 🎯 Trouver Votre Projet dans Vercel

## 📍 Vous êtes sur la Page d'Accueil

Vous voyez :
- **Usage** (statistiques)
- **Recent Previews**
- **Projects** (liste de vos projets)

## ✅ Étape 1 : Trouver Votre Projet

### Option A : Si Votre Projet Apparaît dans la Liste

1. **Cherchez** "guinea-smart-electricity" dans la liste des projets
2. **Cliquez sur le nom du projet**
3. Vous serez redirigé vers la page du projet

### Option B : Si Votre Projet N'Apparaît Pas

1. **Cliquez sur "Import Project"** ou **"Add"** (en haut à droite)
2. **Connectez votre repository GitHub** (si pas déjà connecté)
3. **Sélectionnez** le repository "Guinea-smart-Electricity"
4. **Vercel va détecter** le projet automatiquement
5. **Configurez** et **déployez**

## ✅ Étape 2 : Une Fois dans le Projet

1. **Cliquez sur l'onglet "Settings"** (en haut)
2. **Dans le menu de gauche**, cliquez sur **"Environment Variables"**
3. **Vous verrez** la liste des variables d'environnement du projet

## ✅ Étape 3 : Modifier VITE_API_URL

### Si VITE_API_URL existe déjà :

1. **Trouvez `VITE_API_URL`** dans la liste
2. **Cliquez sur les 3 points** (⋯) à droite
3. **Cliquez sur "Edit"**
4. **Modifiez la Value** = `https://guinea-smart-electricity-production.up.railway.app`
5. **Vérifiez les environnements** (Production, Preview, Development)
6. **Cliquez sur "Save"**

### Si VITE_API_URL n'existe pas :

1. **Cliquez sur "Add New"** (bouton en haut)
2. **Key** : `VITE_API_URL`
3. **Value** : `https://guinea-smart-electricity-production.up.railway.app`
4. **Environments** : Cochez **Production**, **Preview**, et **Development**
5. **Cliquez sur "Save"**

## ✅ Étape 4 : Redéployer

1. **Allez dans l'onglet "Deployments"**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Attendez 2-3 minutes**

---

**Action** : Cherchez "guinea-smart-electricity" dans la liste des projets et cliquez dessus !

