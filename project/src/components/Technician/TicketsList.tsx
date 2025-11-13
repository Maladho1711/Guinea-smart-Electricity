import { Database } from '../../lib/database.types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

type TicketType = Database['public']['Tables']['tickets']['Row'];

interface TicketsListProps {
  tickets: TicketType[];
  onUpdate: () => void;
}

export function TicketsList({ tickets, onUpdate }: TicketsListProps) {
  const { user } = useAuth();

  const handleStatusChange = async (ticketId: string, newStatus: TicketType['status']) => {
    const updateData: any = { status: newStatus };

    if (newStatus === 'en_cours') {
      updateData.technicien_id = user!.id;
    } else if (newStatus === 'resolu') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket:', error);
    } else {
      onUpdate();
    }
  };

  const getPriorityBadge = (priority: TicketType['priority']) => {
    const styles = {
      basse: 'bg-green-100 text-green-700',
      moyenne: 'bg-yellow-100 text-yellow-700',
      haute: 'bg-orange-100 text-orange-700',
      critique: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`${styles[priority]} px-3 py-1 rounded-full text-xs font-semibold`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getStatusIcon = (status: TicketType['status']) => {
    switch (status) {
      case 'nouveau':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'en_cours':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'resolu':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucun ticket disponible</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(ticket.status)}
                  <h3 className="font-bold text-lg text-gray-800">{ticket.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{ticket.address}</span>
                </div>
              </div>
              {getPriorityBadge(ticket.priority)}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Créé le {formatDate(ticket.created_at)}
              </span>

              <div className="flex space-x-2">
                {ticket.status === 'nouveau' && (
                  <button
                    onClick={() => handleStatusChange(ticket.id, 'en_cours')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    Prendre en charge
                  </button>
                )}
                {ticket.status === 'en_cours' && (
                  <button
                    onClick={() => handleStatusChange(ticket.id, 'resolu')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                  >
                    Marquer résolu
                  </button>
                )}
                {ticket.status === 'resolu' && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                    ✓ Résolu
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
