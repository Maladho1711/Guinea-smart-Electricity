# Guide de Sécurité - Guinea Smart Electricity Backend

## 🔒 Mesures de Sécurité Implémentées

### 1. Protection contre les attaques brute force
- **Rate Limiting** : Limitation du nombre de tentatives de connexion (5 tentatives / 15 minutes)
- **Rate Limiting API** : Limitation générale des requêtes (100 requêtes / 15 minutes)

### 2. Validation des entrées
- **express-validator** : Validation stricte de tous les champs utilisateur
- **Sanitization** : Nettoyage automatique des données avant traitement
- **Validation des emails** : Format email vérifié
- **Validation des mots de passe** : Minimum 8 caractères avec majuscule, minuscule et chiffre

### 3. Protection contre les injections
- **express-mongo-sanitize** : Protection contre les injections NoSQL
- **Sanitization des données** : Nettoyage automatique des requêtes

### 4. Sécurité des headers HTTP
- **Helmet** : Configuration renforcée des headers de sécurité
- **Content Security Policy** : Protection contre XSS
- **CORS** : Configuration restrictive avec origine spécifique

### 5. Gestion sécurisée des erreurs
- **Pas d'exposition d'informations sensibles** en production
- **Logs sécurisés** : Les mots de passe et tokens ne sont jamais loggés
- **Messages d'erreur génériques** en production

### 6. Authentification JWT
- **Tokens sécurisés** : Expiration configurable
- **Secret fort** : Utilisation de JWT_SECRET dans .env
- **Validation stricte** : Vérification de la signature et expiration

### 7. Protection des mots de passe
- **Bcrypt** : Hachage avec salt rounds (10)
- **Jamais en clair** : Les mots de passe ne sont jamais stockés ou loggés en clair

## ⚠️ Bonnes Pratiques de Sécurité

### Fichiers sensibles
- ✅ `.env` est dans `.gitignore` - **NE JAMAIS COMMITER**
- ✅ Les secrets sont dans les variables d'environnement
- ✅ Utiliser `.env.example` comme template

### Variables d'environnement critiques
```env
JWT_SECRET=<clé_secrète_forte_et_aléatoire>
MONGODB_URI=<uri_mongodb_avec_mot_de_passe>
SMTP_PASS=<mot_de_passe_email>
```

### Recommandations
1. **Changez JWT_SECRET** en production avec une clé forte et aléatoire
2. **Utilisez HTTPS** en production
3. **Activez les logs de sécurité** pour surveiller les tentatives d'intrusion
4. **Mettez à jour régulièrement** les dépendances (`npm audit`)
5. **Ne commitez jamais** les fichiers `.env` ou contenant des secrets

## 🛡️ Protection des Routes

- Routes d'authentification : Rate limiting strict (5 tentatives / 15 min)
- Routes API : Rate limiting général (100 requêtes / 15 min)
- Routes protégées : Authentification JWT requise
- Routes admin : Vérification du rôle admin

## 📝 Logs de Sécurité

Les logs incluent :
- Tentatives de connexion échouées (email masqué)
- Tentatives d'injection NoSQL détectées
- Erreurs d'authentification

**Important** : Les mots de passe et tokens ne sont JAMAIS loggés.

