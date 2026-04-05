import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { generateTickets, getEmotionDistribution, getPriorityDistribution, getSlaBreachTrend, getAgentPerformance, generateAgents } from '../data/mockData';

const COLORS = ['#EF4444', '#F59E0B', '#FCD34D', '#84CC16', '#22C55E', '#14B8A6', '#06B6D4'];

export default function Analytics() {
  const [tickets, setTickets] = useState([]);
  const [emotionData, setEmotionData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [slaTrend, setSlaTrend] = useState([]);
  const [agentPerf, setAgentPerf] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const data = generateTickets(100);
    setTickets(data);
    setEmotionData(getEmotionDistribution(data));
    setPriorityData(getPriorityDistribution(data));
    setSlaTrend(getSlaBreachTrend());
    setAgentPerf(getAgentPerformance());
    setAgents(generateAgents());
  }, []);

  const totalTickets = tickets.length;
  const avgResolutionTime = 32;
  const satisfactionScore = 87;
  const slaCompliance = ((tickets.length - tickets.filter(t => t.slaRisk).length) / tickets.length * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-slate-400">Performance metrics and insights</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <p className="text-slate-400 text-sm">Total Tickets</p>
          <p className="text-2xl font-bold text-slate-100">{totalTickets}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <p className="text-slate-400 text-sm">Avg Resolution</p>
          <p className="text-2xl font-bold text-slate-100">{avgResolutionTime}m</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <p className="text-slate-400 text-sm">Satisfaction</p>
          <p className="text-2xl font-bold text-emerald-400">{satisfactionScore}%</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <p className="text-slate-400 text-sm">SLA Compliance</p>
          <p className="text-2xl font-bold text-indigo-400">{slaCompliance}%</p>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Emotion Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Priority Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : index === 2 ? '#3b82f6' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Breach Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">SLA Breach Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slaTrend}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="breaches" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Agent Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Agent Resolution Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerf} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={50} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="resolutionTime" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Agents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Top Performing Agents</h3>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Agent</th>
                <th>Role</th>
                <th>Resolved Today</th>
                <th>Avg Time</th>
                <th>CSAT</th>
              </tr>
            </thead>
            <tbody>
              {agents.slice(0, 5).map((agent, index) => (
                <tr key={agent.id}>
                  <td className="font-mono text-indigo-400">#{index + 1}</td>
                  <td className="font-medium">{agent.name}</td>
                  <td><span className="px-2 py-1 rounded-full text-xs bg-slate-600/50">{agent.role}</span></td>
                  <td className="font-mono">{agent.resolvedToday}</td>
                  <td className="font-mono">{agent.avgResolutionTime}m</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      agent.satisfactionScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                      agent.satisfactionScore >= 80 ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {agent.satisfactionScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
