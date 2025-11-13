# Guinea Smart Electricity - Plateforme de Gestion Énergétique

Plateforme complète de gestion de l'électricité pour la Guinée, développée avec React, TypeScript, Node.js, Express et MongoDB.

## 🚀 Fonctionnalités

- **Authentification multi-rôles** : Citoyen, PME, Technicien, Manager, État
- **Dashboards personnalisés** : Interface adaptée à chaque type d'utilisateur
- **Assistant IA EVA** : Chatbot intelligent pour le support client
- **Gestion des tickets** : Signalement et suivi des problèmes
- **Consommation énergétique** : Suivi et analyse de la consommation
- **Sécurité renforcée** : Rate limiting, validation, sanitization

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB Atlas (ou MongoDB local)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-username/guinea-smart-electricity.git
cd guinea-smart-electricity
```

### 2. Configuration Backend

```bash
cd back
npm install
```

Créer un fichier `.env` dans le dossier `back/` :

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/guinea_smart_electricity?retryWrites=true&w=majority

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise

# Server
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Hugging Face (pour EVA)
HUGGINGFACE_API_KEY=votre_cle_api_huggingface
HUGGINGFACE_MODEL=google/flan-t5-large
```

### 3. Configuration Frontend

```bash
cd project
npm install
```

Créer un fichier `.env` dans le dossier `project/` (optionnel) :

```env
VITE_API_URL=http://localhost:3000
```

### 4. Créer le compte administrateur

```bash
cd back
npm run create-admin
```

## 🚀 Démarrage

### Backend

```bash
cd back
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Frontend

```bash
cd project
npm run dev
```

L'application démarre sur `http://localhost:5173`

## 📁 Structure du Projet

```
guinea-smart-electricity/
├── back/                 # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/      # Configuration (DB, etc.)
│   │   ├── controllers/ # Contrôleurs API
│   │   ├── middleware/  # Middlewares (auth, validation, etc.)
│   │   ├── models/      # Modèles Mongoose
│   │   ├── routes/      # Routes API
│   │   ├── scripts/     # Scripts utilitaires
│   │   └── utils/       # Utilitaires
│   └── package.json
├── project/             # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── contexts/    # Contextes React
│   │   ├── config/      # Configuration
│   │   └── assets/      # Assets statiques
│   └── package.json
└── README.md
```

## 👥 Rôles Utilisateurs

- **Citoyen** : Accès au dashboard personnel, suivi de consommation, signalement de problèmes
- **PME** : Gestion des factures et consommation pour les entreprises
- **Technicien** : Gestion des tickets et interventions terrain
- **Manager** : Supervision et gestion globale
- **État** : Accès aux statistiques et rapports gouvernementaux
- **Admin** : Accès complet au système

## 🔐 Sécurité

- Authentification JWT
- Rate limiting pour prévenir les attaques brute force
- Validation des entrées
- Protection contre les injections NoSQL
- Sanitization des données
- Headers de sécurité (Helmet)

## 🤖 EVA - Assistant IA

EVA est un assistant virtuel intelligent intégré à la plateforme. Configuration détaillée dans `back/CONFIGURER_HUGGINGFACE.md`.

## 📝 Scripts Utilitaires

```bash
# Créer un compte admin
cd back && npm run create-admin

# Réinitialiser le mot de passe admin
cd back && npm run reset-admin-password

# Créer un utilisateur
cd back && npm run create-user

# Réinitialiser le mot de passe d'un utilisateur
cd back && npm run reset-user-password

# Lister les comptes d'un email
cd back && npm run list-users
```

## 🧪 Tests

```bash
# Backend
cd back
npm test

# Frontend
cd project
npm test
```

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé pour Guinea Smart Electricity (EDG)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

