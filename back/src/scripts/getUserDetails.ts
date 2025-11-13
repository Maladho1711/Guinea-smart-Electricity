import dotenv from 'dotenv';
import connectDB from '../config/db';
import User from '../models/userModel';
import mongoose from 'mongoose';

// Charger les variables d'environnement
dotenv.config();

const getUserDetails = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: npm run get-user-details <email>');
      console.log('Exemple: npm run get-user-details ktsbelectricity@edg.gn');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log(`\n🔍 Recherche des détails pour: ${email}\n`);
    
    // Récupérer tous les comptes avec cet email
    const users = await User.find({ email: email.toLowerCase().trim() });
    
    if (users.length === 0) {
      console.log(`❌ Aucun compte trouvé pour l'email: ${email}\n`);
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log(`✅ ${users.length} compte(s) trouvé(s):\n`);
    console.log('═'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n📋 Compte ${index + 1}:`);
      console.log('─'.repeat(80));
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Rôle: ${user.role}`);
      console.log(`   🆔 ID: ${(user._id as any).toString()}`);
      
      if (user.fullName) {
        console.log(`   📝 Nom complet: ${user.fullName}`);
      }
      if (user.firstName) {
        console.log(`   👨 Prénom: ${user.firstName}`);
      }
      if (user.lastName) {
        console.log(`   👤 Nom: ${user.lastName}`);
      }
      if (user.phone) {
        console.log(`   📱 Téléphone: ${user.phone}`);
      }
      if (user.address) {
        console.log(`   📍 Adresse: ${user.address}`);
      }
      
      // Informations spécifiques selon le rôle
      if (user.role === 'citoyen' && user.meterNumber) {
        console.log(`   ⚡ Numéro de compteur: ${user.meterNumber}`);
      }
      if (user.role === 'pme') {
        if (user.companyName) {
          console.log(`   🏢 Nom de l'entreprise: ${user.companyName}`);
        }
        if (user.responsibleName) {
          console.log(`   👔 Responsable: ${user.responsibleName}`);
        }
      }
      if (user.role === 'technicien') {
        if (user.matricule) {
          console.log(`   🎫 Matricule: ${user.matricule}`);
        }
        if (user.department) {
          console.log(`   🏛️ Département: ${user.department}`);
        }
        if (user.sector) {
          console.log(`   📊 Secteur: ${user.sector}`);
        }
        if (user.interventionZone) {
          console.log(`   🗺️ Zone d'intervention: ${user.interventionZone}`);
        }
      }
      if (user.role === 'manager' || user.role === 'etat') {
        if (user.department) {
          console.log(`   🏛️ Département: ${user.department}`);
        }
        if (user.ministry) {
          console.log(`   🏛️ Ministère: ${user.ministry}`);
        }
      }
      
      console.log(`   📅 Date de création: ${user.created_at ? new Date(user.created_at).toLocaleString('fr-FR') : 'N/A'}`);
      console.log(`   🔄 Dernière mise à jour: ${user.updated_at ? new Date(user.updated_at).toLocaleString('fr-FR') : 'N/A'}`);
      
      if (index < users.length - 1) {
        console.log('\n' + '═'.repeat(80));
      }
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log();
    
    // Fermer la connexion
    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des détails:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Exécuter le script
getUserDetails();

