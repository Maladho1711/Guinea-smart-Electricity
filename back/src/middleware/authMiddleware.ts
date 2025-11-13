import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface pour étendre Request avec les informations de l'utilisateur
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware pour authentifier les tokens JWT
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      res.status(401).json({ error: 'Token d\'authentification manquant' });
      return;
    }

    // Vérifier et décoder le token
    const jwtSecret = process.env.JWT_SECRET || 'your_secret_key_here';
    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; role: string };

    // Ajouter les informations de l'utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Token invalide' });
      return;
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expiré' });
      return;
    }
    res.status(500).json({ error: 'Erreur lors de l\'authentification' });
  }
};

