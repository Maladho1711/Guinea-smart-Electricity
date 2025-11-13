# ⚠️ Vérifier les Variables d'Environnement Railway

## ❌ Problème

L'application essaie de se connecter à `localhost` au lieu de MongoDB Atlas, ce qui signifie que la variable `MONGODB_URI` n'est **pas chargée** dans Railway.

## ✅ Solution : Vérifier les Variables dans Railway

### Étape 1 : Vérifier les Variables

1. **Allez dans Railway** → Votre service
2. **Cliquez sur l'onglet "Variables"** (en haut)
3. **Vérifiez que `MONGODB_URI` existe** et contient :
   ```
   mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
   ```

### Étape 2 : Si la Variable n'Existe Pas

1. **Cliquez sur "New Variable"** ou **"Add Variable"**
2. **Key** : `MONGODB_URI`
3. **Value** : `mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03`
4. **Sauvegardez**

### Étape 3 : Vérifier le Nom de la Variable

⚠️ **Important** : Assurez-vous que le nom est exactement **`MONGODB_URI`** (en majuscules, avec underscore).

### Étape 4 : Redémarrer le Service

1. **Allez dans "Deployments"**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Cliquez sur "Redeploy"** ou **"Restart"**

## 📋 Checklist des Variables Requises

Vérifiez que toutes ces variables existent dans Railway :

- [ ] `MONGODB_URI` = `mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03`
- [ ] `JWT_SECRET` = (votre secret)
- [ ] `PORT` = `3000` (optionnel, défaut)
- [ ] `NODE_ENV` = `production` (recommandé)
- [ ] `FRONTEND_URL` = `https://guinea-smart-electricity.vercel.app`
- [ ] `HUGGINGFACE_API_KEY` = (optionnel)
- [ ] `HUGGINGFACE_MODEL` = `google/flan-t5-large`
- [ ] `SMTP_HOST` = (si vous utilisez l'email)
- [ ] `SMTP_USER` = (si vous utilisez l'email)
- [ ] `SMTP_PASS` = (si vous utilisez l'email)
- [ ] `SMTP_FROM` = (si vous utilisez l'email)

## 🔍 Vérifier les Logs

Après avoir ajouté/modifié `MONGODB_URI`, vérifiez les logs :

1. **Deployments** → Cliquez sur le dernier déploiement
2. **Vérifiez les logs** - vous devriez voir :
   ```
   🔄 Tentative de connexion à MongoDB...
   📍 URI: mongodb+srv://***:***@clusterdw03.wqjnl8l.mongodb.net/...
   ✅ MongoDB connecté avec succès!
   ```

Si vous voyez toujours `localhost`, la variable n'est pas chargée.

---

**Action immédiate** : Vérifiez que `MONGODB_URI` existe dans Railway → Variables !

