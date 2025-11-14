import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import ticketRoutes from './routes/ticketRoutes';
import evaRoutes from './routes/evaRoutes';
import alertRoutes from './routes/alertRoutes';
import analysisRoutes from './routes/analysisRoutes';
import { apiRateLimiter, sanitizeMongo, requestSizeLimiter } from './middleware/securityMiddleware';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

// Sécurité avec Helmet - Configuration renforcée
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Logger avec Morgan (uniquement en développement)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS activé avec configuration spécifique
// Configuration améliorée pour accepter les requêtes depuis n'importe quelle origine en production
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // En développement, accepter localhost avec n'importe quel port
    if (process.env.NODE_ENV === 'development') {
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
        return;
      }
    }
    
    // En production
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins: string[] = [];
      
      // Ajouter FRONTEND_URL si défini
      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
        // Accepter aussi avec/sans www et http/https
        const url = new URL(process.env.FRONTEND_URL);
        allowedOrigins.push(`${url.protocol}//${url.host}`);
        allowedOrigins.push(`${url.protocol}//www.${url.host}`);
        if (url.protocol === 'https:') {
          allowedOrigins.push(`http://${url.host}`);
          allowedOrigins.push(`http://www.${url.host}`);
        }
      }
      
      // Accepter tous les domaines Vercel (*.vercel.app)
      if (origin && origin.includes('.vercel.app')) {
        callback(null, true);
        return;
      }
      
      // Si FRONTEND_URL est défini, vérifier l'origine
      if (allowedOrigins.length > 0) {
        if (origin && allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        // Si l'origine n'est pas dans la liste mais qu'on a des origines configurées, 
        // on accepte quand même pour éviter les problèmes (peut être renforcé plus tard)
        console.warn(`⚠️ CORS: Origine non listée mais acceptée: ${origin}`);
        callback(null, true);
        return;
      }
      
      // Si aucune origine n'est configurée en production, accepter toutes les origines
      // (pour permettre l'accès depuis n'importe quelle machine)
      console.log(`ℹ️ CORS: Aucune origine configurée, acceptation de: ${origin || 'toutes'}`);
      callback(null, true);
    } else {
      // Fallback pour les autres environnements
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 heures
};

app.use(cors(corsOptions));

// Rate limiting global pour l'API
app.use('/api', apiRateLimiter);

// Protection contre les injections NoSQL
app.use(sanitizeMongo);

// Limite de taille des requêtes
app.use(requestSizeLimiter('10mb'));

// Middleware JSON avec limite de taille
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/eva', evaRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analysis', analysisRoutes);

// Route de santé
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'Backend running successfully',
    timestamp: new Date().toISOString(),
  });
});

// Gestion des erreurs 404
app.use(notFoundHandler);

// Gestion globale des erreurs (doit être le dernier middleware)
app.use(errorHandler);

export default app;

