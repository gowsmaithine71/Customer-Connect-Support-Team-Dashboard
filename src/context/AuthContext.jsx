import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const demoUsers = {
  agent: { id: 1, name: 'Alex Thompson', email: 'alex@company.com', role: 'agent', avatar: null },
  lead: { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'lead', avatar: null },
  manager: { id: 3, name: 'Michael Roberts', email: 'michael@company.com', role: 'manager', avatar: null },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('support_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (role) => {
    const userData = demoUsers[role] || demoUsers.agent;
    setUser(userData);
    localStorage.setItem('support_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('support_user');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const permissions = {
      agent: ['view_tickets', 'update_status', 'view_own_metrics'],
      lead: ['view_tickets', 'update_status', 'view_own_metrics', 'assign_tickets', 'override_priority', 'view_team_metrics'],
      manager: ['view_tickets', 'update_status', 'view_own_metrics', 'assign_tickets', 'override_priority', 'view_team_metrics', 'manage_settings', 'view_analytics', 'adjust_weights']
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
