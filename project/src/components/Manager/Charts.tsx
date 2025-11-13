import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartsProps {
  ticketsByStatus: Array<{ name: string; value: number }>;
  ticketsByPriority: Array<{ name: string; value: number }>;
}

const STATUS_COLORS = {
  'Nouveau': '#ef4444',
  'En cours': '#f59e0b',
  'Résolu': '#10b981',
};

const PRIORITY_COLORS = {
  'Basse': '#10b981',
  'Moyenne': '#f59e0b',
  'Haute': '#f97316',
  'Critique': '#ef4444',
};

export function Charts({ ticketsByStatus, ticketsByPriority }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tickets par Statut</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ticketsByStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {ticketsByStatus.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tickets par Priorité</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ticketsByPriority}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Nombre">
              {ticketsByPriority.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
