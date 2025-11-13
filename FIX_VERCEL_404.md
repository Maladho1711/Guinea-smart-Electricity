# 🔧 Guide pour Corriger l'Erreur 404 sur Vercel

## Problème
Vous voyez une erreur `404: NOT_FOUND` lors de l'accès à votre application déployée sur Vercel.

## Solutions

### ✅ Solution 1 : Vérifier la Configuration Vercel

1. **Allez sur votre dashboard Vercel** : [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Sélectionnez votre projet** : `guinea-smart-electricity-mrxb`

3. **Allez dans Settings → General**

4. **Vérifiez les paramètres suivants** :
   - **Root Directory** : Doit être `project` (pas vide)
   - **Build Command** : `npm install --legacy-peer-deps && npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install --legacy-peer-deps`
   - **Framework Preset** : `Vite`

### ✅ Solution 2 : Forcer un Redéploiement

1. Dans Vercel Dashboard → Votre projet → **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Attendez 2-3 minutes que le déploiement se termine

### ✅ Solution 3 : Vérifier le Fichier vercel.json

Le fichier `project/vercel.json` doit contenir :

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

### ✅ Solution 4 : Vérifier les Routes dans Vercel

1. Allez dans **Settings → Functions**
2. Vérifiez qu'il n'y a pas de conflit avec des routes API

### ✅ Solution 5 : Vérifier le Build Local

Testez le build localement pour vérifier qu'il fonctionne :

```bash
cd project
npm install --legacy-peer-deps
npm run build
npm run preview
```

Si le build fonctionne localement mais pas sur Vercel, c'est probablement un problème de configuration Vercel.

### ✅ Solution 6 : Vérifier les Logs de Build

1. Dans Vercel Dashboard → Votre projet → **Deployments**
2. Cliquez sur le dernier déploiement
3. Allez dans l'onglet **Build Logs**
4. Vérifiez s'il y a des erreurs

### ✅ Solution 7 : Configuration Alternative (si rien ne fonctionne)

Si les solutions ci-dessus ne fonctionnent pas, essayez cette configuration dans `project/vercel.json` :

```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🎯 Checklist de Vérification

- [ ] Le fichier `project/vercel.json` existe et contient les `rewrites`
- [ ] Le **Root Directory** dans Vercel est configuré sur `project`
- [ ] Le **Output Directory** est `dist`
- [ ] Le build fonctionne localement (`npm run build`)
- [ ] Un redéploiement a été effectué après les changements
- [ ] Les logs de build ne montrent pas d'erreurs

## 📞 Si le Problème Persiste

1. Vérifiez les **Build Logs** dans Vercel pour voir les erreurs exactes
2. Vérifiez que le dossier `dist` contient bien `index.html` après le build
3. Essayez de supprimer et recréer le projet sur Vercel
4. Contactez le support Vercel si nécessaire

## 🔗 Liens Utiles

- [Documentation Vercel - React Router](https://vercel.com/docs/frameworks/react)
- [Documentation Vercel - Vite](https://vercel.com/docs/frameworks/vite)
- [Guide Vercel - Erreur 404](https://vercel.com/guides/why-is-my-deployed-project-giving-404)

