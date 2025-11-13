# 🌐 Générer un Domaine Public Railway

## 📍 Situation Actuelle

Vous avez actuellement :
- ✅ **Private Networking** : `guinea-smart-electricity.railway.internal` (interne uniquement)
- ❌ **Public Networking** : Pas encore configuré

## ✅ Solution : Générer un Domaine Public

### Étape 1 : Générer le Domaine

1. **Dans la section "Public Networking"**
2. **Cliquez sur "Generate Domain"** (bouton bleu)
3. **Railway va générer automatiquement** une URL publique
4. **Format** : `https://guinea-smart-electricity-production-[hash].up.railway.app`

### Étape 2 : Copier l'URL

Une fois généré, vous verrez l'URL publique :
- **Exemple** : `https://guinea-smart-electricity-production-xxxx.up.railway.app`
- **Copiez cette URL** - vous en aurez besoin pour le frontend

### Étape 3 : Vérifier que le Service Fonctionne

1. **Ouvrez l'URL** dans votre navigateur
2. **Vous devriez voir** :
   - Une réponse JSON (si l'API répond)
   - Ou une erreur 404 (normal si vous n'avez pas de route `/`)
3. **Testez une route** : `https://votre-url.up.railway.app/api/health`

## 🔗 Mettre à Jour le Frontend Vercel

Une fois que vous avez l'URL publique :

1. **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. **Modifiez `VITE_API_URL`** = `https://votre-url.up.railway.app`
4. **Redeploy** le frontend

## 📋 Différence entre Public et Private

- **Public Networking** : Accessible depuis Internet (nécessaire pour le frontend)
- **Private Networking** : Accessible uniquement depuis d'autres services Railway (interne)

---

**Action** : Cliquez sur "Generate Domain" dans la section "Public Networking" !

