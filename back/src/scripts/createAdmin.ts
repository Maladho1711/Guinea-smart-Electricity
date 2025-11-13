import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { createUser, getUserByEmail } from '../models/userModel';

dotenv.config();

const createAdminAccount = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    const adminEmail = 'maladhob5@gmail.com';
    const adminPassword = 'Admin123!'; // Mot de passe par défaut - à changer après la première connexion
    const adminFullName = 'Administrateur GSE';

    // Vérifier si l'admin existe déjà
    const existingAdmin = await getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log('⚠️  Le compte administrateur existe déjà avec cet email.');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Rôle: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Hacher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Créer le compte administrateur
    const admin = await createUser({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      fullName: adminFullName,
      firstName: 'Administrateur',
      lastName: 'GSE',
    } as any);

    console.log('✅ Compte administrateur créé avec succès !');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Mot de passe par défaut: ${adminPassword}`);
    console.log(`   ⚠️  IMPORTANT: Changez le mot de passe après la première connexion !`);
    console.log(`   ID: ${(admin._id as any).toString()}`);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur lors de la création du compte administrateur:', error);
    process.exit(1);
  }
};

// Exécuter le script
createAdminAccount();

