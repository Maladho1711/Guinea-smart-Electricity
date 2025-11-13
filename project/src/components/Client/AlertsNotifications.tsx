import { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Archive, Trash2, Clock, Zap, CreditCard, Wrench, Settings, DollarSign, Info } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

interface Alert {
  id: string;
  type: 'consommation' | 'facture' | 'panne' | 'maintenance' | 'paiement' | 'autre';
  title: string;
  message: string;
  priority: 'basse' | 'moyenne' | 'haute' | 'critique';
  status: 'active' | 'lue' | 'archivée';
  readAt?: string;
  createdAt: string;
}

interface AlertsNotificationsProps {
  onClose: () => void;
  onCreateAlert: () => void;
}

export function AlertsNotifications({ onClose, onCreateAlert }: AlertsNotificationsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'read' | 'archived'>('all');

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${API_ENDPOINTS.alerts}${filter !== 'all' ? `?status=${filter === 'active' ? 'active' : filter === 'read' ? 'lue' : 'archivée'}` : ''}`);
      setAlerts(response.alerts || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      // Données de démonstration en cas d'erreur
      setAlerts([
        {
          id: '1',
          type: 'consommation',
          title: 'Surconsommation détectée',
          message: 'Votre consommation a augmenté de 15% ce mois. Éteignez les appareils non utilisés pour économiser.',
          priority: 'haute',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await apiRequest(`${API_ENDPOINTS.alerts}/${alertId}/read`, {
        method: 'PATCH',
      });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'lue' as const, readAt: new Date().toISOString() } : alert
      ));
    } catch (error) {
      console.error('Erreur lors du marquage de l\'alerte:', error);
    }
  };

  const archiveAlert = async (alertId: string) => {
    try {
      await apiRequest(`${API_ENDPOINTS.alerts}/${alertId}/archive`, {
        method: 'PATCH',
      });
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      await apiRequest(`${API_ENDPOINTS.alerts}/${alertId}`, {
        method: 'DELETE',
      });
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consommation':
        return Zap;
      case 'facture':
        return CreditCard;
      case 'panne':
        return AlertTriangle;
      case 'maintenance':
        return Settings;
      case 'paiement':
        return DollarSign;
      default:
        return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consommation':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'facture':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'panne':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'paiement':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'haute':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const readAlerts = alerts.filter(a => a.status === 'lue').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Notifications et Alertes</h2>
            {activeAlerts > 0 && (
              <span className="bg-white text-red-600 text-xs font-bold rounded-full px-3 py-1">
                {activeAlerts} nouvelle{activeAlerts > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Filtres et actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({alerts.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'active' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Actives ({activeAlerts})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lues ({readAlerts})
              </button>
            </div>
            <button
              onClick={onCreateAlert}
              className="px-4 py-2 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              Créer une alerte
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des notifications...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune notification pour le moment</p>
              <button
                onClick={onCreateAlert}
                className="px-6 py-3 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Créer votre première alerte
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const Icon = getTypeIcon(alert.type);
                return (
                  <div
                    key={alert.id}
                    className={`border-2 rounded-xl p-5 transition-all ${
                      alert.status === 'active'
                        ? 'bg-white border-l-4 shadow-lg'
                        : 'bg-gray-50 border-gray-200'
                    } ${
                      alert.priority === 'critique' ? 'border-l-red-500' :
                      alert.priority === 'haute' ? 'border-l-orange-500' :
                      alert.priority === 'moyenne' ? 'border-l-yellow-500' :
                      'border-l-gray-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(alert.type).split(' ')[1]}`}>
                        <Icon className={`w-6 h-6 ${getTypeColor(alert.type).split(' ')[0]}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(alert.priority)}`}>
                                {alert.priority.toUpperCase()}
                              </span>
                              {alert.status === 'active' && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                  Nouvelle
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3 whitespace-pre-line">{alert.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(alert.createdAt).toLocaleString('fr-FR')}
                              </div>
                              {alert.readAt && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Lue le {new Date(alert.readAt).toLocaleDateString('fr-FR')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {alert.status === 'active' && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Marquer comme lue
                            </button>
                          )}
                          <button
                            onClick={() => archiveAlert(alert.id)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Archiver
                          </button>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

