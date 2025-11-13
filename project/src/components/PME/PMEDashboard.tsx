import { BarChart3, TrendingDown, CreditCard, AlertCircle, Bell, Building2, MapPin, Phone, Mail, Zap, CheckCircle, User } from 'lucide-react';
import { Header } from '../Layout/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { EvaChat } from '../EVA/EvaChat';

export function PMEDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Récupérer le nom complet de l'utilisateur
  const displayName = user?.fullName || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'PME';

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
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue {displayName} ! 👋
            </h1>
            <p className="text-gray-600">
              Tableau de bord PME
            </p>
          </div>
          
          {/* Informations du profil */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              Mon Profil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
              {user?.companyName && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Entreprise:</span>
                  <span>{user.companyName}</span>
                </div>
              )}
              {user?.responsibleName && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Responsable:</span>
                  <span>{user.responsibleName}</span>
                </div>
              )}
              {user?.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Adresse:</span>
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consommation principale */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              EDG
            </h2>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">-12%</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Consommation ce mois</h3>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-2">3,450</div>
              <div className="text-sm text-gray-600 mb-2">kWh</div>
              <div className="text-xs text-gray-500">Consommation ce mois</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">-12%</div>
              <div className="text-sm text-gray-600 mb-2">Évolution</div>
              <div className="text-xs text-gray-500">vs mois dernier</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-700 mb-2">1,250K</div>
              <div className="text-sm text-gray-600 mb-2">GNF</div>
              <div className="text-xs text-gray-500">Montant à payer</div>
            </div>
          </div>

          {/* Consommation mensuelle */}
          <div className="bg-gray-50 rounded-xl p-6 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Consommation mensuelle</h4>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">Janvier 2025</span>
              <span className="text-sm font-semibold text-gray-900">3,450 kWh / 4,000 kWh</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div className="bg-green-600 h-4 rounded-full" style={{ width: '86.25%' }}></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">3,450</div>
                <div className="text-xs text-gray-600">kWh ce mois</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">-12%</div>
                <div className="text-xs text-gray-600">vs mois dernier</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">362</div>
                <div className="text-xs text-gray-600">GNF Prix moyen/kWh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">550</div>
                <div className="text-xs text-gray-600">kWh restants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs d'économie */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Objectifs d'économie</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Objectif mensuel</span>
              <span className="text-sm font-bold text-green-600">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-green-600 h-3 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <p className="text-sm text-gray-600">Économisé: 340,000 GNF</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 rounded-lg p-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">🎯 Excellent !</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Vous êtes en bonne voie pour atteindre votre objectif</p>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Payer ma facture</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-lg p-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Signaler un problème</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Voir mes statistiques</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Mes factures et Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Mes factures</h3>
            <p className="text-sm text-gray-600">Aucune facture en attente</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Notifications</h3>
                <p className="text-sm text-gray-600">Aucune nouvelle notification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations entreprise */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Informations entreprise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Secteur d'activité</p>
                  <p className="text-gray-900">Commerce</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Puissance souscrite</p>
                  <p className="text-gray-900">15 kVA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Téléphone</p>
                  <p className="text-gray-900">+224 622 123 456</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Heures de pointe</p>
                  <p className="text-gray-900">08h-12h</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Responsable</p>
                  <p className="text-gray-900">Aissatou Bella Bah</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Adresse</p>
                  <p className="text-gray-900">Kaloum, Conakry</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Email</p>
                  <p className="text-gray-900">contact@entreprisesarl.gn</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Économies totales</p>
                  <p className="text-green-600 font-bold text-lg">2.4M GNF</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de déconnexion */}
        <div className="flex justify-end">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
      
      {/* EVA Chat intégré */}
      <EvaChat position="bottom-right" />
    </div>
  );
}

