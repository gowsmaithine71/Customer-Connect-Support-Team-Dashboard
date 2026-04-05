import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Briefcase, TrendingUp } from 'lucide-react';

export default function PriorityBreakdown({ ticket, weights }) {
  if (!ticket) return null;

  const factors = [
    {
      name: 'Emotion Weight',
      value: ticket.emotionWeight,
      max: 100,
      weight: weights.alpha,
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'Waiting Time Score',
      value: ticket.waitingTimeScore,
      max: 100,
      weight: weights.beta,
      icon: Clock,
      color: 'from-amber-500 to-yellow-500'
    },
    {
      name: 'Business Priority',
      value: ticket.businessPriority,
      max: 100,
      weight: weights.gamma,
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const contribution = factors.map(f => ({
    ...f,
    contribution: Math.round(f.value * f.weight)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6"
    >
      <h3 className="text-lg font-semibold text-slate-100 mb-4">AI Priority Breakdown</h3>
      
      {/* Formula Display */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-slate-400 mb-2">Priority Formula</p>
        <div className="font-mono text-sm text-slate-200">
          <span className="text-red-400">Final = </span>
          <span>(Emotion × {weights.alpha}) + </span>
          <span>(Wait Time × {weights.beta}) + </span>
          <span>(Biz Priority × {weights.gamma})</span>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="mb-6">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ticket</p>
        <p className="font-mono text-indigo-400 text-lg">{ticket.id}</p>
        <p className="text-sm text-slate-300">{ticket.customer}</p>
      </div>

      {/* Factors */}
      <div className="space-y-4">
        {contribution.map((factor, index) => {
          const Icon = factor.icon;
          const percentage = (factor.value / factor.max) * 100;
          
          return (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800/30 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${factor.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{factor.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-lg text-slate-100">{factor.value}</span>
                  <span className="text-xs text-slate-500 ml-1">× {factor.weight}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${factor.color}`}
                />
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-500">Contribution: {factor.contribution} pts</span>
                <span className="text-xs text-slate-500">{Math.round(factor.weight * 100)}% weight</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Final Priority */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-lg border border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-slate-200">Final AI Priority</span>
          </div>
          <span className="font-mono text-2xl font-bold text-indigo-400">{ticket.finalPriority}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Predicted TTR</p>
          <p className="font-mono text-slate-200">{ticket.predictedTTR}h</p>
        </div>
        <div>
          <p className="text-slate-500">SLA Limit</p>
          <p className="font-mono text-slate-200">{ticket.slaLimit}h</p>
        </div>
      </div>
    </motion.div>
  );
}
