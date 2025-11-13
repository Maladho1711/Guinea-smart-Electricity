# 🎯 Railway : Projet vs Service - Où Configurer

## ⚠️ Important : Vous êtes dans les Settings du PROJET

Vous voyez "Project Settings" (Settings du projet). Le **Root Directory** se configure dans les **Settings du SERVICE**, pas du projet.

## 📍 Comment Accéder aux Settings du Service

### Étape 1 : Retourner au Dashboard

1. **Cliquez sur le nom du projet** en haut à gauche : "Guinea Smart electricity"
2. OU cliquez sur **"← Back"** ou l'icône de retour
3. Vous devriez voir la liste des **Services** dans votre projet

### Étape 2 : Trouver le Service

1. Dans votre projet, vous devriez voir un **Service** (une carte/boîte)
2. Le service peut s'appeler :
   - Le nom de votre repo : `Guinea-smart-Electricity`
   - Ou un nom généré automatiquement
3. **Cliquez sur ce SERVICE** (pas sur le projet)

### Étape 3 : Accéder aux Settings du Service

1. Une fois dans le service, vous verrez plusieurs onglets :
   - **Deployments**
   - **Metrics**
   - **Variables**
   - **Settings** ← **C'EST ICI !**
2. **Cliquez sur "Settings"** du SERVICE (pas du projet)

### Étape 4 : Trouver Root Directory

Dans **Settings du SERVICE**, vous devriez voir :
- **Source** ou **Repository**
- **Root Directory** ← **C'EST ICI !**

## 🎯 Structure Railway

```
Projet "Guinea Smart electricity"
  └── Service (votre backend)
      └── Settings du Service ← Root Directory est ici
          ├── Source/Repository
          ├── Build
          ├── Deploy
          └── Root Directory ← ICI !
```

## ✅ Action Immédiate

1. **Retournez au dashboard du projet**
2. **Cliquez sur le SERVICE** (la carte du service)
3. **Cliquez sur "Settings"** (du service, pas du projet)
4. **Cherchez "Root Directory"** dans Source/Repository
5. **Tapez** : `/back`

## 🔍 Si Vous Ne Voyez Pas de Service

Si vous ne voyez pas de service dans votre projet :

1. Dans le projet, cliquez sur **"New"** ou **"+"**
2. Sélectionnez **"GitHub Repo"**
3. Choisissez `Guinea-smart-Electricity`
4. Railway créera un service
5. Ensuite, allez dans **Settings du SERVICE** pour configurer Root Directory

---

**Résumé** : Vous êtes dans Settings du PROJET. Il faut aller dans Settings du SERVICE pour trouver Root Directory.

