# 🔧 Guide Complet : Ajouter MONGODB_URI dans Railway

## ⚠️ Problème Actuel

La variable `MONGODB_URI` n'est **PAS chargée** dans Railway, donc l'application ne peut pas démarrer.

## ✅ Solution Détaillée

### Étape 1 : Identifier le Bon Niveau

⚠️ **CRITIQUE** : Les variables doivent être au niveau du **SERVICE**, pas du **PROJET** !

1. **Dans Railway**, vous voyez :
   - **Projet** : "Guinea-smart-Electricity" (en haut)
   - **Service** : "Guinea-smart-Electricity" (en dessous)

2. **Cliquez sur le SERVICE** (pas le projet)
   - Le service a des onglets : Deployments, Variables, Metrics, Settings

### Étape 2 : Accéder aux Variables du Service

1. **Cliquez sur l'onglet "Variables"** (en haut, à côté de Settings)
2. Vous verrez une liste de variables d'environnement

### Étape 3 : Vérifier si MONGODB_URI Existe

1. **Cherchez dans la liste** si `MONGODB_URI` existe
2. **Si elle existe** :
   - Vérifiez qu'elle n'a pas d'espaces avant/après
   - Vérifiez que la valeur est correcte
   - **Supprimez-la et recréez-la** si nécessaire

3. **Si elle n'existe pas** :
   - Passez à l'étape 4

### Étape 4 : Ajouter MONGODB_URI

1. **Cliquez sur "New Variable"** ou **"Add Variable"** (bouton en haut à droite)

2. **Dans le formulaire qui apparaît** :
   - **Key** : Tapez exactement `MONGODB_URI`
     - ⚠️ En majuscules
     - ⚠️ Avec underscore (pas de tiret)
     - ⚠️ Pas d'espaces
   
   - **Value** : Collez exactement ceci :
     ```
     mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
     ```
     - ⚠️ Copiez-collez exactement, sans espaces avant/après
     - ⚠️ Vérifiez qu'il n'y a pas de retours à la ligne

3. **Cliquez sur "Add"** ou **"Save"**

### Étape 5 : Vérifier l'Ajout

1. **Dans la liste des variables**, vous devriez voir :
   - `MONGODB_URI` avec la valeur masquée (***)
   - Le nom exactement comme vous l'avez tapé

2. **Si vous ne la voyez pas** :
   - Vérifiez que vous êtes dans l'onglet Variables du SERVICE
   - Rafraîchissez la page
   - Vérifiez l'orthographe

### Étape 6 : Redéployer le Service

⚠️ **OBLIGATOIRE** : Après avoir ajouté/modifié une variable, vous DEVEZ redéployer !

1. **Allez dans l'onglet "Deployments"**
2. **Cliquez sur les 3 points** (⋯) à droite du dernier déploiement
3. **Cliquez sur "Redeploy"** ou **"Restart"**
4. **Attendez 2-3 minutes** pour le redéploiement

### Étape 7 : Vérifier les Logs

1. **Cliquez sur le nouveau déploiement** dans la liste
2. **Ouvrez les logs** (section "Logs" ou "View Logs")
3. **Cherchez ces lignes** :

   ✅ **Si ça fonctionne** :
   ```
   🔄 Tentative de connexion à MongoDB...
   📍 URI: mongodb+srv://***:***@clusterdw03.wqjnl8l.mongodb.net/...
   ✅ MongoDB connecté avec succès!
   ```

   ❌ **Si ça ne fonctionne pas** :
   ```
   ❌ MONGODB_URI n'est pas définie dans les variables d'environnement
   ```

## 🔍 Dépannage

### Problème 1 : La variable n'apparaît pas après ajout

**Solutions** :
- Vérifiez que vous êtes dans le SERVICE, pas le PROJET
- Rafraîchissez la page
- Vérifiez l'orthographe : `MONGODB_URI` exactement
- Supprimez et recréez la variable

### Problème 2 : La variable existe mais n'est pas chargée

**Solutions** :
- Redéployez le service (obligatoire après modification)
- Vérifiez qu'il n'y a pas d'espaces dans le nom ou la valeur
- Vérifiez que la variable est au niveau du SERVICE

### Problème 3 : Erreur de connexion même avec la variable

**Solutions** :
- Vérifiez que l'URI MongoDB est correcte
- Vérifiez que MongoDB Atlas autorise les connexions depuis Railway
- Vérifiez les logs pour voir l'erreur exacte

## 📋 Checklist Finale

- [ ] Je suis dans le SERVICE (pas le projet)
- [ ] J'ai cliqué sur l'onglet "Variables"
- [ ] J'ai ajouté `MONGODB_URI` avec la valeur MongoDB Atlas
- [ ] Le nom est exactement `MONGODB_URI` (majuscules, underscore)
- [ ] La valeur n'a pas d'espaces avant/après
- [ ] J'ai sauvegardé la variable
- [ ] J'ai redéployé le service
- [ ] Les logs montrent "MongoDB connecté avec succès!"

## 🆘 Si Rien Ne Fonctionne

1. **Supprimez toutes les variables** liées à MongoDB
2. **Recréez `MONGODB_URI`** exactement comme indiqué
3. **Redéployez** le service
4. **Vérifiez les logs** immédiatement après le redéploiement

---

**Action immédiate** : 
1. Allez dans Railway → SERVICE → Variables
2. Ajoutez `MONGODB_URI` avec la valeur MongoDB Atlas
3. Redéployez le service
4. Vérifiez les logs

