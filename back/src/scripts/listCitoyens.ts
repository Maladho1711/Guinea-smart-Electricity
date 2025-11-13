import dotenv from 'dotenv';
import connectDB from '../config/db';
import User from '../models/userModel';
import mongoose from 'mongoose';

// Charger les variables d'environnement
dotenv.config();

const listCitoyens = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    console.log('\n🔍 Recherche des utilisateurs avec le rôle "citoyen"...\n');
    
    // Récupérer tous les utilisateurs avec le rôle "citoyen"
    const citoyens = await User.find({ role: 'citoyen' })
      .select('email fullName firstName lastName phone address meterNumber created_at')
      .sort({ created_at: -1 }); // Trier par date de création (plus récent en premier)
    
    if (citoyens.length === 0) {
      console.log('❌ Aucun utilisateur avec le rôle "citoyen" trouvé.\n');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log(`✅ ${citoyens.length} utilisateur(s) trouvé(s) avec le rôle "citoyen":\n`);
    console.log('═'.repeat(80));
    
    citoyens.forEach((citoyen, index) => {
      console.log(`\n📧 Email: ${citoyen.email}`);
      if (citoyen.fullName) {
        console.log(`   Nom complet: ${citoyen.fullName}`);
      }
      if (citoyen.firstName || citoyen.lastName) {
        console.log(`   Prénom: ${citoyen.firstName || 'N/A'}`);
        console.log(`   Nom: ${citoyen.lastName || 'N/A'}`);
      }
      if (citoyen.phone) {
        console.log(`   Téléphone: ${citoyen.phone}`);
      }
      if (citoyen.address) {
        console.log(`   Adresse: ${citoyen.address}`);
      }
      if (citoyen.meterNumber) {
        console.log(`   Numéro de compteur: ${citoyen.meterNumber}`);
      }
      console.log(`   Date de création: ${citoyen.created_at ? new Date(citoyen.created_at).toLocaleString('fr-FR') : 'N/A'}`);
      if (index < citoyens.length - 1) {
        console.log('─'.repeat(80));
      }
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\n📊 Résumé: ${citoyens.length} citoyen(s) enregistré(s)\n`);
    
    // Afficher uniquement les emails
    console.log('📧 Liste des emails uniquement:');
    console.log('─'.repeat(80));
    citoyens.forEach((citoyen) => {
      console.log(`   • ${citoyen.email}`);
    });
    console.log('─'.repeat(80));
    console.log();
    
    // Fermer la connexion
    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des citoyens:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Exécuter le script
listCitoyens();

