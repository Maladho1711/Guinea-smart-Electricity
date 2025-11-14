# Guinea Smart Electricity (GSE)

![GSE Logo](https://via.placeholder.com/800x200/DC2626-F59E0B-10B981/FFFFFF?text=Guinea+Smart+Electricity)

Plateforme complète de gestion et de paiement de l'électricité en Guinée.

## 🇬🇳 Couleurs Nationales

Le projet respecte strictement les couleurs du drapeau guinéen :
- **Rouge** (#DC2626) - Symbolise le travail
- **Jaune** (#F59E0B) - Représente la justice
- **Vert** (#10B981) - Évoque la solidarité

## 🎯 Fonctionnalités

### Interface Client
- ✅ Consultation et paiement des factures d'électricité
- ✅ Signalement de pannes électriques
- ✅ Suivi des tickets de panne
- ✅ Chat avec EVA (assistant virtuel intelligent)
- ✅ Paiement via Orange Money, MTN Money, Moov Money, et carte bancaire

### Interface Technicien
- ✅ Visualisation de toutes les pannes signalées
- ✅ Géolocalisation des incidents sur carte interactive (OpenStreetMap)
- ✅ Mise à jour du statut des tickets (nouveau → en cours → résolu)
- ✅ Filtrage par statut et priorité
- ✅ Vue liste et vue carte

### Interface Manager
- ✅ Tableau de bord avec statistiques globales
- ✅ Graphiques de répartition des tickets
- ✅ Indicateurs de performance (temps de résolution, taux de résolution)
- ✅ Carte des zones critiques
- ✅ Vue d'ensemble des revenus

### Chatbot EVA
- 🤖 Assistant virtuel intelligent
- 💬 Répond aux questions fréquentes
- 🎫 Aide à la création de tickets
- ⚡ Disponible 24/7

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Framework CSS moderne
- **Leaflet** - Cartes interactives
- **Recharts** - Graphiques et visualisations
- **Lucide React** - Icônes modernes

### Backend & Base de données
- **Node.js/Express** - API REST backend
  - Authentification JWT
  - Base de données MongoDB (MongoDB Atlas)
  - Sécurité renforcée (Helmet, CORS, Rate Limiting)
  - Validation des données

## 📋 Prérequis

- Node.js 18+ et npm
- MongoDB Atlas (gratuit) ou MongoDB local

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd guinea-smart-electricity
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer le backend

1. Allez dans le dossier `back/`
2. Installez les dépendances : `npm install`
3. Configurez MongoDB Atlas ou utilisez MongoDB local
4. Créez un fichier `.env` dans `back/` avec vos variables d'environnement

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet `project/` :

```env
VITE_API_URL=http://localhost:3000
```

Pour le backend, créez un fichier `.env` dans `back/` :

```env
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 5. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Build de production

```bash
npm run build
npm run preview
```

## 🗄️ Structure de la base de données

### Collections MongoDB principales

- **users** - Utilisateurs (citoyen, pme, technicien, manager, etat, admin)
- **tickets** - Pannes signalées
- **projects** - Projets d'infrastructure
- **payments** - Paiements effectués (à implémenter)

### Sécurité

- Authentification JWT avec tokens sécurisés
- Middleware de validation des données
- Rate limiting pour protéger contre les attaques
- Protection contre les injections NoSQL
- CORS configuré pour les domaines autorisés

## 👥 Rôles et Permissions

### Client
- Consulter ses factures
- Payer ses factures
- Créer des tickets de panne
- Discuter avec EVA

### Technicien
- Voir tous les tickets
- Prendre en charge des tickets
- Mettre à jour le statut des tickets
- Visualiser la carte des pannes

### Manager
- Accès à toutes les statistiques
- Visualisation des indicateurs de performance
- Vue d'ensemble des revenus
- Carte des zones critiques

## 🎨 Design

Le design respecte les standards modernes :
- ✨ Interface épurée et moderne
- 📱 Responsive (mobile, tablette, desktop)
- 🎭 Animations fluides et micro-interactions
- ♿ Accessibilité optimisée
- 🎨 Palette de couleurs nationales guinéennes

## 🧪 Tests

```bash
npm run lint        # Vérifier le code
npm run typecheck   # Vérifier les types TypeScript
```

## 📝 Comptes de test

Pour tester l'application, créez des comptes avec les différents rôles :

1. **Client** - Pour tester l'interface utilisateur
2. **Technicien** - Pour tester la gestion des pannes
3. **Manager** - Pour tester le tableau de bord

## 🔒 Sécurité

- ✅ Authentification JWT personnalisée
- ✅ Validation des données côté serveur
- ✅ Protection contre les injections NoSQL
- ✅ Rate limiting pour les API
- ✅ Helmet pour les en-têtes HTTP sécurisés
- ✅ HTTPS obligatoire en production

## 🚧 Roadmap

- [ ] Notifications push en temps réel
- [ ] Export de rapports PDF
- [ ] Intégration SMS pour les alertes
- [ ] Application mobile native
- [ ] Prévisions de consommation par IA
- [ ] Système de facturation automatique

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## 👨‍💻 Auteur

Développé pour Guinea Smart Electricity

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Guinea Smart Electricity** - Ensemble pour une Guinée électrifiée 🇬🇳⚡
