import { Link, useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import logoImage from "../../assets/guineaSmart.jpg";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const isFAQPage = location.pathname === '/faq';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleSignOut = async () => {
    try {
      await signOut();
      // Nettoyer localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Rediriger vers la page d'accueil
      navigate('/');
      // Forcer un rechargement pour s'assurer que l'état est mis à jour
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="w-full bg-white text-gray-800 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo à gauche ou Bouton retour si FAQ */}
        <div className="flex items-center gap-2">
          {isFAQPage ? (
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
          ) : (
            <Link to="/">
              <img
                src={logoImage}
                alt="Logo Guinea Smart Electricity"
                className="h-20 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          )}
        </div>

        {/* Connexion / Inscription / FAQ à droite */}
        <nav className="flex items-center gap-4">
          <Link
            to="/faq"
            className="text-green-600 hover:text-green-700 transition-all duration-200 p-2.5 rounded-full hover:bg-green-50 flex items-center justify-center group relative border-2 border-green-200 hover:border-green-400"
            title="Questions Fréquentes (FAQ)"
          >
            <HelpCircle className="w-7 h-7 group-hover:scale-110 transition-transform" strokeWidth={2.5} fill="currentColor" fillOpacity={0.1} />
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Se déconnecter</span>
            </button>
          ) : (
            <>
              <Link
                to="/select-profile"
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Connexion
              </Link>
              <Link
                to="/select-profile?mode=register"
                className="px-4 py-2 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
