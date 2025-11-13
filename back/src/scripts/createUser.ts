import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { createUser, getUserByEmail } from '../models/userModel';

dotenv.config();

const createUserAccount = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Récupérer les paramètres depuis les arguments de ligne de commande
    const args = process.argv.slice(2);
    const email = args[0] || 'maladhoktsb@gmail.com'; // Email par défaut (corrigé)
    const password = args[1] || 'Password123!'; // Mot de passe par défaut
    const role = args[2] || 'admin'; // Rôle par défaut
    const fullName = args[3] || 'Utilisateur GSE';

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('⚠️  Le compte existe déjà avec cet email.');
      console.log(`   Email: ${email}`);
      console.log(`   Rôle: ${existingUser.role}`);
      process.exit(0);
    }

    // Hacher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer le compte
    const user = await createUser({
      email: email,
      password: hashedPassword,
      role: role,
      fullName: fullName,
      firstName: fullName.split(' ')[0] || 'Utilisateur',
      lastName: fullName.split(' ').slice(1).join(' ') || 'GSE',
    } as any);

    console.log('✅ Compte créé avec succès !');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log(`   Rôle: ${role}`);
    console.log(`   ⚠️  IMPORTANT: Changez le mot de passe après la première connexion !`);
    console.log(`   ID: ${(user._id as any).toString()}`);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur lors de la création du compte:', error);
    process.exit(1);
  }
};

// Exécuter le script
createUserAccount();

