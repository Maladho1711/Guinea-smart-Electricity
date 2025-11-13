import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

// Middleware pour vérifier si le rôle de l'utilisateur fait partie des rôles autorisés
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Accès refusé. Rôle insuffisant.',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

// Alias pour compatibilité avec l'ancien code
export const requireRole = authorizeRoles;
