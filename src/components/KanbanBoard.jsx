import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, User, Clock } from 'lucide-react';
import { getPriorityLevel, getEmotionColor, formatTimeAgo } from '../utils/priorityCalculator';

const columns = [
  { id: 'New', title: 'Unassigned', color: 'border-slate-500' },
  { id: 'Assigned', title: 'Assigned', color: 'border-blue-500' },
  { id: 'In Progress', title: 'In Progress', color: 'border-amber-500' },
  { id: 'Escalated', title: 'Escalated', color: 'border-red-500' },
  { id: 'Resolved', title: 'Resolved', color: 'border-emerald-500' }
];

function TicketCard({ ticket, isDragging }) {
  const priority = getPriorityLevel(ticket.finalPriority);
  
  return (
    <div className={`p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-xs text-indigo-400">{ticket.id}</span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priority.bg} ${priority.color}`}>
          {ticket.finalPriority}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-200 mb-1">{ticket.customer}</p>
      <p className={`text-xs ${getEmotionColor(ticket.emotion)} mb-2`}>{ticket.emotion}</p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(ticket.createdAt)}</span>
        </div>
        {ticket.assignedAgent && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate max-w-[60px]">{ticket.assignedAgent?.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTicketCard({ ticket }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TicketCard ticket={ticket} isDragging={isDragging} />
    </div>
  );
}

function Column({ column, tickets }) {
  return (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 ${column.color}`}>
        <h3 className="font-semibold text-slate-200">{column.title}</h3>
        <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-400">
          {tickets.length}
        </span>
      </div>
      <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <SortableTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({ tickets, onTicketMove }) {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const ticketsByColumn = columns.reduce((acc, col) => {
    acc[col.id] = tickets.filter(t => t.status === col.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const ticketId = active.id;
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
      setActiveId(null);
      return;
    }

    // Find which column the item was dropped on
    let newStatus = null;
    for (const col of columns) {
      const columnTickets = ticketsByColumn[col.id];
      if (columnTickets.some(t => t.id === over.id) || over.id === col.id) {
        newStatus = col.id;
        break;
      }
    }

    if (newStatus && newStatus !== ticket.status) {
      onTicketMove?.(ticketId, newStatus);
    }
    
    setActiveId(null);
  };

  const activeTicket = activeId ? tickets.find(t => t.id === activeId) : null;

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <Column 
            key={column.id} 
            column={column} 
            tickets={ticketsByColumn[column.id]} 
          />
        ))}
      </div>
      <DragOverlay>
        {activeTicket && (
          <div className="w-[280px]">
            <TicketCard ticket={activeTicket} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
