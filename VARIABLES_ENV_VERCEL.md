# 🔐 Variables d'Environnement Vercel

## 📋 Variables à Ajouter

### Variable 1 : VITE_API_URL (Pour le Frontend)

**Key** : `VITE_API_URL`

**Value** : 
- **Pour l'instant** (si Railway n'est pas encore déployé) : `http://localhost:3000`
- **Après déploiement Railway** : `https://votre-backend.up.railway.app`

**Exemple** :
```
Key: VITE_API_URL
Value: http://localhost:3000
```

## ⚠️ Note Importante

Si votre backend Railway n'est pas encore déployé :
1. Ajoutez `VITE_API_URL` avec la valeur `http://localhost:3000` pour l'instant
2. **Après** avoir déployé Railway et obtenu l'URL, vous pourrez modifier cette valeur dans Vercel Settings → Environment Variables

## 📝 Comment Ajouter

1. Dans le champ **Key**, tapez : `VITE_API_URL`
2. Dans le champ **Value**, tapez : `http://localhost:3000` (temporaire)
3. Cliquez sur **Add** ou **Save**

## 🔄 Mise à Jour Plus Tard

Une fois Railway déployé :
1. Allez dans Vercel → Votre projet → **Settings** → **Environment Variables**
2. Trouvez `VITE_API_URL`
3. Cliquez **Edit**
4. Changez la valeur en : `https://votre-backend-railway.up.railway.app`
5. **Redeploy** le projet

## ✅ Autres Variables (Optionnelles)

Vous pouvez aussi ajouter d'autres variables si nécessaire, mais `VITE_API_URL` est la principale pour le frontend.

---

**Action** : Ajoutez `VITE_API_URL` avec la valeur `http://localhost:3000` pour l'instant.

