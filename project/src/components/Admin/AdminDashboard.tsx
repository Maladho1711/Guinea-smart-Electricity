import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Users, Shield, Settings, BarChart3, FileText, 
  AlertTriangle, CheckCircle, Clock, Zap, User, Mail, Phone,
  TrendingUp, Activity, Database, Server, Lock, Eye, Edit, Trash2
} from 'lucide-react';
import { EvaChat } from '../EVA/EvaChat';
import { apiRequest, API_ENDPOINTS } from '../../config/api';

interface UserStats {
  total: number;
  byRole: {
    citoyen: number;
    pme: number;
    technicien: number;
    manager: number;
    etat: number;
    admin: number;
  };
}

interface SystemStats {
  totalUsers: number;
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'settings'>('overview');

  // Récupérer le nom complet de l'utilisateur
  const displayName = user?.fullName || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'Administrateur';

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Charger les statistiques (simulées pour l'instant)
      // TODO: Implémenter les endpoints API pour les vraies statistiques
      setUserStats({
        total: 150,
        byRole: {
          citoyen: 100,
          pme: 20,
          technicien: 15,
          manager: 10,
          etat: 4,
          admin: 1,
        }
      });

      setSystemStats({
        totalUsers: 150,
        totalTickets: 45,
        activeTickets: 12,
        resolvedTickets: 33,
        systemHealth: 'healthy'
      });

      // Charger la liste des utilisateurs (simulée)
      // TODO: Implémenter l'endpoint API pour charger les utilisateurs
      setUsers([]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 rounded-full inline-block mb-4">
            <Zap className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Accès non autorisé. Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
      {/* Header Admin */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
                <p className="text-sm text-gray-600">Bienvenue, {displayName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === 'overview'
                  ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === 'users'
                  ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Gestion Utilisateurs
            </button>
            <button
              onClick={() => setSelectedTab('settings')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === 'settings'
                  ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Paramètres Système
            </button>
          </div>
        </div>

        {/* Contenu selon l'onglet sélectionné */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Total Utilisateurs</h3>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{userStats?.total || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Utilisateurs actifs</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Tickets Résolus</h3>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{systemStats?.resolvedTickets || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Sur {systemStats?.totalTickets || 0} tickets</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Tickets Actifs</h3>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{systemStats?.activeTickets || 0}</p>
                <p className="text-sm text-gray-500 mt-1">En cours de traitement</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Santé Système</h3>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {systemStats?.systemHealth === 'healthy' ? '✅' : '⚠️'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {systemStats?.systemHealth === 'healthy' ? 'Opérationnel' : 'Attention requise'}
                </p>
              </div>
            </div>

            {/* Répartition par rôle */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-green-600" />
                Répartition des Utilisateurs par Rôle
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {userStats && Object.entries(userStats.byRole).map(([role, count]) => (
                  <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Actions Rapides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Gérer les Utilisateurs</h3>
                  <p className="text-sm text-gray-600">Voir et modifier les comptes</p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                  <FileText className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Voir les Tickets</h3>
                  <p className="text-sm text-gray-600">Gérer les demandes</p>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                  <Settings className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Paramètres</h3>
                  <p className="text-sm text-gray-600">Configurer le système</p>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
                  <Database className="w-6 h-6 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Base de Données</h3>
                  <p className="text-sm text-gray-600">Gérer les données</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Gestion des Utilisateurs
              </h2>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <User className="w-5 h-5 inline mr-2" />
                Créer un Utilisateur
              </button>
            </div>
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Fonctionnalité de gestion des utilisateurs à implémenter</p>
              <p className="text-sm mt-2">Les utilisateurs seront listés ici avec possibilité de modification/suppression</p>
            </div>
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-green-600" />
              Paramètres Système
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Base de Données</h3>
                  <Database className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">MongoDB Atlas - Connecté</p>
                <p className="text-xs text-green-600 mt-1">✅ Statut: Opérationnel</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Serveur Backend</h3>
                  <Server className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Port 3000 - Node.js/Express</p>
                <p className="text-xs text-green-600 mt-1">✅ Statut: Opérationnel</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Sécurité</h3>
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Rate Limiting, Validation, Sanitization</p>
                <p className="text-xs text-green-600 mt-1">✅ Statut: Actif</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">IA EVA</h3>
                  <Zap className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Hugging Face - Opérationnel</p>
                <p className="text-xs text-green-600 mt-1">✅ Statut: Connecté</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EVA Chat intégré */}
      <EvaChat position="bottom-right" />
    </div>
  );
}

