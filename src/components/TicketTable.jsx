import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Eye, MoreHorizontal } from 'lucide-react';
import { getPriorityLevel, getSlaStatus, getEmotionColor, formatTimeAgo } from '../utils/priorityCalculator';

export default function TicketTable({ tickets, onTicketClick, sortConfig, onSort }) {
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [filterSla, setFilterSla] = useState('all');

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'emotion', label: 'Emotion', sortable: true },
    { key: 'emotionWeight', label: 'Emotion Wt', sortable: true },
    { key: 'waitingTimeScore', label: 'Wait Score', sortable: true },
    { key: 'businessPriority', label: 'Biz Priority', sortable: true },
    { key: 'predictedTTR', label: 'Pred. TTR', sortable: true },
    { key: 'finalPriority', label: 'AI Priority', sortable: true },
    { key: 'slaRisk', label: 'SLA Status', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: '', sortable: false }
  ];

  const filteredTickets = tickets.filter(ticket => {
    if (filterEmotion !== 'all' && ticket.emotion !== filterEmotion) return false;
    if (filterSla === 'risk' && !ticket.slaRisk) return false;
    if (filterSla === 'healthy' && ticket.slaRisk) return false;
    return true;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    onSort({
      key,
      direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="card overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-slate-600/50 flex gap-4">
        <select 
          value={filterEmotion} 
          onChange={(e) => setFilterEmotion(e.target.value)}
          className="select w-48"
        >
          <option value="all">All Emotions</option>
          <option value="Frustrated">Frustrated</option>
          <option value="Angry">Angry</option>
          <option value="Confused">Confused</option>
          <option value="Worried">Worried</option>
          <option value="Neutral">Neutral</option>
          <option value="Satisfied">Satisfied</option>
          <option value="Happy">Happy</option>
        </select>
        <select 
          value={filterSla} 
          onChange={(e) => setFilterSla(e.target.value)}
          className="select w-48"
        >
          <option value="all">All SLA Status</option>
          <option value="risk">At Risk</option>
          <option value="healthy">Healthy</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key}
                  className={col.sortable ? 'cursor-pointer hover:bg-slate-700/50' : ''}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && <SortIcon columnKey={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTickets.map((ticket, index) => {
              const priority = getPriorityLevel(ticket.finalPriority);
              const sla = getSlaStatus(ticket.predictedTTR, ticket.slaLimit);
              
              return (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`cursor-pointer ${ticket.slaRisk ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-slate-700/30'}`}
                  onClick={() => onTicketClick?.(ticket)}
                >
                  <td className="font-mono text-indigo-400">{ticket.id}</td>
                  <td className="font-medium">{ticket.customer}</td>
                  <td>
                    <span className={getEmotionColor(ticket.emotion)}>
                      {ticket.emotion}
                    </span>
                  </td>
                  <td className="font-mono">{ticket.emotionWeight}</td>
                  <td className="font-mono">{ticket.waitingTimeScore}</td>
                  <td className="font-mono">{ticket.businessPriority}</td>
                  <td className="font-mono">{ticket.predictedTTR}h</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                      {ticket.finalPriority}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sla.bg} ${sla.color}`}>
                      {sla.status}
                    </span>
                  </td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-600/50 text-slate-300">
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    <button className="p-1 rounded hover:bg-slate-600/50 text-slate-400">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {sortedTickets.length === 0 && (
        <div className="p-8 text-center text-slate-400">
          No tickets found matching the filters.
        </div>
      )}
    </div>
  );
}
