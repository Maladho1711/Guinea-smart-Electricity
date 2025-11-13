import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

type Invoice = Database['public']['Tables']['invoices']['Row'];

export function InvoicesList({ onPayInvoice }: { onPayInvoice: (invoice: Invoice) => void }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadInvoices();
  }, [user]);

  const loadInvoices = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading invoices:', error);
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const styles = {
      impayee: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Impayée' },
      payee: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Payée' },
      en_retard: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'En retard' },
    };

    const style = styles[status];
    const Icon = style.icon;

    return (
      <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1`}>
        <Icon className="w-4 h-4" />
        <span>{style.label}</span>
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Mes Factures</h2>
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucune facture disponible</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Période: {invoice.period}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Consommation: {invoice.consumption_kwh} kWh
                  </p>
                </div>
                {getStatusBadge(invoice.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Montant</p>
                  <p className="font-bold text-xl text-gray-800">
                    {formatAmount(invoice.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date limite</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(invoice.due_date)}
                  </p>
                </div>
              </div>

              {invoice.status === 'impayee' || invoice.status === 'en_retard' ? (
                <button
                  onClick={() => onPayInvoice(invoice)}
                  className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Payer maintenant
                </button>
              ) : (
                <div className="text-center text-sm text-gray-600">
                  Payée le {invoice.paid_at ? formatDate(invoice.paid_at) : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
