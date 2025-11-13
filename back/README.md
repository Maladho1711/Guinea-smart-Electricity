# Guinea Smart Electricity - Backend

API backend pour l'application Guinea Smart Electricity.

## Structure du projet

```
back/
├── src/
│   ├── config/          # Configuration (base de données, etc.)
│   ├── controllers/     # Contrôleurs pour gérer les requêtes
│   ├── middleware/      # Middleware (authentification, rôles)
│   ├── models/          # Modèles de données
│   ├── routes/          # Définition des routes
│   ├── utils/           # Utilitaires (email, etc.)
│   ├── app.ts           # Configuration Express
│   └── server.ts        # Point d'entrée du serveur
├── package.json
└── tsconfig.json
```

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` à la racine du dossier `back/` avec le contenu suivant :
```env
# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/guinea_smart_electricity
# Ou pour MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/guinea_smart_electricity

# Configuration JWT
JWT_SECRET=votre_secret_key_ici
JWT_EXPIRES_IN=24h

# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
SMTP_FROM=noreply@guineasmart.gn

# URL du frontend
FRONTEND_URL=http://localhost:5173
```

**Note** : Assurez-vous d'avoir MongoDB installé et en cours d'exécution sur votre machine, ou utilisez MongoDB Atlas pour une base de données cloud.

## Scripts disponibles

- `npm run dev` : Démarrer le serveur en mode développement
- `npm run build` : Compiler le TypeScript
- `npm start` : Démarrer le serveur en production
- `npm run lint` : Vérifier le code avec ESLint

## Démarrage

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

## Routes API

- `/api/auth` - Authentification (register, login, logout)
- `/api/users` - Gestion des utilisateurs
- `/api/projects` - Gestion des projets
- `/api/tickets` - Gestion des tickets
- `/health` - Vérification de l'état du serveur

