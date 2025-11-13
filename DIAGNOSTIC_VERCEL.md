# 🔍 Diagnostic Vercel - Guide Complet

## ✅ Vérifications à Faire

### 1. Vérifier le Build Local (DÉJÀ FAIT ✅)

Le build fonctionne localement :
```bash
cd project
npm install --legacy-peer-deps
npm run build
```

✅ **Résultat** : Build réussi, fichiers générés dans `dist/`

### 2. Vérifier la Configuration Vercel Dashboard

**ÉTAPE CRITIQUE** : Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)

#### A. Root Directory (LE PLUS IMPORTANT)

1. Projet → **Settings** → **General**
2. Section **Root Directory**
3. **DOIT être** : `project` (pas vide, pas `/project`, juste `project`)
4. Si vide ou incorrect → Cliquez **Edit** → Tapez `project` → **Save**

⚠️ **C'est la cause #1 des erreurs 404 !**

#### B. Build & Development Settings

1. **Settings** → **General** → **Build & Development Settings**
2. Vérifiez :
   - **Framework Preset** : `Vite` (ou détecté automatiquement)
   - **Build Command** : `npm install --legacy-peer-deps && npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install --legacy-peer-deps`
   - **Development Command** : `npm run dev`

#### C. Variables d'Environnement

1. **Settings** → **Environment Variables**
2. Ajoutez (si pas déjà fait) :
   ```
   VITE_API_URL=http://localhost:3000
   ```
   (Changez en URL Railway après déploiement backend)

### 3. Vérifier les Build Logs sur Vercel

1. **Deployments** → Cliquez sur le dernier déploiement
2. Onglet **Build Logs**
3. Cherchez les erreurs :
   - ❌ `Error: Cannot find module`
   - ❌ `Error: Command failed`
   - ❌ `404: NOT_FOUND`
   - ❌ `Root Directory not found`

### 4. Vérifier le Fichier vercel.json

Le fichier `project/vercel.json` doit être simple :

```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

✅ **Vérifié** : Le fichier est correct

### 5. Vérifier la Structure du Projet

Votre structure doit être :
```
Guinea Smart Electricity/
├── project/          ← Root Directory dans Vercel
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.ts
└── back/
```

✅ **Vérifié** : Structure correcte

## 🐛 Problèmes Courants et Solutions

### Problème 1 : Erreur 404 sur toutes les routes

**Cause** : Root Directory non configuré ou incorrect

**Solution** :
1. Vercel Dashboard → Settings → General
2. Root Directory : `project`
3. Save
4. Redéployer

### Problème 2 : Build échoue avec erreur de dépendances

**Cause** : Conflits de dépendances peer

**Solution** : Déjà configuré avec `--legacy-peer-deps`

### Problème 3 : Build réussit mais 404 sur l'application

**Cause** : Rewrites non configurés

**Solution** : Vérifier que `vercel.json` contient les `rewrites` (✅ déjà fait)

### Problème 4 : Erreur "Cannot find module"

**Cause** : Node modules non installés correctement

**Solution** :
1. Vérifier que `installCommand` est : `npm install --legacy-peer-deps`
2. Redéployer

## 🔧 Actions Correctives

### Action 1 : Forcer un Redéploiement

1. **Deployments** → Dernier déploiement
2. **3 points** (⋯) → **Redeploy**
3. Attendre 2-3 minutes

### Action 2 : Supprimer le Cache Vercel

1. **Settings** → **General**
2. Scroll jusqu'à **Build Cache**
3. Cliquez **Clear Build Cache**
4. Redéployer

### Action 3 : Recréer le Projet (Dernier Recours)

1. **Settings** → **General** → Scroll en bas
2. **Delete Project**
3. Recréer le projet
4. **IMPORTANT** : Configurer Root Directory = `project` dès le début

## 📊 Checklist de Diagnostic

Cochez chaque point :

- [ ] Build local fonctionne (`npm run build`)
- [ ] Root Directory = `project` dans Vercel
- [ ] Build Command = `npm install --legacy-peer-deps && npm run build`
- [ ] Output Directory = `dist`
- [ ] Install Command = `npm install --legacy-peer-deps`
- [ ] `vercel.json` existe dans `project/`
- [ ] `vercel.json` contient les `rewrites`
- [ ] Build Logs ne montrent pas d'erreurs
- [ ] Redéploiement effectué après modifications

## 🎯 Test Final

Après toutes les corrections, testez :

1. **Page d'accueil** : `https://guinea-smart-electricity-mrxb.vercel.app/`
   - ✅ Doit afficher la landing page
   - ❌ Si 404 → Root Directory incorrect

2. **Route FAQ** : `https://guinea-smart-electricity-mrxb.vercel.app/faq`
   - ✅ Doit afficher la FAQ
   - ❌ Si 404 → Rewrites non configurés

3. **Route Dashboard** : `https://guinea-smart-electricity-mrxb.vercel.app/pme-dashboard`
   - ✅ Doit rediriger ou afficher le dashboard
   - ❌ Si 404 → Rewrites non configurés

## 📞 Support

Si rien ne fonctionne :

1. Copiez les **Build Logs** complets
2. Vérifiez la **screenshot** de l'erreur
3. Vérifiez la configuration **Root Directory**
4. Contactez le support Vercel avec ces informations

## ✅ Configuration Actuelle

- ✅ Build local : **Fonctionne**
- ✅ vercel.json : **Corrigé et simplifié**
- ✅ Structure projet : **Correcte**
- ⚠️ **À VÉRIFIER** : Root Directory dans Vercel Dashboard

