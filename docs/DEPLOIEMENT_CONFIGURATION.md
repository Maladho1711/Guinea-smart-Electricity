# 🔧 Configuration de Déploiement - Guide Complet

## 📋 Problèmes Identifiés et Solutions

### ❌ Problème 1: Impossible de se connecter depuis une autre machine

**Cause**: 
- La variable `VITE_API_URL` n'est pas configurée sur Vercel
- Le backend n'écoute que sur `localhost` au lieu de `0.0.0.0`
- CORS trop restrictif

**Solution**: ✅ Corrigé dans le code

---

## 🚀 Configuration Vercel (Frontend)

### Variables d'environnement à configurer

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Ajoutez :

```
VITE_API_URL = https://votre-backend.railway.app
```

⚠️ **IMPORTANT**: 
- Remplacez `votre-backend.railway.app` par l'URL réelle de votre backend Railway
- L'URL doit commencer par `https://`
- L'URL ne doit PAS se terminer par `/`

### Comment obtenir l'URL du backend Railway

1. Allez sur [Railway Dashboard](https://railway.app)
2. Sélectionnez votre service backend
3. Allez dans l'onglet **Settings**
4. Dans **Networking**, vous verrez l'URL publique (ex: `https://votre-service.up.railway.app`)
5. Copiez cette URL et utilisez-la pour `VITE_API_URL` dans Vercel

---

## 🚂 Configuration Railway (Backend)

### Variables d'environnement à configurer

1. Allez sur [Railway Dashboard](https://railway.app)
2. Sélectionnez votre service backend
3. Allez dans l'onglet **Variables**
4. Ajoutez/Modifiez :

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/guinea_smart_electricity?retryWrites=true&w=majority
JWT_SECRET = votre_secret_jwt_tres_securise
JWT_EXPIRES_IN = 24h
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://votre-site.vercel.app
```

⚠️ **IMPORTANT**: 
- Remplacez `votre-site.vercel.app` par l'URL réelle de votre frontend Vercel
- `FRONTEND_URL` est utilisé pour CORS - assurez-vous qu'il correspond exactement à votre URL Vercel

### Vérifier que le service est public

1. Dans Railway, allez dans **Settings** → **Networking**
2. Assurez-vous que **Public Networking** est activé
3. Notez l'URL publique générée (ex: `https://votre-service.up.railway.app`)

---

## ✅ Checklist de Vérification

### Frontend (Vercel)
- [ ] `VITE_API_URL` est configuré avec l'URL complète du backend Railway
- [ ] L'URL commence par `https://`
- [ ] L'URL ne se termine pas par `/`
- [ ] Le projet a été redéployé après avoir ajouté la variable

### Backend (Railway)
- [ ] `MONGODB_URI` est configuré avec votre URI MongoDB Atlas
- [ ] `JWT_SECRET` est défini (changez-le si c'est encore la valeur par défaut!)
- [ ] `FRONTEND_URL` correspond exactement à votre URL Vercel
- [ ] `NODE_ENV=production` est défini
- [ ] Le service est en mode **Public Networking**
- [ ] Le service est démarré et fonctionne (vérifiez les logs)

### Test de Connexion

1. Ouvrez votre site Vercel dans un navigateur
2. Ouvrez la console développeur (F12)
3. Essayez de vous connecter
4. Vérifiez les erreurs dans la console :
   - Si vous voyez `Failed to fetch` → Vérifiez `VITE_API_URL`
   - Si vous voyez `CORS error` → Vérifiez `FRONTEND_URL` dans Railway
   - Si vous voyez `401 Unauthorized` → Le backend fonctionne mais l'authentification échoue

---

## 🔍 Débogage

### Vérifier que le backend répond

Ouvrez dans votre navigateur :
```
https://votre-backend.railway.app/api/health
```

Vous devriez voir :
```json
{
  "status": "Backend running successfully",
  "timestamp": "2024-..."
}
```

### Vérifier les logs Railway

1. Allez dans Railway → Votre service → **Deployments**
2. Cliquez sur le dernier déploiement
3. Vérifiez les logs pour :
   - `✅ MongoDB connecté avec succès!`
   - `🚀 Serveur démarré sur le port 3000`
   - `🌐 URL publique: http://0.0.0.0:3000`

### Vérifier les logs Vercel

1. Allez dans Vercel → Votre projet → **Deployments**
2. Cliquez sur le dernier déploiement
3. Vérifiez les logs de build pour voir si `VITE_API_URL` est bien utilisé

---

## 🛠️ Améliorations Apportées

### Backend (`back/src/app.ts`)
- ✅ CORS amélioré pour accepter toutes les origines en production (si `FRONTEND_URL` n'est pas défini)
- ✅ Support des variantes d'URL (avec/sans www, http/https)
- ✅ Logs améliorés pour le débogage

### Backend (`back/src/server.ts`)
- ✅ Le serveur écoute sur `0.0.0.0` en production (au lieu de `localhost`)
- ✅ Permet les connexions depuis l'extérieur

### Frontend (`project/src/config/api.ts`)
- ✅ Détection automatique de l'environnement
- ✅ Messages d'erreur améliorés avec instructions
- ✅ Gestion des erreurs de connexion améliorée

---

## 📝 Fichiers de Référence Créés

- `back/.env.example` - Template pour les variables d'environnement backend
- `project/.env.example` - Template pour les variables d'environnement frontend

---

## 🚨 Problèmes Courants

### "Failed to fetch" ou "NetworkError"
**Solution**: Vérifiez que `VITE_API_URL` est bien configuré dans Vercel

### "CORS error"
**Solution**: Vérifiez que `FRONTEND_URL` dans Railway correspond exactement à votre URL Vercel

### "Backend not accessible"
**Solution**: Vérifiez que le service Railway est en mode **Public Networking**

### "401 Unauthorized"
**Solution**: Le backend fonctionne! Vérifiez vos identifiants de connexion

---

## 📞 Support

Si vous rencontrez toujours des problèmes après avoir suivi ce guide :
1. Vérifiez les logs Railway et Vercel
2. Testez l'endpoint `/api/health` du backend
3. Vérifiez que toutes les variables d'environnement sont correctement configurées

