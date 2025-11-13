# 🌐 Exposer le Service Railway

## ⚠️ Problème Actuel

Votre service est **"Unexposed"** (non exposé), ce qui signifie qu'il n'a pas d'URL publique.

## ✅ Solution : Exposer le Service

### Étape 1 : Aller dans Settings

1. **Cliquez sur l'onglet "Settings"** (en haut, à côté de Metrics)
2. **Scroll jusqu'à la section "Networking"**

### Étape 2 : Générer un Domaine Public

1. **Dans la section "Networking"**, vous verrez :
   - **"Public Domain"** ou **"Generate Domain"**
   - Ou **"Expose Service"**

2. **Cliquez sur "Generate Domain"** ou **"Expose Service"**
   - Railway va générer automatiquement une URL publique
   - Format : `https://votre-service.up.railway.app`

### Étape 3 : Vérifier l'URL

1. **Une fois le domaine généré**, vous verrez l'URL dans :
   - **Settings** → **Networking**
   - Ou dans l'onglet **"Deployments"** → Le dernier déploiement

2. **Copiez l'URL** : `https://votre-service.up.railway.app`

## 🔗 Mettre à Jour le Frontend Vercel

Une fois que vous avez l'URL Railway :

1. **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. **Modifiez `VITE_API_URL`** = `https://votre-service.up.railway.app`
4. **Redeploy** le frontend

## 📋 Checklist

- [ ] Service exposé (pas "Unexposed")
- [ ] URL publique obtenue
- [ ] Frontend Vercel mis à jour avec la nouvelle URL
- [ ] Frontend redéployé

---

**Action** : Allez dans Settings → Networking → Generate Domain !

