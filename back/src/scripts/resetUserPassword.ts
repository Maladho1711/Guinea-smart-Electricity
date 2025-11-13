import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { getUserByEmail } from '../models/userModel';
import mongoose from 'mongoose';

dotenv.config();

const resetUserPassword = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Récupérer les paramètres depuis les arguments de ligne de commande
    const args = process.argv.slice(2);
    const email = args[0] || 'maladhoktsb@gmail.com';
    const newPassword = args[1] || 'Password123!';

    // Trouver l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      console.log('❌ Aucun compte trouvé avec cet email.');
      process.exit(1);
    }

    // Hacher le nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Mot de passe réinitialisé avec succès !');
    console.log(`   Email: ${email}`);
    console.log(`   Nouveau mot de passe: ${newPassword}`);
    console.log(`   Rôle: ${user.role}`);
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
resetUserPassword();

