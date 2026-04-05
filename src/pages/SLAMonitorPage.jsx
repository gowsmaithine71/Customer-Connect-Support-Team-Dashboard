import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SLAMonitor from '../components/SLAMonitor';
import { generateTickets } from '../data/mockData';

export default function SLAMonitorPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(generateTickets(50));
  }, []);

  const handleEscalate = (ticketId) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: 'Escalated', updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const handleReassign = (ticketId) => {
    // Would open a modal to reassign - simplified for demo
    console.log('Reassign ticket:', ticketId);
  };

  const handleIncreasePriority = (ticketId) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { 
            ...ticket, 
            finalPriority: Math.min(100, ticket.finalPriority + 10),
            businessPriority: Math.min(100, ticket.businessPriority + 15)
          }
        : ticket
    ));
  };

  const slaRiskCount = tickets.filter(t => t.slaRisk).length;
  const criticalCount = tickets.filter(t => t.slaRisk && t.finalPriority > 80).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">SLA Monitor</h1>
          <p className="text-slate-400">Track and manage tickets approaching SLA breach</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/30">
            <span className="text-red-400 font-bold">{slaRiskCount}</span>
            <span className="text-slate-400 ml-2">at risk</span>
          </div>
          <div className="px-4 py-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
            <span className="text-amber-400 font-bold">{criticalCount}</span>
            <span className="text-slate-400 ml-2">critical</span>
          </div>
        </div>
      </div>

      {/* SLA Monitor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SLAMonitor
          tickets={tickets}
          onEscalate={handleEscalate}
          onReassign={handleReassign}
          onIncreasePriority={handleIncreasePriority}
        />
      </motion.div>

      {/* Info Panel */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">How SLA Monitoring Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-2">
              <span className="text-emerald-400">✓</span>
            </div>
            <p className="font-medium text-slate-200">Healthy</p>
            <p className="text-slate-500">Predicted TTR is less than 50% of SLA limit</p>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2">
              <span className="text-amber-400">!</span>
            </div>
            <p className="font-medium text-slate-200">At Risk</p>
            <p className="text-slate-500">Predicted TTR exceeds SLA limit</p>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center mb-2">
              <span className="text-red-400">✕</span>
            </div>
            <p className="font-medium text-slate-200">Breached</p>
            <p className="text-slate-500">SLA time has expired</p>
          </div>
        </div>
      </div>
    </div>
  );
}
