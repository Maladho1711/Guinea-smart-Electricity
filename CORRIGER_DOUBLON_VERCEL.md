# 🔧 Solution : Problème de Doublon Vercel

## ⚠️ Problème Identifié

Vous avez **DEUX projets Vercel** qui pointent vers le même repository GitHub :

1. **"électricité intelligente de Guinée-mrxb"**
   - URL : `guinea-smart-electricity-mrxb.vercel.app`
   - Repo : `Maladho1711/Guinée-smart-Electricité`

2. **"électricité intelligente de Guinée"**
   - URL : `guinea-smart-electricity.vercel.app`
   - Repo : `Maladho1711/Guinée-smart-Electricité`

## ✅ Solution : Garder UN Seul Projet

### Option 1 : Garder le Projet Principal (Recommandé)

1. **Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)**

2. **Supprimez le projet en double** :
   - Cliquez sur **"électricité intelligente de Guinée-mrxb"** (ou l'autre)
   - **Settings** → **General**
   - Scroll en bas → **Delete Project**
   - Confirmez la suppression

3. **Vérifiez la configuration du projet restant** :
   - Cliquez sur **"électricité intelligente de Guinée"** (le projet principal)
   - **Settings** → **General**
   - Vérifiez **Root Directory** = `project`
   - Si vide → **Edit** → Tapez `project` → **Save**

4. **Redéployez** :
   - **Deployments** → Dernier déploiement → **3 points** (⋯) → **Redeploy**

### Option 2 : Configurer Correctement les Deux (Si vous voulez les garder)

Si vous voulez garder les deux projets (par exemple pour tester), configurez-les correctement :

#### Projet 1 : "électricité intelligente de Guinée"
1. **Settings** → **General**
2. **Root Directory** : `project`
3. **Build Command** : `npm install --legacy-peer-deps && npm run build`
4. **Output Directory** : `dist`
5. **Install Command** : `npm install --legacy-peer-deps`

#### Projet 2 : "électricité intelligente de Guinée-mrxb"
1. **Settings** → **General**
2. **Root Directory** : `project`
3. **Build Command** : `npm install --legacy-peer-deps && npm run build`
4. **Output Directory** : `dist`
5. **Install Command** : `npm install --legacy-peer-deps`

## 🎯 Action Recommandée

**Je recommande de SUPPRIMER le projet "électricité intelligente de Guinée-mrxb"** et de garder seulement **"électricité intelligente de Guinée"** car :

- ✅ C'est le projet principal
- ✅ URL plus simple : `guinea-smart-electricity.vercel.app`
- ✅ Évite les conflits et confusions

## 📋 Étapes Détaillées pour Supprimer le Doublon

1. **Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)**

2. **Trouvez le projet à supprimer** :
   - Cherchez **"électricité intelligente de Guinée-mrxb"**

3. **Ouvrez les Settings** :
   - Cliquez sur le projet
   - Cliquez sur **Settings** (en haut à droite)

4. **Supprimez le projet** :
   - Scroll jusqu'en bas de la page
   - Section **Danger Zone**
   - Cliquez sur **Delete Project**
   - Tapez le nom du projet pour confirmer
   - Cliquez **Delete**

5. **Vérifiez le projet restant** :
   - Retournez au dashboard
   - Cliquez sur **"électricité intelligente de Guinée"**
   - **Settings** → **General**
   - **Root Directory** : Doit être `project`
   - Si vide → Configurez-le

6. **Redéployez** :
   - **Deployments** → **Redeploy**

## ✅ Après Correction

Testez l'URL du projet restant :
- `https://guinea-smart-electricity.vercel.app/` → Doit fonctionner
- `https://guinea-smart-electricity.vercel.app/faq` → Doit fonctionner

## 🔍 Pourquoi Ce Problème ?

Cela arrive souvent quand :
- Le projet a été créé plusieurs fois par erreur
- Un projet a été dupliqué
- La configuration initiale n'était pas correcte

## 📝 Note

Après avoir supprimé le doublon et configuré correctement le projet restant, l'erreur 404 devrait disparaître.

