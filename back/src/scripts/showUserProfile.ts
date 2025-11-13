import dotenv from 'dotenv';
import connectDB from '../config/db';
import User from '../models/userModel';
import mongoose from 'mongoose';

// Charger les variables d'environnement
dotenv.config();

const showUserProfile = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    const email = process.argv[2];
    const role = process.argv[3];
    
    if (!email) {
      console.log('Usage: npm run show-profile <email> [role]');
      console.log('Exemple: npm run show-profile maladho1998@gmail.com citoyen');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log(`\n🔍 Recherche du profil complet pour: ${email}${role ? ` (rôle: ${role})` : ''}\n`);
    
    // Récupérer l'utilisateur
    let user;
    if (role) {
      user = await User.findOne({ email: email.toLowerCase().trim(), role });
    } else {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }
    
    if (!user) {
      console.log(`❌ Aucun utilisateur trouvé pour: ${email}${role ? ` avec le rôle ${role}` : ''}\n`);
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log('═'.repeat(80));
    console.log('📋 PROFIL COMPLET DE L\'UTILISATEUR');
    console.log('═'.repeat(80));
    
    // Informations de base
    console.log('\n🔐 INFORMATIONS D\'AUTHENTIFICATION:');
    console.log('─'.repeat(80));
    console.log(`   🆔 ID unique: ${(user._id as any).toString()}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Rôle: ${user.role}`);
    console.log(`   🔑 Mot de passe: [HACHÉ - NON AFFICHÉ POUR SÉCURITÉ]`);
    
    // Informations personnelles
    console.log('\n👤 INFORMATIONS PERSONNELLES:');
    console.log('─'.repeat(80));
    if (user.fullName) {
      console.log(`   📝 Nom complet: ${user.fullName}`);
    } else {
      console.log(`   📝 Nom complet: ❌ Non renseigné`);
    }
    
    if (user.firstName) {
      console.log(`   👨 Prénom: ${user.firstName}`);
    } else {
      console.log(`   👨 Prénom: ❌ Non renseigné`);
    }
    
    if (user.lastName) {
      console.log(`   👤 Nom: ${user.lastName}`);
    } else {
      console.log(`   👤 Nom: ❌ Non renseigné`);
    }
    
    if (user.phone) {
      console.log(`   📱 Téléphone: ${user.phone}`);
    } else {
      console.log(`   📱 Téléphone: ❌ Non renseigné`);
    }
    
    if (user.address) {
      console.log(`   📍 Adresse: ${user.address}`);
    } else {
      console.log(`   📍 Adresse: ❌ Non renseigné`);
    }
    
    // Informations spécifiques selon le rôle
    console.log('\n🎭 INFORMATIONS SPÉCIFIQUES AU RÔLE:');
    console.log('─'.repeat(80));
    
    if (user.role === 'citoyen') {
      if (user.meterNumber) {
        console.log(`   ⚡ Numéro de compteur: ${user.meterNumber}`);
      } else {
        console.log(`   ⚡ Numéro de compteur: ❌ Non renseigné`);
      }
    }
    
    if (user.role === 'pme') {
      if (user.companyName) {
        console.log(`   🏢 Nom de l'entreprise: ${user.companyName}`);
      } else {
        console.log(`   🏢 Nom de l'entreprise: ❌ Non renseigné`);
      }
      if (user.responsibleName) {
        console.log(`   👔 Nom du responsable: ${user.responsibleName}`);
      } else {
        console.log(`   👔 Nom du responsable: ❌ Non renseigné`);
      }
    }
    
    if (user.role === 'technicien') {
      if (user.matricule) {
        console.log(`   🎫 Matricule: ${user.matricule}`);
      } else {
        console.log(`   🎫 Matricule: ❌ Non renseigné`);
      }
      if (user.department) {
        console.log(`   🏛️ Département: ${user.department}`);
      } else {
        console.log(`   🏛️ Département: ❌ Non renseigné`);
      }
      if (user.sector) {
        console.log(`   📊 Secteur: ${user.sector}`);
      } else {
        console.log(`   📊 Secteur: ❌ Non renseigné`);
      }
      if (user.interventionZone) {
        console.log(`   🗺️ Zone d'intervention: ${user.interventionZone}`);
      } else {
        console.log(`   🗺️ Zone d'intervention: ❌ Non renseigné`);
      }
    }
    
    if (user.role === 'manager' || user.role === 'etat') {
      if (user.department) {
        console.log(`   🏛️ Département: ${user.department}`);
      } else {
        console.log(`   🏛️ Département: ❌ Non renseigné`);
      }
      if (user.ministry) {
        console.log(`   🏛️ Ministère: ${user.ministry}`);
      } else {
        console.log(`   🏛️ Ministère: ❌ Non renseigné`);
      }
    }
    
    // Métadonnées
    console.log('\n📅 MÉTADONNÉES:');
    console.log('─'.repeat(80));
    console.log(`   📅 Date de création: ${user.created_at ? new Date(user.created_at).toLocaleString('fr-FR') : 'N/A'}`);
    console.log(`   🔄 Dernière mise à jour: ${user.updated_at ? new Date(user.updated_at).toLocaleString('fr-FR') : 'N/A'}`);
    
    // Résumé JSON (pour référence technique)
    console.log('\n📄 DONNÉES BRUTES (JSON):');
    console.log('─'.repeat(80));
    const userObject: any = user.toObject();
    if (userObject.password) {
      delete userObject.password; // Ne jamais afficher le mot de passe
    }
    console.log(JSON.stringify(userObject, null, 2));
    
    console.log('\n' + '═'.repeat(80));
    console.log('✅ Profil complet affiché');
    console.log('═'.repeat(80));
    console.log();
    
    // Fermer la connexion
    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération du profil:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Exécuter le script
showUserProfile();

