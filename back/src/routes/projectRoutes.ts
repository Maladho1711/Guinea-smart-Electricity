import { Router } from 'express';
import {
  getProjects,
  getProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../controllers/projectController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Liste des projets
router.get('/', getProjects);

// Voir un projet par ID
router.get('/:id', getProjectByIdHandler);

// Créer un projet (seuls manager ou admin)
router.post('/', authorizeRoles('admin', 'manager'), createProjectHandler);

// Modifier un projet (seuls manager ou admin)
router.put('/:id', authorizeRoles('admin', 'manager'), updateProjectHandler);

// Supprimer un projet (seuls manager ou admin)
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteProjectHandler);

export default router;
