import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUsersByEmail } from '../models/userModel';

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    role: string;
    // Informations personnelles
    fullName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    // Données spécifiques selon le rôle
    meterNumber?: string;
    companyName?: string;
    responsibleName?: string;
    matricule?: string;
    department?: string;
    sector?: string;
    interventionZone?: string;
    ministry?: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
    role?: string; // Rôle optionnel pour la connexion
  };
}

// Générer un token JWT
const generateToken = (userId: string, email: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'your_secret_key_here';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(
    { id: userId, email, role },
    secret,
    {
      expiresIn: expiresIn,
    } as jwt.SignOptions
  );
};

// Inscription
export const register = async (req: RegisterRequest, res: Response) => {
  try {
    const { 
      email, 
      password, 
      role,
      fullName,
      firstName,
      lastName,
      phone,
      address,
      meterNumber,
      companyName,
      responsibleName,
      matricule,
      department,
      sector,
      interventionZone,
      ministry
    } = req.body;

    // Validation des champs obligatoires
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, mot de passe et rôle sont requis' });
    }

    // Normaliser l'email (minuscules)
    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si l'utilisateur existe déjà avec cet email ET ce rôle
    // Permettre le même email avec des rôles différents
    try {
      const existingUser = await getUserByEmail(normalizedEmail, role);
      if (existingUser) {
        console.log(`⚠️ Tentative d'inscription avec email existant: ${normalizedEmail.substring(0, 3)}***, rôle: ${role}`);
        
        // Vérifier quels rôles existent déjà pour cet email
        const usersWithEmail = await getUsersByEmail(normalizedEmail);
        const existingRoles = usersWithEmail.map(u => u.role);
        const roleNames: Record<string, string> = {
          'citoyen': 'Citoyen',
          'pme': 'PME',
          'technicien': 'Technicien',
          'manager': 'Manager',
          'etat': 'État',
          'admin': 'Administrateur'
        };
        const existingRolesFormatted = existingRoles.map(r => roleNames[r] || r).join(', ');
        
        return res.status(400).json({ 
          error: `Un compte avec cet email existe déjà pour le profil "${roleNames[role] || role}". Vous pouvez vous connecter avec ce profil ou créer un compte avec un autre profil (${existingRolesFormatted} déjà utilisés).` 
        });
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la vérification de l\'utilisateur existant:', error);
      // Si c'est une erreur d'index, cela signifie que l'index composé n'est pas encore créé
      // On continue quand même
      if (error.message?.includes('index') || error.message?.includes('E11000')) {
        console.warn('⚠️ Index composé non encore créé, création en cours...');
      } else {
        throw error;
      }
    }

    // Vérifier que le rôle est valide
    const validRoles = ['citoyen', 'pme', 'technicien', 'manager', 'etat', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    // Hacher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur avec toutes les données
    const user = await createUser({
      email: normalizedEmail,
      password: hashedPassword,
      role,
      fullName,
      firstName,
      lastName,
      phone,
      address,
      meterNumber,
      companyName,
      responsibleName,
      matricule,
      department,
      sector,
      interventionZone,
      ministry,
    } as any);

    // Log sécurisé (sans informations sensibles)
    console.log(`✅ Utilisateur créé: ${normalizedEmail}, rôle: ${role}, nom: ${fullName || firstName || 'N/A'}`);

    // Générer le token JWT
    const token = generateToken((user._id as any).toString(), user.email, user.role);

    // Retourner les informations (sans le mot de passe)
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        meterNumber: user.meterNumber,
        companyName: user.companyName,
        responsibleName: user.responsibleName,
        matricule: user.matricule,
        department: user.department,
        sector: user.sector,
        interventionZone: user.interventionZone,
        ministry: user.ministry,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'inscription',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Connexion
export const login = async (req: LoginRequest, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Normaliser l'email (minuscules)
    const normalizedEmail = email.toLowerCase().trim();

    // Si un rôle est fourni, chercher l'utilisateur avec cet email ET ce rôle
    // Sinon, chercher n'importe quel utilisateur avec cet email
    let user;
    if (role) {
      console.log(`🔍 Recherche d'un compte avec email: ${normalizedEmail.substring(0, 3)}***, rôle: ${role}`);
      user = await getUserByEmail(normalizedEmail, role);
      if (!user) {
        // Vérifier si l'email existe avec d'autres rôles
        const usersWithEmail = await getUsersByEmail(normalizedEmail);
        if (usersWithEmail.length > 0) {
          const availableRoles = usersWithEmail.map(u => u.role).join(', ');
          const roleNames: Record<string, string> = {
            'citoyen': 'Citoyen',
            'pme': 'PME',
            'technicien': 'Technicien',
            'manager': 'Manager',
            'etat': 'État',
            'admin': 'Administrateur'
          };
          const availableRolesFormatted = usersWithEmail.map(u => roleNames[u.role] || u.role).join(', ');
          console.log(`⚠️ Aucun compte trouvé pour le rôle ${role}. Rôles disponibles: ${availableRoles}`);
          return res.status(401).json({ 
            error: `Aucun compte trouvé avec cet email pour le profil "${roleNames[role] || role}". Veuillez vous connecter avec le profil : ${availableRolesFormatted}`,
            availableRoles: availableRoles.split(', '),
            suggestedRole: usersWithEmail[0].role
          });
        } else {
          console.log(`⚠️ Aucun compte trouvé avec cet email`);
        }
      } else {
        console.log(`✅ Compte trouvé pour email: ${normalizedEmail.substring(0, 3)}***, rôle: ${role}`);
      }
    } else {
      // Si pas de rôle spécifié, prendre le premier utilisateur trouvé
      console.log(`🔍 Recherche d'un compte avec email: ${normalizedEmail.substring(0, 3)}*** (sans rôle spécifique)`);
      user = await getUserByEmail(normalizedEmail);
      if (user) {
        console.log(`✅ Compte trouvé (rôle: ${user.role})`);
      } else {
        // Vérifier s'il y a plusieurs comptes avec cet email
        const usersWithEmail = await getUsersByEmail(normalizedEmail);
        if (usersWithEmail.length > 1) {
          const availableRoles = usersWithEmail.map(u => u.role).join(', ');
          console.log(`⚠️ Plusieurs comptes trouvés. Rôles disponibles: ${availableRoles}`);
          return res.status(400).json({ 
            error: `Plusieurs comptes trouvés avec cet email. Veuillez spécifier le rôle. Rôles disponibles: ${availableRoles}` 
          });
        }
      }
    }

    if (!user) {
      // Log sécurisé (ne pas exposer si l'email existe ou non)
      console.log(`⚠️ Tentative de connexion échouée pour: ${normalizedEmail.substring(0, 3)}***`);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log sécurisé
      console.log(`⚠️ Tentative de connexion échouée pour: ${normalizedEmail.substring(0, 3)}***`);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Log sécurisé
    console.log(`✅ Connexion réussie: ${normalizedEmail.substring(0, 3)}***, rôle: ${user.role}`);

    // Générer le token JWT
    const token = generateToken((user._id as any).toString(), user.email, user.role);

    // Retourner le token et les informations utilisateur (sans le mot de passe)
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        meterNumber: user.meterNumber,
        companyName: user.companyName,
        responsibleName: user.responsibleName,
        matricule: user.matricule,
        department: user.department,
        sector: user.sector,
        interventionZone: user.interventionZone,
        ministry: user.ministry,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la connexion',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Déconnexion (optionnel, car JWT est stateless)
export const logout = async (_req: Request, res: Response) => {
  try {
    // Avec JWT, la déconnexion se fait côté client en supprimant le token
    // Ici, on peut simplement retourner un message de succès
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error: any) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
};
