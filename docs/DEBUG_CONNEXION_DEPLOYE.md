# 🔍 Débogage : Connexion ne Fonctionne pas sur le Déploiement

## 🔍 Checklist de Diagnostic

### 1. Vérifier la Configuration Vercel

**Vérifiez que `VITE_API_URL` est bien configuré** :

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Vérifiez que `VITE_API_URL` existe et contient :
   ```
   https://guinea-smart-electricity-production.up.railway.app
   ```
5. Vérifiez que la variable est activée pour **Production**

⚠️ **IMPORTANT** : Si vous avez ajouté/modifié cette variable, vous DEVEZ redéployer !

---

### 2. Vérifier que le Backend est Accessible

**Testez l'endpoint de santé** :

Ouvrez dans votre navigateur :
```
https://guinea-smart-electricity-production.up.railway.app/api/health
```

**Résultat attendu** :
```json
{
  "status": "Backend running successfully",
  "timestamp": "2024-..."
}
```

✅ **Si vous voyez cela** → Backend fonctionne
❌ **Si erreur 404/500** → Problème backend (vérifiez les logs Railway)

---

### 3. Vérifier la Console du Navigateur

**Ouvrez la console développeur (F12)** sur votre site déployé :

1. Allez sur votre site Vercel
2. Ouvrez la console (F12)
3. Onglet **Console**
4. Essayez de vous connecter
5. Regardez les erreurs

**Erreurs possibles** :

#### A. "Failed to fetch"
```
❌ Failed to fetch
```
**Cause** : Le frontend ne peut pas atteindre le backend
**Solutions** :
- Vérifiez que `VITE_API_URL` est configuré dans Vercel
- Vérifiez que le frontend a été redéployé après avoir ajouté la variable
- Vérifiez que le backend est accessible (testez `/api/health`)

#### B. "CORS error"
```
❌ CORS policy: No 'Access-Control-Allow-Origin' header
```
**Cause** : Le backend bloque les requêtes CORS
**Solutions** :
- Vérifiez que `FRONTEND_URL` est configuré dans Railway
- Vérifiez que `FRONTEND_URL` correspond EXACTEMENT à votre URL Vercel
- Redéployez le backend après modification

#### C. "401 Unauthorized"
```
❌ 401 Unauthorized
```
**Cause** : Identifiants incorrects OU utilisateur n'existe pas
**Solutions** :
- Vérifiez que l'utilisateur existe dans la base de données
- Vérifiez les identifiants (email et mot de passe)
- Créez un utilisateur si nécessaire

#### D. "429 Too Many Requests"
```
❌ 429 Too Many Requests
```
**Cause** : Trop de tentatives de connexion
**Solutions** :
- Attendez 15 minutes
- OU utilisez un autre réseau/VPN

---

### 4. Vérifier l'Onglet Network

**Dans la console développeur (F12)** :

1. Onglet **Network**
2. Essayez de vous connecter
3. Filtrez par `railway.app`
4. Regardez les requêtes

**Vérifications** :

✅ **Requête vers le backend** :
- URL : `https://guinea-smart-electricity-production.up.railway.app/api/auth/login`
- Méthode : `POST`
- Status : `200` (succès) ou `401` (identifiants incorrects)

❌ **Pas de requête** :
- Vérifiez que `VITE_API_URL` est configuré
- Vérifiez que le frontend a été redéployé

❌ **Requête échoue** :
- Status : `0` ou `Failed` → Problème de connexion
- Status : `CORS` → Problème CORS
- Status : `404` → Route backend incorrecte

---

### 5. Vérifier les Logs Railway

**Dans Railway Dashboard** :

