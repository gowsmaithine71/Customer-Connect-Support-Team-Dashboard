import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, gradient, delay = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400';
    return trend > 0 ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card p-6"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${gradient || 'gradient-primary'} flex items-center justify-center`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-slate-100 font-mono">{count}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
