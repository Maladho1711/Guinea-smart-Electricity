import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

// Rate limiting pour l'authentification (protection contre brute force)
// Plus permissif en développement
const isDevelopment = process.env.NODE_ENV === 'development';
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50 : 5, // 50 tentatives en dev, 5 en production
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne pas compter les requêtes réussies
  skip: (req) => {
    // En développement, ignorer le rate limiting pour localhost
    if (isDevelopment && (req.ip === '::1' || req.ip === '127.0.0.1' || req.ip?.startsWith('::ffff:127.0.0.1'))) {
      return true;
    }
    return false;
  },
});

// Rate limiting général pour l'API
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 100, // 1000 requêtes en dev, 100 en production
  message: {
    error: 'Trop de requêtes. Veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // En développement, ignorer le rate limiting pour localhost
    if (isDevelopment && (req.ip === '::1' || req.ip === '127.0.0.1' || req.ip?.startsWith('::ffff:127.0.0.1'))) {
      return true;
    }
    return false;
  },
});

// Rate limiting strict pour les routes sensibles
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 requêtes par IP
  message: {
    error: 'Trop de requêtes. Veuillez réessayer dans 1 heure.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware pour sanitizer les données MongoDB (protection contre NoSQL injection)
export const sanitizeMongo = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Tentative d'injection NoSQL détectée: ${key} dans ${req.path}`);
  },
});

// Middleware pour limiter la taille des requêtes
export const requestSizeLimiter = (maxSize: string = '10mb') => {
  return (req: any, res: any, next: any) => {
    const contentLength = req.get('content-length');
    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / (1024 * 1024);
      const maxSizeInMB = parseFloat(maxSize);
      if (sizeInMB > maxSizeInMB) {
        return res.status(413).json({
          error: `La taille de la requête dépasse la limite de ${maxSize}`,
        });
      }
    }
    next();
  };
};

