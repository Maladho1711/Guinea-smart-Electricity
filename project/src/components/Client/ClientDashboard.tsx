import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, BarChart3, CreditCard, AlertTriangle, MessageCircle, 
  Bell, TrendingUp, Zap, Lightbulb, AlertCircle, CheckCircle
} from 'lucide-react';
import { EvaChat } from '../EVA/EvaChat';

export function ClientDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Données de consommation (à remplacer par des données réelles de l'API)
  const consommationMois = 245; // kWh
  const consommationMoisPrecedent = 213; // kWh
  const hausse = Math.round(((consommationMois - consommationMoisPrecedent) / consommationMoisPrecedent) * 100);
  const montantAPayer = 450000; // GNF
  const nombreAlertes = 3;

  // Récupérer le nom complet de l'utilisateur
  const displayName = user?.fullName || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'Citoyen';

  useEffect(() => {
    // Vérifier l'authentification
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const token = localStorage.getItem('token');
    
    if (!isAuthenticated || !token || !user) {
      console.log('⚠️ Utilisateur non authentifié, redirection...');
      navigate('/');
      return;
    }
    
    setLoading(false);
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
            <Zap className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header avec déconnexion */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message de bienvenue */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {displayName} ! 👋
          </h1>
        </div>

        {/* Consommation du mois */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Votre consommation ce mois-ci : <span className="text-green-600 font-bold">{consommationMois} kWh</span>
          </h2>
          
          {/* Alerte EVA */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  EVA a détecté une hausse de {hausse}% par rapport au mois dernier.
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-700">{consommationMois}</p>
              <p className="text-sm text-gray-600 mt-1">kWh ce mois</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-700">{Math.round(montantAPayer / 1000)}K</p>
              <p className="text-sm text-gray-600 mt-1">GNF à payer</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-orange-700">{nombreAlertes}</p>
              <p className="text-sm text-gray-600 mt-1">Alertes</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-700">{hausse}%</p>
              <p className="text-sm text-gray-600 mt-1">Hausse</p>
            </div>
          </div>
        </div>

        {/* Conseil EVA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-purple-600">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Conseil EVA</h3>
              <p className="text-gray-700">
                Votre consommation est élevée le soir (20h-23h). Éteignez les appareils non utilisés pour économiser jusqu'à 35,000 GNF/mois.
              </p>
            </div>
          </div>
        </div>

        {/* Cartes d'action */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mon Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">📊 Mon Dashboard</h3>
            </div>
            <p className="text-gray-600 text-sm">Factures, historique et économies</p>
          </div>

          {/* Payer ma facture */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-blue-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">💳 Payer ma facture</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Facture en attente : <span className="font-semibold text-blue-600">{montantAPayer.toLocaleString('fr-FR')} GNF</span>
            </p>
          </div>

          {/* Signaler un problème */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-orange-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">⚠️ Signaler un problème</h3>
            </div>
            <p className="text-gray-600 text-sm">Panne, fuite, anomalie</p>
          </div>

          {/* Parler à EVA */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-purple-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">💬 Parler à EVA</h3>
            </div>
            <p className="text-gray-600 text-sm">Assistant IA intelligent</p>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-red-500 relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">🔔 Notifications</h3>
            </div>
            <p className="text-gray-600 text-sm">
              {nombreAlertes} nouvelle{nombreAlertes > 1 ? 's' : ''} alerte{nombreAlertes > 1 ? 's' : ''}
            </p>
            {nombreAlertes > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {nombreAlertes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* EVA Chat intégré */}
      <EvaChat position="bottom-right" />
    </div>
  );
}
