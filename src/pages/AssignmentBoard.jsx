import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import KanbanBoard from '../components/KanbanBoard';
import AgentStats from '../components/AgentStats';
import { generateTickets, generateAgents } from '../data/mockData';

export default function AssignmentBoard() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    setTickets(generateTickets(50));
    setAgents(generateAgents());
  }, []);

  const handleTicketMove = (ticketId, newStatus) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const unassignedCount = tickets.filter(t => t.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Assignment Board</h1>
          <p className="text-slate-400">Drag and drop tickets to manage workflow</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <span className="text-indigo-400 font-medium">{unassignedCount}</span>
            <span className="text-slate-400 ml-2">unassigned</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card p-6 overflow-x-auto"
      >
        <KanbanBoard 
          tickets={tickets} 
          onTicketMove={handleTicketMove}
        />
      </motion.div>

      {/* Agent Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Spacer or additional content */}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Agent Availability</h3>
          <AgentStats agents={agents} />
        </div>
      </div>
    </div>
  );
}
