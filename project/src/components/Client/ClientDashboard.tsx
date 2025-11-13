import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, BarChart3, CreditCard, AlertTriangle, MessageCircle, 
  Bell, TrendingUp, Zap, Lightbulb, AlertCircle, CheckCircle,
  User, Mail, Phone, MapPin, Hash, Calendar, X
} from 'lucide-react';
import { EvaChat } from '../EVA/EvaChat';
import { EvaChatModal } from '../EVA/EvaChatModal';
import { CreateAlertModal } from './CreateAlertModal';
import { InvoicesDashboard } from './InvoicesDashboard';
import { PaymentModal } from './PaymentModal';
import { AlertsNotifications } from './AlertsNotifications';
import { analyzeConsumption, ConsumptionAnalysis } from '../../services/aiAnalysisService';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

export function ClientDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [consumptionAnalysis, setConsumptionAnalysis] = useState<ConsumptionAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showEvaChat, setShowEvaChat] = useState(false);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);

  // Empêcher le scroll du body quand la modal EVA est ouverte
  useEffect(() => {
    if (showEvaChat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showEvaChat]);

  // Données de consommation (à remplacer par des données réelles de l'API)
  const consommationMois = 245; // kWh
  const consommationMoisPrecedent = 213; // kWh
  const hausse = Math.round(((consommationMois - consommationMoisPrecedent) / consommationMoisPrecedent) * 100);
  const montantAPayer = 450000; // GNF
  const nombreAlertes = 3;

  // Analyser la consommation avec l'IA au chargement
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setAnalysisLoading(true);
        const analysis = await analyzeConsumption({
          currentMonth: consommationMois,
          previousMonth: consommationMoisPrecedent,
          averageConsumption: 220,
          peakHours: [20, 21, 22], // Heures de pic simulées
        });
        setConsumptionAnalysis(analysis);
      } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
      } finally {
        setAnalysisLoading(false);
      }
    };

    if (user) {
      fetchAnalysis();
    }
  }, [user, consommationMois, consommationMoisPrecedent]);

  // Récupérer le nom complet de l'utilisateur
  const displayName = user?.fullName || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'Citoyen';

  // Récupérer le nombre d'alertes actives
  useEffect(() => {
    const fetchActiveAlerts = async () => {
      try {
        const response = await apiRequest(`${API_ENDPOINTS.alerts}?status=active`);
        setActiveAlertsCount(response.alerts?.length || 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des alertes:', error);
        // En cas d'erreur, on garde le compteur à 0
        setActiveAlertsCount(0);
      }
    };

    if (user) {
      fetchActiveAlerts();
      // Rafraîchir toutes les 30 secondes
      const interval = setInterval(fetchActiveAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-24">
      {/* Header avec déconnexion */}
      <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
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
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {displayName} ! 👋
          </h1>
        </div>

        {/* Section Mon Profil */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-blue-600">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations personnelles
              </h3>
              
              {user.fullName && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="text-base font-semibold text-gray-900">{user.fullName}</p>
                  </div>
                </div>
              )}

              {(user.firstName || user.lastName) && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Prénom et Nom</p>
                    <p className="text-base font-semibold text-gray-900">
                      {user.firstName || ''} {user.lastName || ''}
                    </p>
                  </div>
                </div>
              )}

              {user.email && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>
              )}

              {user.phone && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-base font-semibold text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="text-base font-semibold text-gray-900">{user.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Informations spécifiques au rôle */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Informations Électricité
              </h3>

              {user.role === 'citoyen' && user.meterNumber && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Hash className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-700">Numéro de compteur</p>
                    <p className="text-base font-bold text-green-900">{user.meterNumber}</p>
                  </div>
                </div>
              )}

              {user.role === 'pme' && (
                <>
                  {user.companyName && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <BarChart3 className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-700">Nom de l'entreprise</p>
                        <p className="text-base font-semibold text-yellow-900">{user.companyName}</p>
                      </div>
                    </div>
                  )}
                  {user.responsibleName && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <User className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-700">Responsable</p>
                        <p className="text-base font-semibold text-yellow-900">{user.responsibleName}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {user.role === 'technicien' && (
                <>
                  {user.matricule && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Hash className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-700">Matricule</p>
                        <p className="text-base font-semibold text-yellow-900">{user.matricule}</p>
                      </div>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <BarChart3 className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-700">Département</p>
                        <p className="text-base font-semibold text-yellow-900">{user.department}</p>
                      </div>
                    </div>
                  )}
                  {user.sector && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <MapPin className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-700">Secteur</p>
                        <p className="text-base font-semibold text-yellow-900">{user.sector}</p>
                      </div>
                    </div>
                  )}
                  {user.interventionZone && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <MapPin className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-700">Zone d'intervention</p>
                        <p className="text-base font-semibold text-yellow-900">{user.interventionZone}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {user.role === 'manager' || user.role === 'etat' ? (
                <>
                  {user.department && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-700">Département</p>
                        <p className="text-base font-semibold text-green-900">{user.department}</p>
                      </div>
                    </div>
                  )}
                  {user.ministry && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-700">Ministère</p>
                        <p className="text-base font-semibold text-green-900">{user.ministry}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : null}

              {/* Date de création du compte */}
              {user.created_at && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mt-4">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Membre depuis</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consommation du mois avec analyse IA */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Votre consommation ce mois-ci : <span className="text-green-600 font-bold">{consommationMois} kWh</span>
          </h2>
          
          {/* Alerte EVA avec analyse IA */}
          {analysisLoading ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                <p className="text-sm text-gray-600">EVA analyse votre consommation...</p>
              </div>
            </div>
          ) : consumptionAnalysis ? (
            <div className={`border rounded-lg p-4 mb-4 ${
              consumptionAnalysis.severity === 'critical' ? 'bg-red-50 border-red-200' :
              consumptionAnalysis.severity === 'high' ? 'bg-orange-50 border-orange-200' :
              consumptionAnalysis.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-3">
                <Zap className={`w-5 h-5 mt-0.5 ${
                  consumptionAnalysis.severity === 'critical' ? 'text-red-600' :
                  consumptionAnalysis.severity === 'high' ? 'text-orange-600' :
                  consumptionAnalysis.severity === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold mb-2 ${
                    consumptionAnalysis.severity === 'critical' ? 'text-red-800' :
                    consumptionAnalysis.severity === 'high' ? 'text-orange-800' :
                    consumptionAnalysis.severity === 'medium' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    🤖 {consumptionAnalysis.message}
                  </p>
                  {consumptionAnalysis.estimatedSavings && (
                    <p className="text-xs text-gray-600 mb-2">
                      💰 Économies potentielles : ~{consumptionAnalysis.estimatedSavings.toLocaleString('fr-FR')} GNF/mois
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    💡 {consumptionAnalysis.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
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
          )}

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

        {/* Conseil EVA avec analyse IA */}
        {consumptionAnalysis && !analysisLoading && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-purple-600">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-purple-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  🤖 Analyse Intelligente EVA
                  {consumptionAnalysis.hasAnomaly && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      consumptionAnalysis.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      consumptionAnalysis.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      Anomalie détectée
                    </span>
                  )}
                </h3>
                <p className="text-gray-700 mb-2">
                  {consumptionAnalysis.recommendation}
                </p>
                {consumptionAnalysis.estimatedSavings && (
                  <p className="text-sm font-semibold text-green-700 mt-2">
                    💰 Économies estimées : {consumptionAnalysis.estimatedSavings.toLocaleString('fr-FR')} GNF/mois
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cartes d'action */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mon Dashboard */}
          <div 
            onClick={() => setShowInvoices(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-green-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">📊 Mon Dashboard</h3>
            </div>
            <p className="text-gray-600 text-sm">Factures, historique et économies</p>
          </div>

          {/* Payer ma facture */}
          <div 
            onClick={() => {
              setSelectedInvoice({
                id: '1',
                amount: montantAPayer,
                period: 'Novembre 2025',
              });
              setShowPayment(true);
            }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-blue-500"
          >
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
          <div 
            onClick={() => setShowCreateAlert(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-orange-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">⚠️ Signaler un problème</h3>
            </div>
            <p className="text-gray-600 text-sm">Panne, fuite, anomalie</p>
          </div>

          {/* Parler à EVA */}
          <div 
            onClick={() => setShowEvaChat(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">💬 Parler à EVA</h3>
            </div>
            <p className="text-gray-600 text-sm">Assistant IA intelligent - Analyse et conseils</p>
          </div>

          {/* Notifications */}
          <div 
            onClick={() => setShowAlerts(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-red-500 relative"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">🔔 Notifications</h3>
            </div>
            <p className="text-gray-600 text-sm">
              {activeAlertsCount > 0 ? (
                <>
                  {activeAlertsCount} nouvelle{activeAlertsCount > 1 ? 's' : ''} alerte{activeAlertsCount > 1 ? 's' : ''}
                </>
              ) : (
                'Aucune nouvelle alerte'
              )}
            </p>
            {activeAlertsCount > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* EVA Chat intégré */}
      {showEvaChat && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowEvaChat(false)}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
          />
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  EVA - Assistant IA
                </h2>
                <button
                  onClick={() => setShowEvaChat(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <EvaChatModal />
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* EVA Chat flottant (si pas ouvert en modal) */}
      {!showEvaChat && <EvaChat position="bottom-right" />}

      {/* Modal de création d'alerte */}
      {showCreateAlert && (
        <CreateAlertModal
          onClose={() => setShowCreateAlert(false)}
          onSuccess={() => {
            setShowCreateAlert(false);
          }}
        />
      )}

      {/* Modal des factures */}
      {showInvoices && (
        <InvoicesDashboard
          onClose={() => setShowInvoices(false)}
          onPayInvoice={(invoice) => {
            setSelectedInvoice(invoice);
            setShowInvoices(false);
            setShowPayment(true);
          }}
        />
      )}

      {/* Modal de paiement */}
      {showPayment && selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowPayment(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            setShowPayment(false);
            setSelectedInvoice(null);
            // Rafraîchir les données si nécessaire
          }}
        />
      )}

      {/* Modal des notifications */}
      {showAlerts && (
        <AlertsNotifications
          onClose={() => setShowAlerts(false)}
          onCreateAlert={() => {
            setShowAlerts(false);
            setShowCreateAlert(true);
          }}
        />
      )}
    </div>
  );
}
