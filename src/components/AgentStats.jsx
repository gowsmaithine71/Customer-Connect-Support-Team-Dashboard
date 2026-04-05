import { motion } from 'framer-motion';
import { User, Clock, ThumbsUp } from 'lucide-react';

export default function AgentStats({ agents }) {
  return (
    <div className="space-y-3">
      {agents.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-4 bg-slate-800/30 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200">{agent.name}</p>
                <p className="text-xs text-slate-500">{agent.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-200">{agent.workload}</p>
              <p className="text-xs text-slate-500">tickets</p>
            </div>
          </div>
          
          {/* Workload Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Workload</span>
              <span>{Math.round((agent.workload / 20) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((agent.workload / 20) * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full ${
                  agent.workload > 15 ? 'bg-red-500' : 
                  agent.workload > 10 ? 'bg-amber-500' : 
                  'bg-emerald-500'
                }`}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">{agent.avgResolutionTime}m</span>
              <span className="text-xs text-slate-600">avg</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">{agent.satisfactionScore}%</span>
              <span className="text-xs text-slate-600">CSAT</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
