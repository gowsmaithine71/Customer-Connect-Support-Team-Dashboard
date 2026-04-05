import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, AlertTriangle, Clock, Briefcase, Lock, Unlock } from 'lucide-react';
import TicketTable from '../components/TicketTable';
import PriorityBreakdown from '../components/PriorityBreakdown';
import { generateTickets, generatePriorityWeights } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function PriorityEngine() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [weights, setWeights] = useState(generatePriorityWeights());
  const [locked, setLocked] = useState({ alpha: false, beta: false, gamma: false });
  const { hasPermission } = useAuth();

  const canAdjustWeights = hasPermission('adjust_weights');

  useEffect(() => {
    setTickets(generateTickets(50));
  }, []);

  const handleWeightChange = (key, value) => {
    if (locked[key]) return;
    const newWeights = { ...weights, [key]: parseFloat(value) };
    
    // Normalize weights to sum to 1
    const total = newWeights.alpha + newWeights.beta + newWeights.gamma;
    if (total > 0) {
      newWeights.alpha = newWeights.alpha / total;
      newWeights.beta = newWeights.beta / total;
      newWeights.gamma = newWeights.gamma / total;
    }
    
    setWeights(newWeights);
    
    // Recalculate priorities
    setTickets(tickets.map(ticket => ({
      ...ticket,
      finalPriority: Math.round(
        (ticket.emotionWeight * newWeights.alpha) +
        (ticket.waitingTimeScore * newWeights.beta) +
        (ticket.businessPriority * newWeights.gamma)
      )
    })));
  };

  const toggleLock = (key) => {
    setLocked({ ...locked, [key]: !locked[key] });
  };

  const factors = [
    { key: 'alpha', name: 'Emotion Weight', icon: AlertTriangle, color: 'from-red-500 to-orange-500', description: 'Customer emotion impact' },
    { key: 'beta', name: 'Waiting Time', icon: Clock, color: 'from-amber-500 to-yellow-500', description: 'Time waiting for support' },
    { key: 'gamma', name: 'Business Priority', icon: Briefcase, color: 'from-blue-500 to-indigo-500', description: 'Business impact of issue' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">AI Priority Engine</h1>
        <p className="text-slate-400">Configure priority calculation weights and analyze results</p>
      </div>

      {/* Weight Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-100">Priority Formula Weights</h2>
          </div>
          {!canAdjustWeights && (
            <span className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
              Read-only (Manager access required)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {factors.map((factor) => {
            const Icon = factor.icon;
            const isLocked = locked[factor.key];
            
            return (
              <div 
                key={factor.key}
                className={`p-4 rounded-xl border ${
                  isLocked ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-600/50 bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${factor.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{factor.name}</p>
                      <p className="text-xs text-slate-500">{factor.description}</p>
                    </div>
                  </div>
                  {canAdjustWeights && (
                    <button
                      onClick={() => toggleLock(factor.key)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLocked 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'hover:bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Weight</span>
                    <span className="font-mono text-slate-200">{(weights[factor.key] * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={weights[factor.key] * 100}
                    onChange={(e) => handleWeightChange(factor.key, e.target.value / 100)}
                    disabled={!canAdjustWeights || isLocked}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      !canAdjustWeights || isLocked 
                        ? 'bg-slate-700 cursor-not-allowed' 
                        : 'bg-slate-600 accent-indigo-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Formula Display */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <p className="text-sm text-slate-400 mb-2">Current Formula</p>
          <p className="font-mono text-slate-200">
            Final = (Emotion × {(weights.alpha * 100).toFixed(0)}%) + 
            (Wait Time × {(weights.beta * 100).toFixed(0)}%) + 
            (Business × {(weights.gamma * 100).toFixed(0)}%)
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1">
          <TicketTable 
            tickets={tickets} 
            onTicketClick={setSelectedTicket}
            sortConfig={{ key: 'finalPriority', direction: 'desc' }}
            onSort={() => {}}
          />
        </div>

        {/* Priority Breakdown */}
        {selectedTicket && (
          <div className="w-96 flex-shrink-0">
            <PriorityBreakdown ticket={selectedTicket} weights={weights} />
          </div>
        )}
      </div>
    </div>
  );
}