1. Allez sur [Railway Dashboard](https://railway.app)
2. Sélectionnez votre service backend
3. **Deployments** → Dernier déploiement → **Logs**
4. Regardez les logs pendant une tentative de connexion

**Vérifications** :

✅ **Logs normaux** :
```
🚀 Serveur démarré sur le port 3000
✅ MongoDB connecté avec succès!
POST /api/auth/login 200
```

❌ **Erreurs** :
- `MongoDB connection failed` → Vérifiez `MONGODB_URI`
- `CORS error` → Vérifiez `FRONTEND_URL`
- `JWT_SECRET missing` → Vérifiez les variables d'environnement

---

### 6. Vérifier les Variables d'Environnement Railway

**Dans Railway → Votre service → Variables** :

Vérifiez que vous avez :

```
✅ MONGODB_URI = mongodb+srv://...
✅ JWT_SECRET = (changé, pas la valeur par défaut)
✅ JWT_EXPIRES_IN = 24h
✅ NODE_ENV = production
✅ PORT = 3000
✅ FRONTEND_URL = https://guinea-smart-electricity.vercel.app
```

⚠️ **Important** :
- `FRONTEND_URL` doit correspondre EXACTEMENT à votre URL Vercel
- L'URL doit commencer par `https://`
- L'URL ne doit PAS se terminer par `/`

---

## 🚨 Problèmes Courants et Solutions

### Problème 1 : "Failed to fetch"

**Symptômes** :
- Console : `Failed to fetch`
- Network : Status `0` ou `Failed`

**Solutions** :
1. Vérifiez `VITE_API_URL` dans Vercel
2. Redéployez le frontend
3. Vérifiez que le backend est accessible (`/api/health`)

---

### Problème 2 : Erreur CORS

**Symptômes** :
- Console : `CORS policy: No 'Access-Control-Allow-Origin' header`
- Network : Status `CORS error`

**Solutions** :
1. Vérifiez `FRONTEND_URL` dans Railway
2. Assurez-vous que l'URL correspond EXACTEMENT à votre URL Vercel
3. Redéployez le backend

---

### Problème 3 : 401 Unauthorized

**Symptômes** :
- Console : `401 Unauthorized`
- Network : Status `401`

**Solutions** :
1. Vérifiez que l'utilisateur existe
2. Vérifiez les identifiants
3. Créez un utilisateur si nécessaire

---

### Problème 4 : 429 Too Many Requests

**Symptômes** :
- Console : `429 Too Many Requests`
- Network : Status `429`

**Solutions** :
1. Attendez 15 minutes
2. OU utilisez un autre réseau/VPN

---

## 🔧 Actions Correctives

### Étape 1 : Vérifier la Configuration

```bash
# Vérifiez dans Vercel
VITE_API_URL = https://guinea-smart-electricity-production.up.railway.app

# Vérifiez dans Railway
FRONTEND_URL = https://guinea-smart-electricity.vercel.app
```

### Étape 2 : Redéployer

**Frontend (Vercel)** :
1. Vercel → Votre projet → **Deployments**
2. Cliquez sur les 3 points (⋯) → **Redeploy**

**Backend (Railway)** :
1. Railway → Votre service → **Deployments**
2. Cliquez sur les 3 points (⋯) → **Redeploy**

### Étape 3 : Tester

1. Ouvrez votre site Vercel
2. Ouvrez la console (F12)
3. Essayez de vous connecter
4. Vérifiez les erreurs dans la console et l'onglet Network

---

## 📊 Diagnostic Rapide

**Test en 30 secondes** :

1. **Backend** : `https://guinea-smart-electricity-production.up.railway.app/api/health`
   - ✅ Si réponse JSON → Backend OK
   - ❌ Si erreur → Problème backend

2. **Frontend** : Ouvrez votre site Vercel
   - ✅ Si site s'affiche → Frontend OK
   - ❌ Si erreur 404 → Problème frontend

3. **Console** : F12 → Network → Essayez de vous connecter
   - ✅ Si requêtes vers railway.app → Communication OK
   - ❌ Si "Failed to fetch" → Problème de configuration

---

## 🎯 Résumé

**Si la connexion ne fonctionne pas** :

1. ✅ Vérifiez `VITE_API_URL` dans Vercel
2. ✅ Vérifiez `FRONTEND_URL` dans Railway
3. ✅ Redéployez frontend et backend
4. ✅ Testez `/api/health` du backend
5. ✅ Vérifiez la console du navigateur (F12)
6. ✅ Vérifiez les logs Railway

**Une fois ces vérifications faites, la connexion devrait fonctionner !** 🚀

