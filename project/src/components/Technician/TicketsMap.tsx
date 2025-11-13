import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface TicketType {
  id: string;
  title: string;
  description: string;
  address?: string;
  latitude: number | null;
  longitude: number | null;
  priority: 'basse' | 'moyenne' | 'haute' | 'critique';
  status?: string;
}

interface TicketsMapProps {
  tickets: TicketType[];
}

const createCustomIcon = (priority: TicketType['priority']) => {
  const colors = {
    basse: '#10b981',
    moyenne: '#f59e0b',
    haute: '#ef4444',
    critique: '#dc2626',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background-color: ${colors[priority]};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

export function TicketsMap({ tickets }: TicketsMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  const ticketsWithLocation = tickets.filter(
    (t) => t.latitude !== null && t.longitude !== null
  );

  const defaultCenter: [number, number] = [9.6412, -13.5784];
  const defaultZoom = ticketsWithLocation.length > 0 ? 12 : 11;

  useEffect(() => {
    if (map && ticketsWithLocation.length > 0) {
      const bounds = L.latLngBounds(
        ticketsWithLocation.map((t) => [t.latitude!, t.longitude!])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, tickets]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ticketsWithLocation.map((ticket) => (
          <Marker
            key={ticket.id}
            position={[ticket.latitude!, ticket.longitude!]}
            icon={createCustomIcon(ticket.priority)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{ticket.title}</h3>
                <p className="text-xs text-gray-600 mb-1">{ticket.description}</p>
                <p className="text-xs text-gray-500">{ticket.address}</p>
                <p className="text-xs font-semibold mt-1">
                  Priorité: {ticket.priority.toUpperCase()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
