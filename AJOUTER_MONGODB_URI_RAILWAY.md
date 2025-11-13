# 🔧 Ajouter MONGODB_URI dans Railway - Guide Étape par Étape

## ⚠️ Problème

La variable `MONGODB_URI` n'est **pas définie** dans Railway, donc l'application ne peut pas se connecter à MongoDB Atlas.

## ✅ Solution : Ajouter la Variable

### Étape 1 : Aller dans Railway

1. **Ouvrez Railway** dans votre navigateur
2. **Sélectionnez votre projet** "Guinea-smart-Electricity"
3. **Cliquez sur le service** "Guinea-smart-Electricity" (pas le projet)

### Étape 2 : Accéder aux Variables

1. **Cliquez sur l'onglet "Variables"** (en haut, à côté de Settings)
2. Vous verrez la liste des variables d'environnement

### Étape 3 : Ajouter MONGODB_URI

1. **Cliquez sur "New Variable"** ou **"Add Variable"** (bouton en haut à droite)
2. **Dans le champ "Key"**, tapez exactement : `MONGODB_URI`
   - ⚠️ **Important** : En majuscules, avec underscore
   - ⚠️ **Pas d'espaces** avant ou après
3. **Dans le champ "Value"**, collez :
   ```
   mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
   ```
4. **Cliquez sur "Add"** ou **"Save"**

### Étape 4 : Vérifier

Vous devriez maintenant voir `MONGODB_URI` dans la liste des variables avec la valeur masquée (***).

### Étape 5 : Redéployer

1. **Allez dans l'onglet "Deployments"**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Cliquez sur "Redeploy"** ou **"Restart"**
4. **Attendez 1-2 minutes**

### Étape 6 : Vérifier les Logs

1. **Cliquez sur le nouveau déploiement**
2. **Vérifiez les logs** - vous devriez voir :
   ```
   🔄 Tentative de connexion à MongoDB...
   📍 URI: mongodb+srv://***:***@clusterdw03.wqjnl8l.mongodb.net/...
   ✅ MongoDB connecté avec succès!
   ```

## 📋 Checklist Complète des Variables

Assurez-vous que toutes ces variables existent :

- [ ] **MONGODB_URI** = `mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03`
- [ ] **JWT_SECRET** = (votre secret JWT)
- [ ] **PORT** = `3000` (optionnel)
- [ ] **NODE_ENV** = `production` (recommandé)
- [ ] **FRONTEND_URL** = `https://guinea-smart-electricity.vercel.app`
- [ ] **HUGGINGFACE_API_KEY** = (optionnel, peut être vide)
- [ ] **HUGGINGFACE_MODEL** = `google/flan-t5-large`
- [ ] **SMTP_HOST** = (si vous utilisez l'email)
- [ ] **SMTP_USER** = (si vous utilisez l'email)
- [ ] **SMTP_PASS** = (si vous utilisez l'email)
- [ ] **SMTP_FROM** = (si vous utilisez l'email)
- [ ] **JWT_EXPIRES_IN** = (optionnel, défaut: 24h)

## ⚠️ Erreurs Courantes

1. **Nom incorrect** : `mongodb_uri` ou `MongoDB_URI` au lieu de `MONGODB_URI`
2. **Variable au mauvais niveau** : Vérifiez que c'est au niveau du **service**, pas du projet
3. **Valeur avec espaces** : Pas d'espaces avant ou après la valeur
4. **Oubli de sauvegarder** : Cliquez sur "Add" ou "Save" après avoir entré la valeur

## 🔍 Si Ça Ne Fonctionne Toujours Pas

1. **Vérifiez l'orthographe** : `MONGODB_URI` exactement comme ça
2. **Vérifiez le niveau** : Service, pas Projet
3. **Redéployez** après avoir ajouté la variable
4. **Vérifiez les logs** pour voir si la variable est chargée

---

**Action immédiate** : Allez dans Railway → Variables → Ajoutez `MONGODB_URI` avec la valeur MongoDB Atlas !

