import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { CreditCard, X } from 'lucide-react';

type Invoice = Database['public']['Tables']['invoices']['Row'];

interface PaymentModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ invoice, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('orange_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
    }).format(amount);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          client_id: user!.id,
          amount: invoice.amount,
          status: 'complete',
          payment_method: paymentMethod,
          transaction_id: transactionId,
          description: `Paiement facture ${invoice.period}`,
          completed_at: new Date().toISOString(),
        });

      if (paymentError) throw paymentError;

      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({
          status: 'payee',
          paid_at: new Date().toISOString(),
        })
        .eq('id', invoice.id);

      if (invoiceError) throw invoiceError;

      onSuccess();
    } catch (err) {
      setError('Erreur lors du paiement. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Paiement</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Facture période</p>
          <p className="font-semibold text-gray-800">{invoice.period}</p>
          <p className="text-sm text-gray-600 mt-2 mb-1">Montant à payer</p>
          <p className="text-2xl font-bold text-green-600">
            {formatAmount(invoice.amount)}
          </p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de paiement
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="orange_money">Orange Money</option>
              <option value="mtn_money">MTN Money</option>
              <option value="moov_money">Moov Money</option>
              <option value="carte_bancaire">Carte bancaire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="224 XXX XX XX XX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Payer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
