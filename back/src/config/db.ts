import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        // Vérifier que MONGODB_URI est définie
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            console.error('❌ MONGODB_URI n\'est pas définie dans les variables d\'environnement');
            console.error('💡 Vérifiez que la variable MONGODB_URI est configurée dans Railway');
            throw new Error('MONGODB_URI n\'est pas définie dans les variables d\'environnement');
        }

        console.log('🔄 Tentative de connexion à MongoDB...');
        // Masquer les credentials dans les logs
        const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        console.log(`📍 URI: ${maskedURI}`);

        // Avec Mongoose 7+, pas besoin de useNewUrlParser ni useUnifiedTopology
        const conn = await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB connecté avec succès!`);
        console.log(`   📍 Host: ${conn.connection.host}`);
        console.log(`   📊 Base de données: ${conn.connection.name}`);
        console.log(`   🔌 Port: ${conn.connection.port || 'default'}`);
    } catch (error: any) {
        console.error('❌ Erreur de connexion à MongoDB:');
        console.error(`   Message: ${error.message}`);

        if (error.message.includes('ECONNREFUSED')) {
            console.error('   💡 Vérifiez que MongoDB est démarré sur votre machine');
            console.error('   💡 Ou vérifiez que l\'URI MongoDB est correcte dans le fichier .env');
        } else if (error.message.includes('authentication failed')) {
            console.error('   💡 Vérifiez vos identifiants MongoDB dans le fichier .env');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('   💡 Vérifiez que l\'adresse du serveur MongoDB est correcte');
        }

        console.error('\n   Pour démarrer MongoDB localement:');
        console.error('   - Windows: net start MongoDB');
        console.error('   - Linux/Mac: sudo systemctl start mongod');
        console.error('   - Ou utilisez MongoDB Atlas (cloud)');

        process.exit(1);
    }
};

// Gestion de la déconnexion
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB déconnecté');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Erreur MongoDB:', err);
});

export default connectDB;
