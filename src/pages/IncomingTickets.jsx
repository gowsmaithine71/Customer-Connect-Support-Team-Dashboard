import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TicketTable from '../components/TicketTable';
import PriorityBreakdown from '../components/PriorityBreakdown';
import { generateTickets, generatePriorityWeights } from '../data/mockData';

export default function IncomingTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'finalPriority', direction: 'desc' });
  const [weights] = useState(generatePriorityWeights);

  useEffect(() => {
    setTickets(generateTickets(50));
  }, []);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Incoming Tickets</h1>
          <p className="text-slate-400">View and manage all support tickets</p>
        </div>
        <div className="text-sm text-slate-400">
          {tickets.length} total tickets
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1">
          <TicketTable 
            tickets={tickets} 
            onTicketClick={handleTicketClick}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>

        {/* Priority Breakdown Sidebar */}
        {selectedTicket && (
          <div className="w-96 flex-shrink-0">
            <PriorityBreakdown ticket={selectedTicket} weights={weights} />
          </div>
        )}
      </div>
    </div>
  );
}
