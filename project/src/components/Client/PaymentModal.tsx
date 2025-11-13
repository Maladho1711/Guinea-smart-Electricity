import { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

interface Invoice {
  id: string;
  amount: number;
  period: string;
}

interface PaymentModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ invoice, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'orange' | 'mtn' | 'moov' | 'carte' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const paymentMethods = [
    { value: 'orange', label: 'Orange Money', icon: Smartphone, color: 'text-orange-600', bg: 'bg-orange-50' },
    { value: 'mtn', label: 'MTN Money', icon: Smartphone, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'moov', label: 'Moov Money', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'carte', label: 'Carte bancaire', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!paymentMethod) {
      setError('Veuillez sélectionner un moyen de paiement');
      return;
    }

    if (paymentMethod !== 'carte' && !phoneNumber.trim()) {
      setError('Veuillez saisir votre numéro de téléphone');
      return;
    }

    if (paymentMethod === 'carte' && !cardNumber.trim()) {
      setError('Veuillez saisir votre numéro de carte');
      return;
    }

    setLoading(true);

    try {
      // TODO: Remplacer par un appel API réel pour le paiement
      // Pour l'instant, on simule le paiement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simuler une réponse de succès
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Erreur lors du paiement:', err);
      setError(err.message || 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h2>
          <p className="text-gray-600 mb-6">
            Votre paiement de {invoice.amount.toLocaleString('fr-FR')} GNF a été effectué avec succès.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Payer ma facture
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
          {/* Détails de la facture */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la facture</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Période</p>
                <p className="font-semibold text-gray-900">{invoice.period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Montant à payer</p>
                <p className="text-2xl font-bold text-green-600">
                  {invoice.amount.toLocaleString('fr-FR')} GNF
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Méthode de paiement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choisissez votre moyen de paiement *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${method.bg} border-${method.color.split('-')[1]}-600`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? method.color : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${isSelected ? method.color : 'text-gray-600'}`}>
                      {method.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Numéro de téléphone (pour mobile money) */}
          {paymentMethod && paymentMethod !== 'carte' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Numéro de téléphone *
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: 623436513"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Numéro de carte (pour carte bancaire) */}
          {paymentMethod === 'carte' && (
            <div>
              <label htmlFor="card" className="block text-sm font-semibold text-gray-700 mb-2">
                Numéro de carte *
              </label>
              <input
                id="card"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          )}

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
              disabled={loading || !paymentMethod}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Traitement...' : `Payer ${invoice.amount.toLocaleString('fr-FR')} GNF`}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            🔒 Vos paiements sont sécurisés et traités instantanément
          </p>
        </form>
      </div>
    </div>
  );
}

