import { useState } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { FAQ } from './components/Layout/FAQ';
import { ProfileSelection } from './components/Auth/ProfileSelection';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ClientDashboard } from './components/Client/ClientDashboard';
import { PMEDashboard } from './components/PME/PMEDashboard';
import { TechnicianDashboard } from './components/Technician/TechnicianDashboard';
import { ManagerDashboard } from './components/Manager/ManagerDashboard';
import { EtatDashboard } from './components/Etat/EtatDashboard';
import { LandingPage } from './components/Landing/LandingPage';
import { PostRegistrationRedirect } from './components/Auth/PostRegistrationRedirect';
import { Zap } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const { user, profile, loading } = useAuth();

  // Vérifier localStorage au début pour éviter le flash de la page d'accueil
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const storedRole = localStorage.getItem('userRole');
  const isDashboardRoute = ['/manager-dashboard', '/pme-dashboard', '/technician-dashboard', '/etat-dashboard', '/post-registration'].includes(location.pathname);

  // Si on est sur une route de dashboard et authentifié dans localStorage, 
  // NE JAMAIS afficher la page d'accueil - toujours afficher un écran de chargement ou le dashboard
  if (isDashboardRoute && isAuthenticated) {
    // Si la session est en cours de chargement ou pas encore chargée, afficher un écran de chargement
    if (loading || !user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
              <Zap className="w-12 h-12 text-white animate-pulse" />
            </div>
            <p className="text-gray-600">Chargement de la session...</p>
          </div>
        </div>
      );
    }
    // Si la session est chargée, laisser les vérifications spécifiques de chaque dashboard gérer l'affichage
  }

  // Afficher la FAQ si on est sur la route /faq
  if (location.pathname === '/faq') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <FAQ />
      </div>
    );
  }

  // Afficher la page de redirection après inscription (même si l'utilisateur est connecté)
  if (location.pathname === '/post-registration') {
    return <PostRegistrationRedirect />;
  }

  // Afficher les dashboards (rediriger vers landing si non connecté)
  if (location.pathname === '/pme-dashboard') {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('userRole');

    if (isAuthenticated && storedRole === 'client' && (user || !loading)) {
      return <PMEDashboard />;
    }

    if (!user || !profile) {
      if (isAuthenticated && storedRole === 'client') {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
                <Zap className="w-12 h-12 text-white animate-pulse" />
              </div>
              <p className="text-gray-600">Chargement de la session...</p>
            </div>
          </div>
        );
      }
      navigate('/');
      return null;
    }
    return <PMEDashboard />;
  }

  if (location.pathname === '/technician-dashboard') {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('userRole');

    if (isAuthenticated && storedRole === 'technicien' && (user || !loading)) {
      return <TechnicianDashboard />;
    }

    if (!user || !profile) {
      if (isAuthenticated && storedRole === 'technicien') {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
                <Zap className="w-12 h-12 text-white animate-pulse" />
              </div>
              <p className="text-gray-600">Chargement de la session...</p>
            </div>
          </div>
        );
      }
      navigate('/');
      return null;
    }
    return <TechnicianDashboard />;
  }

  if (location.pathname === '/manager-dashboard') {
    // Si authentifié dans localStorage et rôle manager, autoriser l'accès immédiatement
    if (isAuthenticated && storedRole === 'manager') {
      // Si la session n'est pas encore chargée, afficher un écran de chargement
      if (loading && !user) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
                <Zap className="w-12 h-12 text-white animate-pulse" />
              </div>
              <p className="text-gray-600">Chargement de la session...</p>
            </div>
          </div>
        );
      }
      // Afficher le dashboard même si le profil n'est pas encore chargé
      return <ManagerDashboard />;
    }

    // Si pas authentifié dans localStorage, vérifier le profil normalement
    if (!user || !profile) {
      // Si pas de session et pas authentifié dans localStorage, rediriger
      if (!isAuthenticated) {
        navigate('/');
        return null;
      }
      // Si authentifié dans localStorage mais session pas encore chargée, attendre
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
              <Zap className="w-12 h-12 text-white animate-pulse" />
            </div>
            <p className="text-gray-600">Chargement de la session...</p>
          </div>
        </div>
      );
    }

    // Vérifier que le profil a le bon rôle
    if (profile.role !== 'manager') {
      // Si le rôle ne correspond pas, nettoyer localStorage et rediriger
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      navigate('/');
      return null;
    }

    return <ManagerDashboard />;
  }

  if (location.pathname === '/etat-dashboard') {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('userRole');

    if (isAuthenticated && storedRole === 'manager' && (user || !loading)) {
      return <EtatDashboard />;
    }

    if (!user || !profile) {
      if (isAuthenticated && storedRole === 'manager') {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
                <Zap className="w-12 h-12 text-white animate-pulse" />
              </div>
              <p className="text-gray-600">Chargement de la session...</p>
            </div>
          </div>
        );
      }
      navigate('/');
      return null;
    }
    return <EtatDashboard />;
  }

  // Afficher la sélection de profil en modal si on est sur la route /select-profile
  const showProfileModal = location.pathname === '/select-profile';
  const isRegisterMode = location.search.includes('mode=register');
  const isRegisterRoute = location.pathname === '/register';
  const isLoginRoute = location.pathname === '/login';

  if (loading) {
    // Si on est sur une route de dashboard et authentifié, on a déjà géré l'affichage plus haut
    if (isDashboardRoute && isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
              <Zap className="w-12 h-12 text-white animate-pulse" />
            </div>
            <p className="text-gray-600">Chargement de la session...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
            <Zap className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-xl font-semibold text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si on est sur une route de dashboard et authentifié, ne pas afficher la page d'accueil
  if (isDashboardRoute && isAuthenticated && (!user || !profile)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
            <Zap className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    // Si on est sur /register, afficher le formulaire (qui gère son propre Header si citoyen)
    if (isRegisterRoute) {
      const selectedProfileId = sessionStorage.getItem('selectedProfileId');
      const isCitoyen = selectedProfileId === 'citoyen';

      return (
        <>
          {!isCitoyen && <Header />}
          <RegisterForm onToggle={() => navigate('/select-profile?mode=register')} />
          {showProfileModal && (
            <ProfileSelection onClose={() => navigate('/')} mode={isRegisterMode ? 'register' : 'login'} />
          )}
        </>
      );
    }

    // Si on est sur /login, afficher avec Header
    if (isLoginRoute) {
      return (
        <>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="pt-20 flex items-center justify-center min-h-screen">
              <LoginForm onToggle={() => navigate('/select-profile')} />
            </div>
          </div>
          {showProfileModal && (
            <ProfileSelection onClose={() => navigate('/')} mode={isRegisterMode ? 'register' : 'login'} />
          )}
        </>
      );
    }

    // Si on est sur /select-profile, afficher la sélection de profil
    if (showProfileModal) {
      return (
        <>
          <LandingPage onGetStarted={(isLogin) => {
            if (isLogin) {
              navigate('/select-profile');
            } else {
              navigate('/select-profile?mode=register');
            }
          }} />
          <ProfileSelection onClose={() => navigate('/')} mode={isRegisterMode ? 'register' : 'login'} />
        </>
      );
    }

    // Par défaut, afficher la page d'accueil (LandingPage)
    return (
      <>
        <LandingPage onGetStarted={(isLogin) => {
          if (isLogin) {
            navigate('/select-profile');
          } else {
            navigate('/select-profile?mode=register');
          }
        }} />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        {profile.role === 'client' && <ClientDashboard />}
        {profile.role === 'technicien' && <TechnicianDashboard />}
        {profile.role === 'manager' && <ManagerDashboard />}
      </div>
      {showProfileModal && (
        <ProfileSelection onClose={() => navigate('/')} />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
