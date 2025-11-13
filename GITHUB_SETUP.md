# Guide pour publier sur GitHub

## 📋 Étapes pour publier votre code sur GitHub

### 1. Créer un dépôt sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite
3. Sélectionnez **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `guinea-smart-electricity` (ou le nom de votre choix)
   - **Description** : "Plateforme de gestion énergétique pour la Guinée"
   - **Visibility** : Public ou Private (selon votre préférence)
   - **NE PAS** cocher "Initialize this repository with a README" (nous avons déjà un README)
5. Cliquez sur **"Create repository"**

### 2. Connecter votre dépôt local à GitHub

Une fois le dépôt créé sur GitHub, vous verrez des instructions. Exécutez ces commandes dans votre terminal :

```bash
# Ajouter le remote GitHub (remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/guinea-smart-electricity.git

# Vérifier que le remote a été ajouté
git remote -v

# Pousser le code vers GitHub
git branch -M main
git push -u origin main
```

### 3. Vérification

Après avoir poussé le code, rafraîchissez la page GitHub. Vous devriez voir tous vos fichiers.

## 🔒 Fichiers sécurisés

Les fichiers suivants sont **automatiquement ignorés** par Git (grâce au `.gitignore`) :

- ✅ `.env` - Variables d'environnement (ne seront JAMAIS commitées)
- ✅ `node_modules/` - Dépendances npm
- ✅ `dist/` - Fichiers compilés
- ✅ Fichiers de logs
- ✅ Fichiers temporaires

## ⚠️ Important : Avant de pousser

Assurez-vous que :

1. ✅ Aucun fichier `.env` n'est dans le dépôt (vérifié automatiquement par `.gitignore`)
2. ✅ Tous les mots de passe et clés API sont dans `.env` (pas dans le code)
3. ✅ Le fichier `.env.example` est présent pour documenter les variables nécessaires

## 📝 Commandes Git utiles

```bash
# Voir l'état des fichiers
git status

# Ajouter tous les fichiers modifiés
git add .

# Créer un commit
git commit -m "Description des modifications"

# Pousser vers GitHub
git push origin main

# Récupérer les dernières modifications
git pull origin main
```

## 🎉 C'est fait !

Votre code est maintenant sur GitHub et peut être partagé avec d'autres développeurs.

