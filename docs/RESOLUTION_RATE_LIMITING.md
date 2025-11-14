# 🛡️ Résolution : Erreur 429 (Too Many Requests)

## 🔍 Explication

L'erreur **429 "Too Many Requests"** signifie que vous avez fait **trop de tentatives de connexion** en peu de temps. C'est une **protection de sécurité** contre les attaques brute force.

### Configuration Actuelle

- **Limite** : 5 tentatives de connexion par IP
- **Période** : 15 minutes
- **Message** : "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes."

---

## ✅ Solutions

### Solution 1 : Attendre 15 Minutes (Recommandé)

**La solution la plus simple** : Attendez 15 minutes, puis réessayez.

Le blocage se lève automatiquement après 15 minutes.

---

### Solution 2 : Changer d'IP (Si Possible)

Si vous êtes sur un réseau qui peut changer d'IP :
- Utilisez un autre réseau (WiFi différent, données mobiles)
- Utilisez un VPN
- Attendez que votre IP change

⚠️ **Note** : Le rate limiting est par IP, donc changer d'IP permet de contourner temporairement.

---

### Solution 3 : Ajuster le Rate Limiting (Temporaire)

Si vous êtes en développement/test et voulez augmenter la limite :

**Dans `back/src/middleware/securityMiddleware.ts`** :

```typescript
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50 : 10, // Augmenter de 5 à 10 en production
  // ...
});
```

Puis redéployez sur Railway.

---

### Solution 4 : Désactiver Temporairement le Rate Limiting (Développement Seulement)

⚠️ **ATTENTION** : Ne faites cela QUE en développement, JAMAIS en production !

**Dans `back/src/routes/authRoutes.ts`** :

```typescript
// Commenter temporairement le rate limiting
// router.use(authRateLimiter);
```

**Puis redéployez.**

---

### Solution 5 : Réinitialiser le Rate Limiting (Avancé)

Si vous utilisez Redis pour le rate limiting, vous pouvez réinitialiser les compteurs. Mais avec la configuration actuelle (en mémoire), il faut attendre 15 minutes.

---

## 🎯 Pourquoi Cette Protection Existe

Le rate limiting protège votre application contre :
- ✅ **Attaques brute force** : Tentatives de deviner les mots de passe
- ✅ **DDoS** : Surcharge du serveur
- ✅ **Abus** : Utilisation malveillante de l'API

C'est une **bonne pratique de sécurité** ! 🔒

---

## 📊 Configuration Actuelle

D'après le code :

```typescript
// En production
max: 5 tentatives / 15 minutes
windowMs: 15 * 60 * 1000 (15 minutes)
skipSuccessfulRequests: true (les connexions réussies ne comptent pas)
```

Cela signifie :
- ✅ Si vous vous connectez avec succès, ça ne compte pas
- ❌ Si vous échouez 5 fois, vous êtes bloqué 15 minutes
- ✅ Le blocage se lève automatiquement après 15 minutes

---

## 🔧 Ajustements Recommandés

### Pour la Production

La limite de **5 tentatives** est assez stricte. Vous pouvez l'augmenter à **10 tentatives** :

**Dans `back/src/middleware/securityMiddleware.ts`** :

```typescript
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50 : 10, // 10 au lieu de 5
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
  },
  // ...
});
```

### Pour le Développement

En développement, la limite est déjà à **50 tentatives**, ce qui est largement suffisant.

---

## ✅ Solution Immédiate

**Pour débloquer maintenant** :

1. **Attendez 15 minutes** (recommandé)
2. **OU** utilisez un autre réseau/VPN
3. **OU** ajustez temporairement le rate limiting et redéployez

---

## 🚨 Important

**Ne désactivez JAMAIS complètement le rate limiting en production !**

C'est une protection essentielle. Si vous avez besoin de plus de tentatives, augmentez la limite (ex: 10 au lieu de 5), mais gardez la protection.

---

## 📝 Résumé

| Situation | Solution |
|-----------|----------|
| Bloqué maintenant | Attendre 15 minutes |
| Besoin de tester rapidement | Utiliser un autre réseau/VPN |
| Limite trop stricte | Augmenter à 10 tentatives |
| Développement | Limite déjà à 50 (OK) |

---

**Le rate limiting fonctionne correctement et protège votre application !** 🛡️

