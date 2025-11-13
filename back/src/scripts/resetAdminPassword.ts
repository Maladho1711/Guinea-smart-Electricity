import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { getUserByEmail } from '../models/userModel';
import mongoose from 'mongoose';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    const adminEmail = 'maladhob5@gmail.com';
    const newPassword = 'Kadiatou2'; // Nouveau mot de passe

    // Trouver l'utilisateur
    const admin = await getUserByEmail(adminEmail);
    if (!admin) {
      console.log('❌ Aucun compte trouvé avec cet email.');
      process.exit(1);
    }

    // Hacher le nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Mot de passe réinitialisé avec succès !');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Nouveau mot de passe: ${newPassword}`);
    console.log(`   ⚠️  IMPORTANT: Changez le mot de passe après la première connexion !`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur lors de la réinitialisation du mot de passe:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Exécuter le script
resetAdminPassword();

