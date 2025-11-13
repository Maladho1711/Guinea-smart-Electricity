import { CheckCircle, TrendingUp, AlertTriangle, Bot, BarChart3, CreditCard, AlertCircle, MessageCircle, Bell, User, Mail, Phone, MapPin, Zap } from 'lucide-react';
import { Header } from '../Layout/Header';
import { useAuth } from '../../contexts/AuthContext';

export function PostRegistrationRedirect() {
  const { user, profile } = useAuth();

  // Récupérer le nom complet de l'utilisateur
  const displayName = user?.fullName || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'Citoyen';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Message de bienvenue avec profil */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour {displayName} ! 👋
          </h1>
          <p className="text-gray-600 mb-4">
            Votre compte a été créé avec succès. Bienvenue sur Guinea Smart Electricity !
          </p>
          
          {/* Informations du profil */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              Mes Informations
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
              {user?.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Adresse:</span>
                  <span>{user.address}</span>
                </div>
              )}
              {user?.meterNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Compteur:</span>
                  <span>{user.meterNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consommation principale */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Votre consommation ce mois-ci : <span className="text-green-600">245 kWh</span>
            </h2>
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">+15%</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            EVA a détecté une hausse de 15% par rapport au mois dernier.
          </p>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-700 mb-1">245</div>
              <div className="text-sm text-gray-600">kWh ce mois</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-700 mb-1">450K</div>
              <div className="text-sm text-gray-600">GNF à payer</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-700 mb-1">3</div>
              <div className="text-sm text-gray-600">Alertes</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-700 mb-1">15%</div>
              <div className="text-sm text-gray-600">Hausse</div>
            </div>
          </div>
        </div>

        {/* Conseil EVA */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Conseil EVA</h3>
              <p className="text-gray-700">
                Votre consommation est élevée le soir (20h-23h). Éteignez les appareils non utilisés pour économiser jusqu'à 35,000 GNF/mois.
              </p>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">📊 Mon Dashboard</h3>
                <p className="text-sm text-gray-600">Factures, historique et économies</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">💳 Payer ma facture</h3>
                <p className="text-sm text-gray-600">Facture en attente : 450 000 GNF</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-lg p-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">⚠️ Signaler un problème</h3>
                <p className="text-sm text-gray-600">Panne, fuite, anomalie</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">💬 Parler à EVA</h3>
                <p className="text-sm text-gray-600">Assistant IA intelligent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">🔔 Notifications</h3>
              <p className="text-sm text-gray-600">3 nouvelles alertes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

