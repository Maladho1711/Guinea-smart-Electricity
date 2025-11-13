import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Clock, Home, LayoutGrid, User, Mail, Phone, Zap, Badge } from 'lucide-react';
import { EvaChat } from '../EVA/EvaChat';

interface Ticket {
  id: string;
  title: string;
  priority: 'Urgent' | 'Moyen' | 'Faible';
  location: string;
  time: string;
  status: 'En attente' | 'En cours' | 'Résolu';
  description: string;
}

export function TechnicianDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Récupérer le nom complet de l'utilisateur
  const displayName = user?.fullName || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'Technicien';

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

  const tickets: Ticket[] = [
    {
      id: 'TKT-2025-00123',
      title: 'Coupure d\'électricité',
      priority: 'Urgent',
      location: 'Quartier Nzeng-Ayong, Conakry',
      time: 'Il y a 15 min',
      status: 'En attente',
      description: 'Panne générale affectant 45 foyers. Zone industrielle nécessitant intervention urgente.'
    },
    {
      id: 'TKT-2025-00122',
      title: 'Compteur défectueux',
      priority: 'Moyen',
      location: 'Cité de la Démocratie, Conakry',
      time: 'Il y a 1h',
      status: 'En attente',
      description: 'Compteur ne s\'allume plus. Client signale des facturations anormales depuis 2 mois.'
    },
    {
      id: 'TKT-2025-00121',
      title: 'Câble endommagé',
      priority: 'Urgent',
      location: 'Quartier Sorbonne, Conakry',
      time: 'Il y a 2h',
      status: 'En cours',
      description: 'Câble aérien sectionné suite à chute d\'arbre. Risque électrique important.'
    },
    {
      id: 'TKT-2025-00120',
      title: 'Surcharge réseau',
      priority: 'Urgent',
      location: 'Matam Centre, Conakry',
      time: 'Il y a 3h',
      status: 'En attente',
      description: 'Transformateur en surchauffe. 120 clients affectés. Intervention préventive requise.'
    },
    {
      id: 'TKT-2025-00119',
      title: 'Fraude électrique',
      priority: 'Moyen',
      location: 'Ratoma, Conakry',
      time: 'Il y a 4h',
      status: 'En attente',
      description: 'Branchement illégal détecté par EVA. Vérification et régularisation nécessaires.'
    },
    {
      id: 'TKT-2025-00118',
      title: 'Installation nouveau compteur',
      priority: 'Faible',
      location: 'Kaloum, Conakry',
      time: 'Il y a 5h',
      status: 'En attente',
      description: 'Nouveau client PME. Installation compteur triphasé 15 kVA programmée.'
    },
    {
      id: 'TKT-2025-00117',
      title: 'Maintenance préventive',
      priority: 'Faible',
      location: 'Dixinn, Conakry',
      time: 'Il y a 6h',
      status: 'En attente',
      description: 'Contrôle annuel des installations électriques d\'un immeuble de 8 appartements.'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Moyen':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Faible':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-orange-100 text-orange-700';
      case 'En cours':
        return 'bg-blue-100 text-blue-700';
      case 'Résolu':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="pt-8 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* En-tête avec profil */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Bienvenue {displayName} ! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Tableau de bord Technicien
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
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
                {user?.matricule && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Badge className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Matricule:</span>
                    <span>{user.matricule}</span>
                  </div>
                )}
                {user?.department && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Département:</span>
                    <span>{user.department}</span>
                  </div>
                )}
                {user?.sector && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Secteur:</span>
                    <span>{user.sector}</span>
                  </div>
                )}
                {user?.interventionZone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Zone d'intervention:</span>
                    <span>{user.interventionZone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Tickets assignés */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Tickets assignés ({tickets.length})
            </h2>
            <button
              onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <LayoutGrid className="w-5 h-5" />
              <span>{viewMode === 'card' ? 'Vue liste' : 'Vue carte'}</span>
            </button>
          </div>
        </div>

        {/* Liste des tickets en vue carte */}
        {viewMode === 'card' && (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        #{ticket.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {ticket.title}
                    </h4>
                    <div className="flex items-center gap-4 mb-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{ticket.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{ticket.time}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vue liste (alternative) */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        #{ticket.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {ticket.title}
                    </h4>
                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{ticket.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{ticket.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* EVA Chat intégré */}
      <EvaChat position="bottom-right" />
    </div>
  );
}
