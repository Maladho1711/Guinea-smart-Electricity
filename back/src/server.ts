import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';
import * as net from 'net';

// Charger dotenv uniquement en développement (Railway fournit déjà les variables en production)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);
const MAX_PORT_ATTEMPTS = 10; // Nombre maximum de ports à essayer

// Fonction pour vérifier si un port est disponible
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });
  });
};

// Fonction pour trouver un port disponible
const findAvailablePort = async (startPort: number): Promise<number> => {
  let currentPort = startPort;
  let attempts = 0;

  while (attempts < MAX_PORT_ATTEMPTS) {
    const available = await isPortAvailable(currentPort);
    
    if (available) {
      return currentPort;
    }
    
    attempts++;
    if (currentPort !== startPort) {
      console.log(`⚠️  Port ${currentPort - 1} occupé, essai du port ${currentPort}...`);
    }
    currentPort++;
  }

  throw new Error(`Impossible de trouver un port disponible après ${MAX_PORT_ATTEMPTS} tentatives (${startPort}-${currentPort - 1})`);
};

// Connexion à MongoDB avant de démarrer le serveur
const startServer = async () => {
  try {
    await connectDB();
    
    // Trouver un port disponible
    const availablePort = await findAvailablePort(DEFAULT_PORT);
    
    // Démarrage du serveur sur le port disponible
    // En production, écouter sur 0.0.0.0 pour accepter les connexions depuis l'extérieur
    // En développement, écouter sur localhost
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    const server = app.listen(availablePort, host, () => {
      console.log(`🚀 Serveur démarré sur le port ${availablePort}`);
      console.log(`📍 URL locale: http://localhost:${availablePort}`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`🌐 URL publique: http://0.0.0.0:${availablePort}`);
        console.log(`💡 Le serveur écoute sur toutes les interfaces réseau`);
      }
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      
      if (availablePort !== DEFAULT_PORT) {
        console.log(`ℹ️  Le port ${DEFAULT_PORT} était occupé, utilisation du port ${availablePort} à la place`);
      }
    });

    // Gestion propre de l'arrêt du serveur
    process.on('SIGTERM', () => {
      console.log('🛑 Signal SIGTERM reçu, arrêt du serveur...');
      server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Signal SIGINT reçu, arrêt du serveur...');
      server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
      });
    });

  } catch (error: any) {
    console.error('❌ Erreur lors du démarrage du serveur:', error.message);
    if (error.code === 'EADDRINUSE') {
      console.error(`💡 Le port ${DEFAULT_PORT} est déjà utilisé. Essayez de libérer le port ou changez PORT dans .env`);
    }
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

