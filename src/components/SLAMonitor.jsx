import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, UserPlus, ArrowUpCircle } from 'lucide-react';
import { getSlaStatus, formatCountdown } from '../utils/priorityCalculator';

export default function SLAMonitor({ tickets, onEscalate, onReassign, onIncreasePriority }) {
  const slaAtRiskTickets = tickets.filter(t => t.slaRisk);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newCountdowns = {};
      
      slaAtRiskTickets.forEach(ticket => {
        const created = new Date(ticket.createdAt);
        const elapsedHours = (now - created) / (1000 * 60 * 60);
        const remaining = Math.max(0, ticket.slaLimit - elapsedHours);
        newCountdowns[ticket.id] = remaining;
      });
      
      setCountdowns(newCountdowns);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [slaAtRiskTickets]);

  if (slaAtRiskTickets.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">All Clear!</h3>
        <p className="text-slate-400">No tickets at SLA risk currently.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {slaAtRiskTickets.map((ticket, index) => {
        const sla = getSlaStatus(ticket.predictedTTR, ticket.slaLimit);
        const remaining = countdowns[ticket.id] ?? 0;
        
        return (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`card p-4 border-l-4 ${ticket.finalPriority > 80 ? 'border-l-red-500' : 'border-l-amber-500'}`}
          >
            {/* Alert Banner */}
            <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${
              ticket.finalPriority > 80 ? 'bg-red-500/20' : 'bg-amber-500/20'
            }`}>
              <AlertTriangle className={`w-4 h-4 ${ticket.finalPriority > 80 ? 'text-red-400' : 'text-amber-400'}`} />
              <span className={`text-sm font-medium ${ticket.finalPriority > 80 ? 'text-red-400' : 'text-amber-400'}`}>
                {ticket.finalPriority > 80 ? 'CRITICAL: SLA Breached' : 'WARNING: SLA At Risk'}
              </span>
            </div>

            {/* Ticket Info */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-indigo-400">{ticket.id}</p>
                <p className="text-sm font-medium text-slate-200">{ticket.customer}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className={`font-mono text-lg font-bold ${
                    remaining <= 0 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {formatCountdown(remaining)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">remaining</p>
              </div>
            </div>

            {/* Time Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-slate-500">Predicted TTR</p>
                <p className="font-mono text-slate-200">{ticket.predictedTTR}h</p>
              </div>
              <div>
                <p className="text-slate-500">SLA Limit</p>
                <p className="font-mono text-slate-200">{ticket.slaLimit}h</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEscalate?.(ticket.id)}
                className="flex-1 btn bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              >
                <ArrowUpCircle className="w-4 h-4 mr-1 inline" />
                Escalate
              </button>
              <button
                onClick={() => onReassign?.(ticket.id)}
                className="flex-1 btn bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
              >
                <UserPlus className="w-4 h-4 mr-1 inline" />
                Reassign
              </button>
              <button
                onClick={() => onIncreasePriority?.(ticket.id)}
                className="flex-1 btn bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
              >
                + Priority
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
