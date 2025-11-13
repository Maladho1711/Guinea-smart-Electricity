# 🗑️ Guide Étape par Étape : Supprimer le Doublon Vercel

## 🎯 Objectif

Supprimer le projet **"électricité intelligente de Guinée-mrxb"** et garder uniquement **"électricité intelligente de Guinée"**.

## 📋 Étapes Détaillées

### Étape 1 : Accéder au Dashboard Vercel

1. Ouvrez votre navigateur
2. Allez sur : **[vercel.com/dashboard](https://vercel.com/dashboard)**
3. Connectez-vous si nécessaire

### Étape 2 : Trouver le Projet à Supprimer

1. Dans la liste des projets, trouvez : **"électricité intelligente de Guinée-mrxb"**
2. Cliquez dessus pour l'ouvrir

### Étape 3 : Accéder aux Settings

1. En haut à droite de la page du projet, cliquez sur **"Settings"** (Paramètres)
2. Vous verrez plusieurs onglets : General, Domains, Environment Variables, etc.

### Étape 4 : Supprimer le Projet

1. Dans le menu de gauche, scroll jusqu'en bas
2. Trouvez la section **"Danger Zone"** (Zone de danger - en rouge)
3. Cliquez sur **"Delete Project"** (Supprimer le projet)
4. Une fenêtre de confirmation apparaîtra
5. Tapez le nom exact du projet : **"électricité intelligente de Guinée-mrxb"**
6. Cliquez sur **"Delete"** (Supprimer) ou **"Confirm"** (Confirmer)

⚠️ **ATTENTION** : Cette action est irréversible !

### Étape 5 : Vérifier le Projet Restant

1. Retournez au dashboard Vercel
2. Cliquez sur **"électricité intelligente de Guinée"** (le projet principal)
3. Cliquez sur **"Settings"** → **"General"**
4. Vérifiez la section **"Root Directory"** :
   - ✅ Si c'est `project` → Parfait !
   - ❌ Si c'est vide ou `/` → Cliquez **"Edit"** → Tapez `project` → **"Save"**

### Étape 6 : Vérifier les Build Settings

Dans **Settings** → **General** → **Build & Development Settings**, vérifiez :

- **Framework Preset** : `Vite` (ou auto-détecté)
- **Build Command** : `npm install --legacy-peer-deps && npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install --legacy-peer-deps`

Si ces valeurs ne sont pas correctes, modifiez-les et sauvegardez.

### Étape 7 : Redéployer

1. Allez dans l'onglet **"Deployments"** (Déploiements)
2. Trouvez le dernier déploiement
3. Cliquez sur les **3 points** (⋯) à droite
4. Sélectionnez **"Redeploy"** (Redéployer)
5. Confirmez le redéploiement
6. Attendez 3-5 minutes que le déploiement se termine

### Étape 8 : Tester

Une fois le déploiement terminé, testez :

1. **Page d'accueil** : `https://guinea-smart-electricity.vercel.app/`
   - ✅ Doit afficher la landing page
   - ❌ Si 404 → Vérifiez le Root Directory

2. **Route FAQ** : `https://guinea-smart-electricity.vercel.app/faq`
   - ✅ Doit afficher la FAQ
   - ❌ Si 404 → Vérifiez les rewrites dans vercel.json

## ✅ Checklist de Vérification

Après avoir supprimé le doublon, vérifiez :

- [ ] Un seul projet Vercel reste dans votre dashboard
- [ ] Le projet restant a Root Directory = `project`
- [ ] Build Command = `npm install --legacy-peer-deps && npm run build`
- [ ] Output Directory = `dist`
- [ ] Redéploiement effectué
- [ ] L'URL `guinea-smart-electricity.vercel.app` fonctionne
- [ ] Pas d'erreur 404

## 🎯 Résultat Attendu

Après ces étapes :
- ✅ Un seul projet Vercel actif
- ✅ Configuration correcte (Root Directory = `project`)
- ✅ Application accessible sans erreur 404
- ✅ Toutes les routes fonctionnent

## 🆘 Si Vous Ne Trouvez Pas l'Option de Suppression

1. Vérifiez que vous êtes bien connecté avec le bon compte
2. Vérifiez que vous avez les permissions d'administrateur sur le projet
3. Essayez de cliquer directement sur le nom du projet dans le dashboard
4. La section "Danger Zone" est toujours en bas de la page Settings

## 📞 Si le Problème Persiste

Si après avoir supprimé le doublon et configuré correctement, vous avez toujours une erreur 404 :

1. Vérifiez les **Build Logs** dans Vercel
2. Vérifiez que le **Root Directory** est bien `project`
3. Vérifiez que le build se termine avec succès
4. Contactez le support Vercel si nécessaire

---

**Note** : Cette action supprime définitivement le projet. Assurez-vous de supprimer le bon projet (le doublon, pas le principal).

