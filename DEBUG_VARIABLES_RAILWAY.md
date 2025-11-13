# 🔍 Debug Variables Railway

## ✅ Modifications Apportées

J'ai ajouté des **logs de debug** pour voir quelles variables d'environnement sont disponibles dans Railway.

## 🔄 Prochaines Étapes

1. **Railway va détecter le nouveau commit** et redéployer automatiquement
2. **Vérifiez les logs** du nouveau déploiement
3. **Vous verrez** quelles variables sont disponibles

## 📋 Ce Que Vous Devriez Voir dans les Logs

### ✅ Si les Variables Sont Chargées

```
🔍 Variables d'environnement disponibles:
   MONGODB_URI: ✅ définie
   JWT_SECRET: ✅ définie
   PORT: ✅ définie
   NODE_ENV: ✅ définie
🔄 Tentative de connexion à MongoDB...
📍 URI: mongodb+srv://***:***@clusterdw03.wqjnl8l.mongodb.net/...
✅ MongoDB connecté avec succès!
```

### ❌ Si les Variables Ne Sont Pas Chargées

```
🔍 Variables d'environnement disponibles:
   MONGODB_URI: ❌ non définie
   JWT_SECRET: ❌ non définie
   PORT: ❌ non définie
   NODE_ENV: ❌ non définie
❌ MONGODB_URI n'est pas définie dans les variables d'environnement
💡 Variables disponibles: RAILWAY_PRIVATE_DOMAIN, RAILWAY_PROJECT_NAME, ...
```

## 🔧 Si les Variables Ne Sont Toujours Pas Chargées

### Vérification 1 : Niveau des Variables

1. **Allez dans Railway** → Votre service
2. **Onglet "Variables"**
3. **Vérifiez** que les variables sont dans **"Service Variables"** (pas "Shared Variables")

### Vérification 2 : Redéploiement Complet

1. **Allez dans "Deployments"**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Attendez 2-3 minutes**

### Vérification 3 : Supprimer et Recréer

1. **Supprimez toutes les variables** MongoDB/JWT
2. **Recréez-les une par une**
3. **Redéployez** après chaque ajout

### Vérification 4 : Vérifier l'Orthographe

Assurez-vous que le nom est exactement :
- `MONGODB_URI` (pas `MONGODB_URL` ou `MONGO_URI`)
- Pas d'espaces avant/après
- En majuscules

---

**Action** : Attendez que Railway redéploie, puis vérifiez les logs pour voir quelles variables sont disponibles !

