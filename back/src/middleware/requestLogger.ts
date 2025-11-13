import { Request, Response, NextFunction } from 'express';

// Middleware pour logger les requêtes sensibles de manière sécurisée
export const secureRequestLogger = (req: Request, _res: Response, next: NextFunction) => {
  // Ne pas logger les mots de passe ou tokens
  const sanitizedBody = { ...req.body };
  if (sanitizedBody.password) {
    sanitizedBody.password = '***';
  }
  if (sanitizedBody.token) {
    sanitizedBody.token = '***';
  }

  // Logger uniquement en développement
  if (process.env.NODE_ENV === 'development') {
    console.log(`📥 ${req.method} ${req.path}`, {
      body: sanitizedBody,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  }

  next();
};

