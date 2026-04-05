import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, Shield, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roleOptions = [
  { 
    id: 'agent', 
    name: 'Support Agent', 
    description: 'Handle tickets and update status',
    icon: Users,
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    id: 'lead', 
    name: 'Team Lead', 
    description: 'Manage team and override priorities',
    icon: Shield,
    color: 'from-violet-500 to-purple-600'
  },
  { 
    id: 'manager', 
    name: 'Manager', 
    description: 'Full access and analytics',
    icon: BarChart3,
    color: 'from-amber-500 to-orange-600'
  }
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate('/overview');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">SupportHub</h1>
          <p className="text-slate-400">Emotion-Aware AI Support System</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-6 text-center">
            Select Your Role
          </h2>

          <div className="space-y-3 mb-6">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{role.name}</p>
                      <p className="text-sm text-slate-400">{role.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`w-full btn py-3 ${
              selectedRole 
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Continue as {selectedRole ? roleOptions.find(r => r.id === selectedRole)?.name : 'Select Role'}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Demo mode - No authentication required
        </p>
      </motion.div>
    </div>
  );
}
