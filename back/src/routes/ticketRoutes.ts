import { Router } from 'express';
import {
  getTickets,
  getTicketByIdHandler,
  createTicketHandler,
  updateTicketHandler,
  deleteTicketHandler,
} from '../controllers/ticketController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Liste des tickets
router.get('/', getTickets);

// Voir un ticket par ID
router.get('/:id', getTicketByIdHandler);

// Créer un ticket (citoyen ou PME)
router.post('/', createTicketHandler);

// Modifier un ticket
router.put('/:id', updateTicketHandler);

// Supprimer un ticket (admin ou manager)
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteTicketHandler);

export default router;
