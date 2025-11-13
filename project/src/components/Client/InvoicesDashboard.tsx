import { useState, useEffect } from 'react';
import { X, FileText, Calendar, DollarSign, TrendingDown, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Invoice {
  id: string;
  amount: number;
  period: string;
  consumption_kwh: number;
  status: 'impayee' | 'payee' | 'en_retard';
  due_date: string;
  paid_at?: string;
  created_at: string;
}

interface InvoicesDashboardProps {
  onClose: () => void;
  onPayInvoice: (invoice: Invoice) => void;
}

export function InvoicesDashboard({ onClose, onPayInvoice }: InvoicesDashboardProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des factures
    // TODO: Remplacer par un appel API réel
    setTimeout(() => {
      setInvoices([
        {
          id: '1',
          amount: 450000,
          period: 'Novembre 2025',
          consumption_kwh: 245,
          status: 'impayee',
          due_date: '2025-12-15',
          created_at: '2025-11-01',
        },
        {
          id: '2',
          amount: 380000,
          period: 'Octobre 2025',
          consumption_kwh: 213,
          status: 'payee',
          due_date: '2025-11-15',
          paid_at: '2025-11-10',
          created_at: '2025-10-01',
        },
        {
          id: '3',
          amount: 420000,
          period: 'Septembre 2025',
          consumption_kwh: 228,
          status: 'payee',
          due_date: '2025-10-15',
          paid_at: '2025-10-12',
          created_at: '2025-09-01',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'payee':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'en_retard':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'impayee':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'payee':
        return <CheckCircle className="w-5 h-5" />;
      case 'en_retard':
        return <AlertCircle className="w-5 h-5" />;
      case 'impayee':
        return <Clock className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'payee':
        return 'Payée';
      case 'en_retard':
        return 'En retard';
      case 'impayee':
        return 'Impayée';
      default:
        return status;
    }
  };

  const totalUnpaid = invoices
    .filter(inv => inv.status === 'impayee' || inv.status === 'en_retard')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'payee')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalConsumption = invoices.reduce((sum, inv) => sum + inv.consumption_kwh, 0);
  const averageConsumption = invoices.length > 0 ? Math.round(totalConsumption / invoices.length) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Mes Factures et Historique
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des factures...</p>
            </div>
          ) : (
            <>
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">À payer</p>
                      <p className="text-2xl font-bold text-red-700">
                        {totalUnpaid.toLocaleString('fr-FR')} GNF
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total payé</p>
                      <p className="text-2xl font-bold text-green-700">
                        {totalPaid.toLocaleString('fr-FR')} GNF
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Consommation moyenne</p>
                      <p className="text-2xl font-bold text-blue-700">{averageConsumption} kWh</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total factures</p>
                      <p className="text-2xl font-bold text-purple-700">{invoices.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Liste des factures */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des factures</h3>
                {invoices.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune facture disponible</p>
                  </div>
                ) : (
                  invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{invoice.period}</h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                                invoice.status
                              )}`}
                            >
                              {getStatusIcon(invoice.status)}
                              {getStatusLabel(invoice.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Montant</p>
                              <p className="font-semibold text-gray-900">
                                {invoice.amount.toLocaleString('fr-FR')} GNF
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Consommation</p>
                              <p className="font-semibold text-gray-900">{invoice.consumption_kwh} kWh</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Date d'échéance</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            {invoice.paid_at && (
                              <div>
                                <p className="text-gray-500">Payée le</p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(invoice.paid_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {invoice.status === 'impayee' || invoice.status === 'en_retard' ? (
                          <button
                            onClick={() => onPayInvoice(invoice)}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                          >
                            Payer maintenant
                          </button>
                        ) : (
                          <div className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-lg whitespace-nowrap">
                            ✓ Payée
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

