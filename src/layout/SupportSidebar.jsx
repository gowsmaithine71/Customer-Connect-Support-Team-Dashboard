import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Cpu, 
  KanbanSquare, 
  Clock, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/overview', icon: LayoutDashboard, label: 'Overview' },
  { path: '/incoming-tickets', icon: Inbox, label: 'Incoming Tickets' },
  { path: '/priority-engine', icon: Cpu, label: 'Priority Engine' },
  { path: '/assignment-board', icon: KanbanSquare, label: 'Assignment Board' },
  { path: '/sla-monitor', icon: Clock, label: 'SLA Monitor' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function SupportSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'agent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'lead': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'manager': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-slate-100">SupportHub</span>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto">
            <Headphones className="w-5 h-5 text-white" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors ${
            collapsed ? 'hidden' : ''
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-indigo-500/20 text-indigo-400 border-l-2 border-indigo-500' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-slate-200'}`} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button 
          onClick={() => setCollapsed(false)}
          className="p-2 mx-auto mb-4 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rotate-180" />
        </button>
      )}

      {/* User Section */}
      <div className="p-4 border-t border-slate-700/50">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                <span className="text-sm font-semibold text-slate-200">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{user?.name || 'User'}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role || 'agent'}
                </span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={logout}
            className="w-full p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors flex justify-center"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
