import { useState } from 'react';
import { X, AlertTriangle, Zap, CreditCard, Wrench, Settings, DollarSign, Info } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

interface CreateAlertModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAlertModal({ onClose, onSuccess }: CreateAlertModalProps) {
  const [type, setType] = useState<'consommation' | 'facture' | 'panne' | 'maintenance' | 'paiement' | 'autre'>('consommation');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'basse' | 'moyenne' | 'haute' | 'critique'>('moyenne');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const alertTypes = [
    { value: 'consommation', label: 'Consommation', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'facture', label: 'Facture', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'panne', label: 'Panne', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { value: 'maintenance', label: 'Maintenance', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-50' },
    { value: 'paiement', label: 'Paiement', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'autre', label: 'Autre', icon: Info, color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !message.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      await apiRequest(API_ENDPOINTS.alerts, {
        method: 'POST',
        body: JSON.stringify({
          type,
          title: title.trim(),
          message: message.trim(),
          priority,
        }),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'alerte:', err);
      setError(err.message || 'Erreur lors de la création de l\'alerte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Créer une alerte
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Type d'alerte */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Type d'alerte *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {alertTypes.map((alertType) => {
                const Icon = alertType.icon;
                const isSelected = type === alertType.value;
                return (
                  <button
                    key={alertType.value}
                    type="button"
                    onClick={() => setType(alertType.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${alertType.bg} border-${alertType.color.split('-')[1]}-600`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? alertType.color : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${isSelected ? alertType.color : 'text-gray-600'}`}>
                      {alertType.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Titre de l'alerte *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Surconsommation détectée"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              Description détaillée *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre problème ou votre préoccupation en détail..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priorité *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'basse', label: 'Basse', color: 'bg-gray-100 text-gray-700 border-gray-300' },
                { value: 'moyenne', label: 'Moyenne', color: 'bg-blue-100 text-blue-700 border-blue-300' },
                { value: 'haute', label: 'Haute', color: 'bg-orange-100 text-orange-700 border-orange-300' },
                { value: 'critique', label: 'Critique', color: 'bg-red-100 text-red-700 border-red-300' },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value as any)}
                  className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                    priority === p.value
                      ? `${p.color} border-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer l\'alerte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

