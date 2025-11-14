# 👤 Créer un Utilisateur en Production

## ✅ Votre Déploiement Fonctionne !

D'après les logs, votre déploiement est **100% fonctionnel** :
- ✅ Frontend communique avec le backend
- ✅ Backend répond correctement
- ✅ Le problème est juste que l'utilisateur n'existe pas ou les identifiants sont incorrects

---

## 🔧 Solution : Créer un Utilisateur

### Option 1 : Via Script Railway (Recommandé)

#### Étape 1 : Créer un Script Temporaire

Créez un fichier `createUserProduction.ts` dans `back/src/scripts/` :

```typescript
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { createUser } from '../models/userModel';
import bcrypt from 'bcryptjs';

// Charger les variables d'environnement
dotenv.config();

const createUserProduction = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    console.log('✅ Connecté à MongoDB');

    // Données de l'utilisateur
    const email = 'maladho1711@gmail.com';
    const password = 'VotreMotDePasse123!'; // Changez ce mot de passe
    const role = 'citoyen';

    // Vérifier si l'utilisateur existe déjà
    const { getUserByEmail } = await import('../models/userModel');
    const existingUser = await getUserByEmail(email.toLowerCase(), role);
    
    if (existingUser) {
      console.log('⚠️ L\'utilisateur existe déjà');
      process.exit(0);
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
      fullName: 'Votre Nom Complet',
      firstName: 'Votre Prénom',
      lastName: 'Votre Nom',
      phone: '+224 000 000 000',
    } as any);

    console.log('✅ Utilisateur créé avec succès!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   ID: ${user._id}`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

createUserProduction();
```

#### Étape 2 : Ajouter un Script dans package.json

Dans `back/package.json`, ajoutez :

```json
"scripts": {
  ...
  "create-user-prod": "ts-node src/scripts/createUserProduction.ts"
}
```

#### Étape 3 : Exécuter sur Railway

**Option A : Via Railway CLI** (si installé)
```bash
railway run npm run create-user-prod
```

**Option B : Via Railway Dashboard**
1. Allez sur Railway → Votre service
2. **Settings** → **Deploy**
3. Dans **Run Command**, tapez : `npm run create-user-prod`
4. Cliquez sur **Deploy**

---

### Option 2 : Via l'API d'Inscription (Plus Simple)

Si l'inscription est activée, vous pouvez créer un compte directement depuis le frontend :

1. Allez sur votre site Vercel
2. Cliquez sur **S'inscrire** ou **Register**
3. Remplissez le formulaire avec :
   - Email : `maladho1711@gmail.com`
   - Mot de passe : (choisissez un mot de passe)
   - Rôle : `citoyen`
4. Soumettez le formulaire

---

### Option 3 : Créer via MongoDB Atlas (Avancé)

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Connectez-vous à votre cluster
3. Allez dans **Collections**
4. Trouvez votre base de données `guinea_smart_electricity`
5. Collection `users`
6. Cliquez sur **Insert Document**
7. Ajoutez un document avec :
```json
{
  "email": "maladho1711@gmail.com",
  "password": "$2a$10$...", // Mot de passe hashé (généré avec bcrypt)
  "role": "citoyen",
  "fullName": "Votre Nom",
  "created_at": new Date()
}
```

⚠️ **Note** : Vous devez hasher le mot de passe avec bcrypt. C'est plus complexe.

---

## 🎯 Solution Rapide : Utiliser l'Inscription

**La solution la plus simple** est d'utiliser le formulaire d'inscription sur votre site :

1. Ouvrez : `https://guinea-smart-electricity.vercel.app`
2. Cherchez le bouton **S'inscrire** ou **Register**
3. Créez un compte avec :
   - Email : `maladho1711@gmail.com`
   - Mot de passe : (choisissez-en un)
   - Rôle : `citoyen`

---

## 🔍 Vérifier les Utilisateurs Existants

Si vous voulez vérifier quels utilisateurs existent déjà :

### Via Script (si disponible)

```bash
# Dans Railway
npm run list-users
```

### Via MongoDB Atlas

1. Allez sur MongoDB Atlas
2. Collections → `users`
3. Voir tous les documents

---

## ✅ Test Final

Une fois l'utilisateur créé :

1. Allez sur votre site Vercel
2. Connectez-vous avec :
   - Email : `maladho1711@gmail.com`
   - Mot de passe : (celui que vous avez créé)
   - Rôle : `citoyen`

**Si la connexion fonctionne** → 🎉 **Tout est parfait !**

---

## 🚨 Si l'Inscription n'est pas Disponible

Si le formulaire d'inscription n'est pas accessible ou ne fonctionne pas :

1. **Vérifiez les routes d'inscription** dans le frontend
2. **Vérifiez que `/api/auth/register` fonctionne** :
   - Testez avec Postman ou curl
   - Ou créez un utilisateur via le script (Option 1)

---

## 📝 Résumé

**Votre déploiement est OK !** ✅

Le problème est juste que l'utilisateur n'existe pas encore. Créez un compte via :
- ✅ Le formulaire d'inscription (le plus simple)
- ✅ Un script Railway
- ✅ MongoDB Atlas (avancé)

Une fois l'utilisateur créé, la connexion fonctionnera parfaitement.

