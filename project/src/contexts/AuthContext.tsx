import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_ENDPOINTS, apiRequest } from '../config/api';

// Interface utilisateur compatible avec le backend
export interface BackendUser {
  id: string;
  email: string;
  role: 'citoyen' | 'pme' | 'technicien' | 'manager' | 'etat' | 'admin';
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  meterNumber?: string;
  companyName?: string;
  responsibleName?: string;
  matricule?: string;
  department?: string;
  sector?: string;
  interventionZone?: string;
  ministry?: string;
  created_at: string;
}

// Interface pour le profil (compatible avec l'ancien système)
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'client' | 'technicien' | 'manager' | 'pme' | 'etat' | 'admin';
}

interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  meterNumber?: string;
  companyName?: string;
  responsibleName?: string;
  matricule?: string;
  department?: string;
  sector?: string;
  interventionZone?: string;
  ministry?: string;
  role: Profile['role'];
}

interface AuthContextType {
  user: BackendUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string, role?: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mapper les rôles du frontend vers les rôles du backend
const mapRoleToBackend = (role: Profile['role']): BackendUser['role'] => {
  const roleMap: Record<Profile['role'], BackendUser['role']> = {
    'client': 'citoyen',
    'technicien': 'technicien',
    'manager': 'manager',
    'pme': 'pme',
    'etat': 'etat',
    'admin': 'admin',
  };
  return roleMap[role] || 'citoyen';
};

// Mapper les rôles du backend vers les rôles du frontend
const mapRoleFromBackend = (role: BackendUser['role']): Profile['role'] => {
  const roleMap: Record<BackendUser['role'], Profile['role']> = {
    'citoyen': 'client',
    'technicien': 'technicien',
    'manager': 'manager',
    'pme': 'pme',
    'etat': 'etat',
    'admin': 'admin', // Admin garde son rôle admin dans le frontend
  };
  return roleMap[role] || 'client';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour créer un utilisateur citoyen fictif
  const createCitizenUser = () => {
    const citizenUser: BackendUser = {
      id: 'citizen-' + Date.now(),
      email: 'citoyen@edg.gn',
      role: 'citoyen',
      created_at: new Date().toISOString(),
    };
    
    setUser(citizenUser);
    setProfile({
      id: citizenUser.id,
      email: citizenUser.email,
      full_name: 'Citoyen',
      role: 'client',
    });
    setLoading(false);
  };

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userRole = localStorage.getItem('userRole');
        
        if (storedUser && token) {
          // Utilisateur avec compte backend (Citoyen, PME, Technicien, Manager, État)
          const userData: BackendUser = JSON.parse(storedUser);
          setUser(userData);
          
          // Créer le profil à partir de l'utilisateur
          const mappedRole = mapRoleFromBackend(userData.role);
          setProfile({
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name || userData.email.split('@')[0],
            role: mappedRole,
          });
          
          // S'assurer que userRole est cohérent
          localStorage.setItem('userRole', mappedRole);
        } else if (isAuthenticated && userRole === 'client') {
          // Citoyen connecté sans compte backend (connexion simplifiée)
          // Créer un utilisateur fictif pour éviter le blocage en "chargement"
          createCitizenUser();
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        // Nettoyer les données invalides
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const signIn = async (email: string, password: string, role?: string) => {
    try {
      console.log('📡 Envoi de la requête de connexion à:', API_ENDPOINTS.auth.login);
      console.log('📧 Email:', email);
      if (role) {
        console.log('👤 Rôle:', role);
      }
      
      const data = await apiRequest(API_ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });

      console.log('📦 Réponse reçue:', { 
        hasToken: !!data.token, 
        hasUser: !!data.user,
        userRole: data.user?.role 
      });

      if (data.token && data.user) {
        // Stocker le token et l'utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        const mappedRole = mapRoleFromBackend(data.user.role);
        localStorage.setItem('userRole', mappedRole);
        
        console.log('💾 Données stockées:', {
          token: 'présent',
          user: 'présent',
          role: mappedRole
        });
        
        setUser(data.user);
        setProfile({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.fullName || data.user.email.split('@')[0],
          role: mappedRole,
        });
      } else {
        console.error('❌ Réponse invalide:', data);
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Erreur lors de la connexion:', errorMessage);
      console.error('❌ Détails de l\'erreur:', error);
      
      // Message d'erreur spécifique pour les erreurs de connexion
      if ((error as any)?.isConnectionError) {
        throw new Error('Le serveur backend n\'est pas accessible. Veuillez démarrer le serveur avec "npm run dev" dans le dossier "back".');
      }
      
      // Créer une erreur enrichie avec les informations supplémentaires
      const enrichedError = new Error(errorMessage || 'Email ou mot de passe incorrect');
      if ((error as any)?.availableRoles) {
        (enrichedError as any).availableRoles = (error as any).availableRoles;
      }
      if ((error as any)?.suggestedRole) {
        (enrichedError as any).suggestedRole = (error as any).suggestedRole;
      }
      throw enrichedError;
    }
  };

  const signUp = async (signUpData: SignUpData) => {
    try {
      const backendRole = mapRoleToBackend(signUpData.role);
      
      const data = await apiRequest(API_ENDPOINTS.auth.register, {
        method: 'POST',
        body: JSON.stringify({
          email: signUpData.email,
          password: signUpData.password,
          role: backendRole,
          fullName: signUpData.fullName,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
          phone: signUpData.phone,
          address: signUpData.address,
          meterNumber: signUpData.meterNumber,
          companyName: signUpData.companyName,
          responsibleName: signUpData.responsibleName,
          matricule: signUpData.matricule,
          department: signUpData.department,
          sector: signUpData.sector,
          interventionZone: signUpData.interventionZone,
          ministry: signUpData.ministry,
        }),
      });

      if (data.token && data.user) {
        // Stocker le token et l'utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', mapRoleFromBackend(data.user.role));
        
        setUser(data.user);
        setProfile({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.fullName || signUpData.fullName || data.user.email.split('@')[0],
          role: mapRoleFromBackend(data.user.role),
        });
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Message d'erreur spécifique pour les erreurs de connexion
      if (error?.isConnectionError) {
        throw new Error('Le serveur backend n\'est pas accessible. Veuillez démarrer le serveur avec "npm run dev" dans le dossier "back".');
      }
      
      // Gérer les erreurs de validation du backend
      if (error.status === 400 && error.message?.includes('validation')) {
        // Si le backend retourne des détails de validation, les utiliser
        const errorMessage = error.message || 'Erreurs de validation. Veuillez vérifier vos informations.';
        throw new Error(errorMessage);
      }
      
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Appeler l'endpoint de déconnexion (optionnel)
        try {
          await apiRequest(API_ENDPOINTS.auth.logout, {
            method: 'POST',
          });
        } catch (error) {
          // Ignorer les erreurs de déconnexion
          console.warn('Erreur lors de la déconnexion côté serveur:', error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
