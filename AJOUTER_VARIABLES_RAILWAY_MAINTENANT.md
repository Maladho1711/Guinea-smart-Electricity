# 🚀 Ajouter les Variables d'Environnement dans Railway - MAINTENANT

## ✅ Vous êtes au Bon Endroit !

Vous êtes dans **Service Variables** - c'est exactement là où il faut ajouter les variables !

## 📋 Variables à Ajouter (Une par Une)

### Variable 1 : MONGODB_URI (CRITIQUE)

1. **Cliquez sur "New Variable"** (bouton en haut à droite)
2. **Key** : `MONGODB_URI`
3. **Value** : `mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03`
4. **Cliquez sur "Add"**

### Variable 2 : JWT_SECRET

1. **Cliquez sur "New Variable"**
2. **Key** : `JWT_SECRET`
3. **Value** : (générez avec PowerShell - voir ci-dessous)
4. **Cliquez sur "Add"**

**Générer JWT_SECRET** (PowerShell) :
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Variable 3 : PORT

1. **Cliquez sur "New Variable"**
2. **Key** : `PORT`
3. **Value** : `3000`
4. **Cliquez sur "Add"**

### Variable 4 : NODE_ENV

1. **Cliquez sur "New Variable"**
2. **Key** : `NODE_ENV`
3. **Value** : `production`
4. **Cliquez sur "Add"**

### Variable 5 : FRONTEND_URL

1. **Cliquez sur "New Variable"**
2. **Key** : `FRONTEND_URL`
3. **Value** : `https://guinea-smart-electricity.vercel.app`
4. **Cliquez sur "Add"**

### Variable 6 : HUGGINGFACE_MODEL

1. **Cliquez sur "New Variable"**
2. **Key** : `HUGGINGFACE_MODEL`
3. **Value** : `google/flan-t5-large`
4. **Cliquez sur "Add"**

### Variable 7 : HUGGINGFACE_API_KEY (Optionnel)

1. **Cliquez sur "New Variable"**
2. **Key** : `HUGGINGFACE_API_KEY`
3. **Value** : (laissez vide si vous n'avez pas de token)
4. **Cliquez sur "Add"**

## ⚠️ Variables SMTP (Si Vous Utilisez l'Email)

Si vous avez déjà configuré ces variables, ajoutez-les aussi :

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `JWT_EXPIRES_IN`

## ✅ Après Avoir Ajouté Toutes les Variables

1. **Allez dans l'onglet "Deployments"**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Attendez 2-3 minutes**

## 🔍 Vérifier les Logs

1. **Cliquez sur le nouveau déploiement**
2. **Vérifiez les logs** - vous devriez voir :
   ```
   🔄 Tentative de connexion à MongoDB...
   📍 URI: mongodb+srv://***:***@clusterdw03.wqjnl8l.mongodb.net/...
   ✅ MongoDB connecté avec succès!
   🚀 Serveur démarré sur le port 3000
   ```

## 📋 Checklist

- [ ] MONGODB_URI ajoutée
- [ ] JWT_SECRET ajoutée
- [ ] PORT ajoutée (optionnel)
- [ ] NODE_ENV ajoutée
- [ ] FRONTEND_URL ajoutée
- [ ] HUGGINGFACE_MODEL ajoutée
- [ ] Service redéployé
- [ ] Logs vérifiés

---

**Action immédiate** : Cliquez sur "New Variable" et ajoutez `MONGODB_URI` en premier !

