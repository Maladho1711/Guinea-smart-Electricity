# 📋 Variables Railway - Liste Complète à Ajouter

## 🚀 Instructions Rapides

1. **Allez dans Railway** → Votre service → Onglet "Variables"
2. **Cliquez sur "New Variable"** pour chaque variable
3. **Copiez-collez** exactement comme indiqué ci-dessous
4. **Cliquez sur "Add"** après chaque variable

---

## ✅ Variable 1 : MONGODB_URI (CRITIQUE - À AJOUTER EN PREMIER)

**Key** :
```
MONGODB_URI
```

**Value** :
```
mongodb+srv://maladhob5:Kadiatou2@clusterdw03.wqjnl8l.mongodb.net/?appName=ClusterDW03
```

---

## ✅ Variable 2 : JWT_SECRET

**Key** :
```
JWT_SECRET
```

**Value** :
```
oWI67nNZoLT0x4vTy9HRmGoSS8Wc4kmBzpHbpqRU4Fg=
```

---

## ✅ Variable 3 : PORT

**Key** :
```
PORT
```

**Value** :
```
3000
```

---

## ✅ Variable 4 : NODE_ENV

**Key** :
```
NODE_ENV
```

**Value** :
```
production
```

---

## ✅ Variable 5 : FRONTEND_URL

**Key** :
```
FRONTEND_URL
```

**Value** :
```
https://guinea-smart-electricity.vercel.app
```

---

## ✅ Variable 6 : HUGGINGFACE_MODEL

**Key** :
```
HUGGINGFACE_MODEL
```

**Value** :
```
google/flan-t5-large
```

---

## ✅ Variable 7 : HUGGINGFACE_API_KEY (Optionnel)

**Key** :
```
HUGGINGFACE_API_KEY
```

**Value** :
```
[laissez vide ou mettez votre token si vous en avez un]
```

---

## 📋 Checklist d'Ajout

- [ ] 1. MONGODB_URI ajoutée
- [ ] 2. JWT_SECRET ajoutée
- [ ] 3. PORT ajoutée
- [ ] 4. NODE_ENV ajoutée
- [ ] 5. FRONTEND_URL ajoutée
- [ ] 6. HUGGINGFACE_MODEL ajoutée
- [ ] 7. HUGGINGFACE_API_KEY ajoutée (optionnel)

---

## 🚀 Après Avoir Ajouté Toutes les Variables

1. **Allez dans l'onglet "Deployments"**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Cliquez sur "Redeploy"**
4. **Attendez 2-3 minutes**

---

## 🔍 Vérifier les Logs

Après le redéploiement, vérifiez les logs. Vous devriez voir :

```
🔄 Tentative de connexion à MongoDB...
📍 URI: mongodb+srv://***:***@clusterdw03.wqjnl8l.mongodb.net/...
✅ MongoDB connecté avec succès!
🚀 Serveur démarré sur le port 3000
```

---

**Action** : Commencez par ajouter `MONGODB_URI` en premier, puis les autres une par une !

