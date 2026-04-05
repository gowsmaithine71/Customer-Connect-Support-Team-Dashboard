import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Inbox, AlertTriangle, Clock, TrendingUp, ArrowUpRight, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import AgentStats from '../components/AgentStats';
import { generateTickets, generateAgents } from '../data/mockData';

export default function Overview() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    setTickets(generateTickets(50));
    setAgents(generateAgents());
  }, []);

  const totalTickets = tickets.length;
  const highPriorityTickets = tickets.filter(t => t.finalPriority > 80).length;
  const slaRiskTickets = tickets.filter(t => t.slaRisk).length;
  const escalatedTickets = tickets.filter(t => t.status === 'Escalated').length;
  const avgResolutionTime = 32;

  const agentWorkload = agents.map(agent => ({
    name: agent.name.split(' ')[0],
    workload: agent.workload
  }));

  const recentEscalations = tickets
    .filter(t => t.status === 'Escalated')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard Overview</h1>
        <p className="text-slate-400">Real-time support team performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Inbox}
          label="Active Tickets"
          value={totalTickets}
          trend={12}
          gradient="gradient-primary"
          delay={0}
        />
        <StatCard
          icon={AlertTriangle}
          label="High Priority (>80)"
          value={highPriorityTickets}
          gradient="gradient-danger"
          delay={0.1}
        />
        <StatCard
          icon={Clock}
          label="SLA At Risk"
          value={slaRiskTickets}
          gradient="gradient-warning"
          delay={0.2}
        />
        <StatCard
          icon={TrendingUp}
          label="Escalated"
          value={escalatedTickets}
          trend={-5}
          gradient="gradient-success"
          delay={0.3}
        />
      </div>

      {/* Charts and Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Workload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Agent Workload Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentWorkload} layout="vertical">
                <XAxis type="number" domain={[0, 20]} stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="workload" radius={[0, 4, 4, 0]}>
                  {agentWorkload.map((entry, index) => (
                    <Cell 
                      key={entry.name} 
                      fill={entry.workload > 15 ? '#ef4444' : entry.workload > 10 ? '#f59e0b' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Escalations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent Escalations</h3>
          <div className="space-y-3">
            {recentEscalations.length > 0 ? (
              recentEscalations.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-indigo-400">{ticket.id}</p>
                      <p className="text-sm text-slate-300">{ticket.customer}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.finalPriority > 80 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    P{ticket.finalPriority}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No recent escalations</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Agent Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Team Performance</h3>
        <AgentStats agents={agents} />
      </motion.div>
    </div>
  );
}
