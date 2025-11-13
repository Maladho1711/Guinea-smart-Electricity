import { Request, Response, NextFunction } from 'express';

// Interface pour les erreurs personnalisées
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware de gestion des erreurs global
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Erreur personnalisée
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation des données',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Erreur de duplication MongoDB
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return res.status(400).json({
      error: 'Cette valeur existe déjà dans la base de données',
    });
  }

  // Erreur de cast MongoDB
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Format de données invalide',
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré',
    });
  }

  // Erreur par défaut - Ne pas exposer les détails en production
  console.error('Erreur non gérée:', err);
  
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Une erreur interne est survenue' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware pour les routes non trouvées
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
  });
};

