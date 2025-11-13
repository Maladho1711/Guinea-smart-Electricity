import dotenv from 'dotenv';
import connectDB from '../config/db';
import { getUsersByEmail } from '../models/userModel';
import mongoose from 'mongoose';

dotenv.config();

const listUsers = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Récupérer l'email depuis les arguments
    const email = process.argv[2];

    if (email) {
      // Lister les comptes pour un email spécifique
      const users = await getUsersByEmail(email.toLowerCase().trim());
      
      if (users.length === 0) {
        console.log(`❌ Aucun compte trouvé pour l'email: ${email}`);
      } else {
        console.log(`\n✅ ${users.length} compte(s) trouvé(s) pour ${email}:\n`);
        users.forEach((user, index) => {
          console.log(`Compte ${index + 1}:`);
          console.log(`   Rôle: ${user.role}`);
          console.log(`   Nom: ${user.fullName || 'Non renseigné'}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   ID: ${(user._id as any).toString()}`);
          console.log(`   Créé le: ${user.created_at}`);
          console.log('');
        });
      }
    } else {
      console.log('Usage: npm run list-users <email>');
      console.log('Exemple: npm run list-users maladhob5@gmail.com');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

listUsers();

