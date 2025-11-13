import { Router } from 'express';
import {
  createUserAlert,
  getUserAlerts,
  markAlertRead,
  archiveUserAlert,
  deleteUserAlert,
} from '../controllers/alertController';
import { authenticateToken } from '../middleware/authMiddleware';
import { apiRateLimiter } from '../middleware/securityMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);
router.use(apiRateLimiter);

// Créer une alerte
router.post('/', createUserAlert);

// Récupérer les alertes de l'utilisateur
router.get('/', getUserAlerts);

// Marquer une alerte comme lue
router.patch('/:id/read', markAlertRead);

// Archiver une alerte
router.patch('/:id/archive', archiveUserAlert);

// Supprimer une alerte
router.delete('/:id', deleteUserAlert);

export default router;

