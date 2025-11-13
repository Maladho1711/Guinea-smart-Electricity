import { Users, Ticket, DollarSign, Zap } from 'lucide-react';

interface StatsCardsProps {
  totalTickets: number;
  openTickets: number;
  totalRevenue: number;
  activeClients: number;
}

export function StatsCards({ totalTickets, openTickets, totalRevenue, activeClients }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Tickets</p>
            <p className="text-3xl font-bold">{totalTickets}</p>
          </div>
          <Ticket className="w-12 h-12 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Tickets Ouverts</p>
            <p className="text-3xl font-bold">{openTickets}</p>
          </div>
          <Zap className="w-12 h-12 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Revenus Totaux</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
          <DollarSign className="w-12 h-12 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Clients Actifs</p>
            <p className="text-3xl font-bold">{activeClients}</p>
          </div>
          <Users className="w-12 h-12 opacity-80" />
        </div>
      </div>
    </div>
  );
}
