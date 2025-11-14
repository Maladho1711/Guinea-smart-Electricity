# ✅ Vérification de la Configuration

## Configuration Vercel - VITE_API_URL

✅ **Variable configurée correctement** :
```
VITE_API_URL = https://guinea-smart-electricity-production.up.railway.app
```

### Points à vérifier :

1. ✅ L'URL commence par `https://` - **CORRECT**
2. ✅ L'URL ne se termine pas par `/` - **CORRECT**
3. ⏳ **IMPORTANT** : Assurez-vous que cette variable est activée pour **Production** (et Preview si nécessaire)

---

## 🔍 Étapes de Vérification

### 1. Vérifier que le Backend est Accessible

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

Si vous voyez cette réponse → ✅ Le backend fonctionne !

Si vous voyez une erreur → Vérifiez les logs Railway.

---

### 2. Redéployer le Frontend sur Vercel

⚠️ **CRITIQUE** : Après avoir ajouté/modifié une variable d'environnement, vous devez redéployer !

**Options** :
- **Option A** : Aller dans Vercel → Votre projet → **Deployments** → Cliquer sur les 3 points (⋯) → **Redeploy**
- **Option B** : Faire un commit vide et push (si connecté à Git)
  ```bash
  git commit --allow-empty -m "Trigger redeploy for VITE_API_URL"
  git push
  ```

---

### 3. Vérifier la Configuration Railway

Dans Railway, vérifiez que vous avez configuré :

```
FRONTEND_URL = https://votre-site.vercel.app
```

**Important** : Remplacez `votre-site.vercel.app` par l'URL réelle de votre frontend Vercel.

**Comment trouver votre URL Vercel** :
1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquez sur votre projet
3. L'URL est affichée en haut (ex: `guinea-smart-electricity.vercel.app`)
4. Utilisez : `https://guinea-smart-electricity.vercel.app`

---

### 4. Vérifier les Variables Railway

Dans Railway → Votre service → **Variables**, vous devriez avoir :

```
✅ MONGODB_URI = mongodb+srv://...
✅ JWT_SECRET = votre_secret_changez_moi
✅ JWT_EXPIRES_IN = 24h
✅ NODE_ENV = production
✅ PORT = 3000
✅ FRONTEND_URL = https://guinea-smart-electricity.vercel.app
```

---

## 🧪 Test Final

### Test 1 : Backend Health Check
```
https://guinea-smart-electricity-production.up.railway.app/api/health
```
→ Doit retourner `{"status": "Backend running successfully", ...}`

### Test 2 : Frontend → Backend
1. Ouvrez votre site Vercel
2. Ouvrez la console développeur (F12)
3. Essayez de vous connecter
4. Vérifiez la console :
   - ✅ Si vous voyez des requêtes vers `guinea-smart-electricity-production.up.railway.app` → Ça fonctionne !
   - ❌ Si vous voyez `Failed to fetch` → Vérifiez que le frontend a été redéployé
   - ❌ Si vous voyez `CORS error` → Vérifiez `FRONTEND_URL` dans Railway

---

## 🚨 Problèmes Courants

### "Failed to fetch" après configuration
**Solution** : Redéployez le frontend sur Vercel (les variables d'environnement ne sont prises en compte qu'au build)

### "CORS error"
**Solution** : Vérifiez que `FRONTEND_URL` dans Railway correspond exactement à votre URL Vercel (avec `https://`)

### Backend ne répond pas
**Solution** : 
1. Vérifiez les logs Railway
2. Vérifiez que le service est démarré
3. Vérifiez que Public Networking est activé

---

## ✅ Checklist Finale

- [ ] `VITE_API_URL` configuré dans Vercel avec la bonne URL
- [ ] Variable activée pour **Production** (et Preview si nécessaire)
- [ ] Frontend redéployé après ajout de la variable
- [ ] Backend accessible via `/api/health`
- [ ] `FRONTEND_URL` configuré dans Railway avec l'URL Vercel
- [ ] `NODE_ENV=production` dans Railway
- [ ] Test de connexion depuis le frontend réussi

---

**Une fois tout vérifié, votre application devrait fonctionner depuis n'importe quelle machine ! 🎉**

