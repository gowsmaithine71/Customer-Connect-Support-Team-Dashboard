import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react';

export default function ResolutionForm({ ticket, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    resolution: '',
    rootCause: '',
    satisfactionRating: 5,
    notes: ''
  });

  const rootCauseOptions = [
    'Software Bug',
    'Configuration Issue',
    'User Error',
    'Documentation',
    'Feature Request',
    'Third Party',
    'Duplicate',
    'Cannot Reproduce'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      ...formData,
      ticketId: ticket?.id,
      resolvedAt: new Date().toISOString()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6"
    >
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Resolve Ticket</h3>
      
      {ticket && (
        <div className="mb-4 p-3 bg-slate-800/30 rounded-lg">
          <p className="font-mono text-indigo-400">{ticket.id}</p>
          <p className="text-sm text-slate-300">{ticket.customer}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resolution Summary */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Resolution Summary *
          </label>
          <textarea
            required
            value={formData.resolution}
            onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
            placeholder="Describe how the issue was resolved..."
            className="input h-24 resize-none"
          />
        </div>

        {/* Root Cause */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Root Cause Category *
          </label>
          <select
            required
            value={formData.rootCause}
            onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
            className="select"
          >
            <option value="">Select root cause</option>
            {rootCauseOptions.map(cause => (
              <option key={cause} value={cause}>{cause}</option>
            ))}
          </select>
        </div>

        {/* Satisfaction Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Customer Satisfaction Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, satisfactionRating: rating })}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  formData.satisfactionRating >= rating
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700/50 text-slate-500 border border-slate-600/50'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {formData.satisfactionRating <= 2 ? 'Dissatisfied' : 
             formData.satisfactionRating <= 3 ? 'Neutral' : 
             'Satisfied'}
          </p>
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Internal Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add internal notes (optional)..."
            className="input h-20 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn bg-slate-600 hover:bg-slate-500 text-white"
          >
            <XCircle className="w-4 h-4 mr-2 inline" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 btn bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2 inline" />
            Resolve
          </button>
        </div>
      </form>
    </motion.div>
  );
}
