import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', authenticateToken, requireRole('admin', 'manager'), getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUser);

export default router;

