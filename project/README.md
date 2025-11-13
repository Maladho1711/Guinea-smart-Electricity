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
- **Supabase** - Backend-as-a-Service
  - Authentification JWT
  - Base de données PostgreSQL
  - Row Level Security (RLS)
  - API REST automatique

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)

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

### 3. Configurer Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. La migration de base de données a déjà été appliquée automatiquement
4. Récupérez vos clés API dans Project Settings > API

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
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

## 🐳 Docker (Optionnel)

Un fichier `docker-compose.yml` est fourni pour faciliter le déploiement :

```bash
docker-compose up -d
```

## 🗄️ Structure de la base de données

### Tables principales

- **profiles** - Profils utilisateurs (client, technicien, manager)
- **tickets** - Pannes signalées
- **payments** - Paiements effectués
- **invoices** - Factures d'électricité
- **chat_messages** - Historique des conversations avec EVA

### Sécurité

Toutes les tables sont protégées par Row Level Security (RLS) :
- Les clients ne voient que leurs propres données
- Les techniciens peuvent voir et gérer tous les tickets
- Les managers ont un accès complet en lecture

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

- ✅ Authentification JWT via Supabase
- ✅ Row Level Security sur toutes les tables
- ✅ Validation côté serveur
- ✅ Protection contre les injections SQL
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
