import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connexion à MongoDB avant de démarrer le serveur
const startServer = async () => {
  try {
    await connectDB();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

