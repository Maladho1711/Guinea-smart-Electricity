import { Router } from 'express';
import { chatWithEVA } from '../controllers/evaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { apiRateLimiter } from '../middleware/securityMiddleware';

const router = Router();

// Rate limiting pour l'API EVA (plus permissif que l'auth)
router.use(apiRateLimiter);

// Route pour chatter avec EVA
// Authentification optionnelle : si l'utilisateur est connecté, on utilise son contexte
// Sinon, EVA fonctionne en mode "guest"
router.post('/chat', async (req, res, next) => {
  // Essayer d'authentifier, mais ne pas bloquer si ça échoue
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Si un token est fourni, essayer de l'authentifier
    return authenticateToken(req as any, res, next);
  }
  // Sinon, continuer sans authentification
  next();
}, chatWithEVA);

export default router;

