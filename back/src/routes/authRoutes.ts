import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { authRateLimiter } from '../middleware/securityMiddleware';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware';

const router = Router();

// Rate limiting pour l'authentification (protection contre brute force)
router.use(authRateLimiter);

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;

