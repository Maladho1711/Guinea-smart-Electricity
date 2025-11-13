# 🚀 Redéployer le Service Railway

## ✅ Variables Ajoutées !

Toutes les variables d'environnement sont maintenant configurées :
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ PORT
- ✅ NODE_ENV
- ✅ FRONTEND_URL
- ✅ HUGGINGFACE_MODEL
- ✅ HUGGINGFACE_API_KEY

## 🔄 Étape Suivante : Redéployer

### Instructions

1. **Allez dans l'onglet "Deployments"** (en haut, à côté de Variables)
2. **Trouvez le dernier déploiement** dans la liste
3. **Cliquez sur les 3 points** (⋯) à droite du déploiement
4. **Cliquez sur "Redeploy"** ou **"Restart"**
5. **Attendez 2-3 minutes** pour le redéploiement

### Alternative : Nouveau Déploiement Automatique

Railway peut aussi détecter automatiquement les changements et créer un nouveau déploiement. Si c'est le cas, attendez simplement.

## 🔍 Vérifier les Logs

Après le redéploiement :

1. **Cliquez sur le nouveau déploiement** dans la liste
2. **Ouvrez les logs** (section "Logs" ou "View Logs")
3. **Vérifiez que vous voyez** :

   ✅ **Si ça fonctionne** :
   ```
   🔄 Tentative de connexion à MongoDB...
   📍 URI: mongodb+srv://***:***@clusterdw03.wqjnl8l.mongodb.net/...
   ✅ MongoDB connecté avec succès!
   🚀 Serveur démarré sur le port 3000
   ```

   ❌ **Si ça ne fonctionne pas** :
   ```
   ❌ MONGODB_URI n'est pas définie dans les variables d'environnement
   ```

## 📍 Obtenir l'URL du Backend

Une fois déployé avec succès :

1. **Allez dans Settings** → **Networking**
2. **Generate Domain** ou cliquez sur le domaine public
3. **Copiez l'URL** : `https://votre-backend.up.railway.app`

## 🔗 Mettre à Jour le Frontend Vercel

1. **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. **Modifiez `VITE_API_URL`** = `https://votre-backend.up.railway.app`
4. **Redeploy** le frontend

---

**Action** : Allez dans Deployments → Redéployez le service → Vérifiez les logs !

