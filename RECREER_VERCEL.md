# 🚀 Recréer le Projet Vercel - Guide Complet

## 📋 Étapes pour Recréer le Projet Vercel

### Étape 1 : Accéder à Vercel

1. Allez sur **[vercel.com](https://vercel.com)**
2. Connectez-vous avec GitHub
3. Cliquez sur **"Add New Project"** ou **"New Project"**

### Étape 2 : Importer le Repository

1. Dans la liste des repositories, trouvez : **`Maladho1711/Guinea-smart-Electricity`**
2. Cliquez sur **"Import"**

### Étape 3 : Configuration du Projet (CRITIQUE)

**⚠️ IMPORTANT : Configurez ces paramètres AVANT de cliquer "Deploy"**

1. **Project Name** : `guinea-smart-electricity` (ou votre choix)

2. **Root Directory** : 
   - Cliquez sur **"Edit"** ou **"Configure"**
   - Tapez : `project`
   - ⚠️ **C'EST LE PLUS IMPORTANT !**

3. **Framework Preset** : 
   - Sélectionnez : `Vite` (ou laissez auto-détecter)

4. **Build and Output Settings** :
   - **Build Command** : `npm install --legacy-peer-deps && npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install --legacy-peer-deps`
   - **Development Command** : `npm run dev`

5. **Environment Variables** (optionnel pour l'instant) :
   - Vous pouvez ajouter `VITE_API_URL` plus tard après le déploiement Railway

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes que le build se termine
3. Vercel vous donnera une URL automatique

### Étape 5 : Vérifier le Déploiement

1. Une fois terminé, cliquez sur l'URL fournie
2. Testez :
   - Page d'accueil : `https://votre-url.vercel.app/`
   - FAQ : `https://votre-url.vercel.app/faq`

### Étape 6 : Vérifier les Settings (Après Déploiement)

1. Allez dans **Settings** → **General**
2. Vérifiez que **Root Directory** = `project`
3. Si ce n'est pas le cas, modifiez-le et redéployez

## ✅ Checklist de Vérification

- [ ] Root Directory = `project` (configuré AVANT le premier déploiement)
- [ ] Build Command = `npm install --legacy-peer-deps && npm run build`
- [ ] Output Directory = `dist`
- [ ] Install Command = `npm install --legacy-peer-deps`
- [ ] Framework = `Vite`
- [ ] Déploiement réussi
- [ ] Application accessible sans erreur 404

## 🎯 Résultat Attendu

- ✅ Un seul projet Vercel
- ✅ Configuration correcte dès le début
- ✅ Application fonctionnelle
- ✅ Pas d'erreur 404

## 📝 Note

Si vous avez déjà créé le projet et que le Root Directory n'est pas correct :
1. Allez dans **Settings** → **General**
2. **Root Directory** → **Edit** → Tapez `project` → **Save**
3. **Deployments** → **Redeploy**

