import { Header } from '../Layout/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, CheckCircle, Clock, Users, MessageCircle, AlertTriangle, Zap, BarChart3, Map, Smile, FileText, UserCog, Home, User, Mail, Phone, Building2 } from 'lucide-react';
import { EvaChat } from '../EVA/EvaChat';

export function EtatDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Récupérer le nom complet de l'utilisateur
  const displayName = user?.fullName || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'Agent État';

  const handleSignOut = async () => {
    try {
      await signOut();
      // Nettoyer localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      // Forcer le rechargement pour s'assurer que l'état est mis à jour
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* En-tête avec profil */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenue {displayName} ! 👋
              </h1>
              <p className="text-gray-600">
                Tableau de bord État
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Accueil</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
          
          {/* Informations du profil */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              Mon Profil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">Email:</span>
                <span>{user?.email || 'Non renseigné'}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Téléphone:</span>
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.ministry && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Ministère:</span>
                  <span>{user.ministry}</span>
                </div>
              )}
              {user?.department && (
                <div className="flex items-center gap-2 text-gray-600">
                  <UserCog className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Département:</span>
                  <span>{user.department}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Tickets ouverts</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">147</div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12 aujourd'hui</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Taux de résolution</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">92%</div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+5% ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Temps moyen</h3>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">38 min</div>
            <div className="text-sm text-gray-600">Temps de résolution</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Techniciens actifs</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">45</div>
            <div className="text-sm text-gray-600">Sur 52 agents</div>
          </div>
        </div>

        {/* Performance des équipes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des équipes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Équipe Kaloum</h4>
              <div className="text-3xl font-bold text-green-700">94%</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Équipe Matam</h4>
              <div className="text-3xl font-bold text-blue-700">88%</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Équipe Ratoma</h4>
              <div className="text-3xl font-bold text-yellow-700">91%</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Équipe Dixinn</h4>
              <div className="text-3xl font-bold text-purple-700">85%</div>
            </div>
          </div>
        </div>

        {/* Activité EVA en temps réel */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité EVA en temps réel</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-sm font-semibold text-gray-700">Conversations actives</h4>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">342</div>
              <div className="text-xs text-gray-600">En cours maintenant</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-700">Tickets créés aujourd'hui</h4>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">87</div>
              <div className="text-xs text-gray-600">Via EVA</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Smile className="w-5 h-5 text-yellow-600" />
                <h4 className="text-sm font-semibold text-gray-700">Satisfaction moyenne</h4>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4.7/5</div>
              <div className="text-xs text-gray-600">Cette semaine</div>
            </div>
          </div>
        </div>

        {/* Statistiques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Tickets résolus</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1,247</div>
            <div className="text-sm text-gray-600">Ce mois</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Alertes en attente</h3>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">23</div>
            <div className="text-sm text-gray-600">Nécessitent action</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Disponibilité réseau</h3>
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">98.5%</div>
            <div className="text-sm text-gray-600">24 dernières heures</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Interventions aujourd'hui</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">67</div>
            <div className="text-sm text-gray-600">En cours: 12</div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">📊 Statistiques EVA</h3>
                <p className="text-sm text-gray-600">Performance IA et analytics</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Map className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">🗺️ Vue par zone</h3>
                <p className="text-sm text-gray-600">Carte interactive des régions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Smile className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">😊 Satisfaction client</h3>
                <p className="text-sm text-gray-600">Résultats sondages</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-lg p-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">⚠️ Alertes critiques</h3>
                <p className="text-sm text-gray-600">Incidents et fraudes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">📄 Rapports</h3>
                <p className="text-sm text-gray-600">Rapports automatiques</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 rounded-lg p-3">
                <UserCog className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">👥 Gestion techniciens</h3>
                <p className="text-sm text-gray-600">Assigner et gérer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* EVA Chat intégré */}
      <EvaChat position="bottom-right" />
    </div>
  );
}

