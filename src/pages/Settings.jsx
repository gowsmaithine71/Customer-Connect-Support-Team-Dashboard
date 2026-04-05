import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Palette, Users, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, hasPermission } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      slaAlerts: true,
      assignmentNotifications: true,
      dailyDigest: false
    },
    display: {
      compactMode: false,
      showAvatars: true,
      animations: true
    },
    autoAssignment: {
      enabled: true,
      maxWorkload: 15,
      skillBased: true
    }
  });

  const canManageSettings = hasPermission('manage_settings');

  const handleSave = () => {
    // Would save to local storage or API
    console.log('Settings saved:', settings);
  };

  const Section = ({ icon: Icon, title, description, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );

  const Toggle = ({ label, description, checked, onChange, disabled }) => (
    <div className={`flex items-center justify-between py-3 ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <p className="font-medium text-slate-200">{label}</p>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-indigo-500' : 'bg-slate-600'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400">Configure your dashboard preferences</p>
      </div>

      {/* Notifications */}
      <Section
        icon={Bell}
        title="Notifications"
        description="Manage how you receive alerts and updates"
      >
        <div className="space-y-1">
          <Toggle
            label="Email Notifications"
            description="Receive updates via email"
            checked={settings.notifications.email}
            onChange={(v) => setSettings({ ...settings, notifications: { ...settings.notifications, email: v } })}
            disabled={!canManageSettings}
          />
          <Toggle
            label="SLA Alerts"
            description="Get notified when tickets approach SLA breach"
            checked={settings.notifications.slaAlerts}
            onChange={(v) => setSettings({ ...settings, notifications: { ...settings.notifications, slaAlerts: v } })}
          />
          <Toggle
            label="Assignment Notifications"
            description="Notify when tickets are assigned to you"
            checked={settings.notifications.assignmentNotifications}
            onChange={(v) => setSettings({ ...settings, notifications: { ...settings.notifications, assignmentNotifications: v } })}
          />
          <Toggle
            label="Daily Digest"
            description="Receive a daily summary of activity"
            checked={settings.notifications.dailyDigest}
            onChange={(v) => setSettings({ ...settings, notifications: { ...settings.notifications, dailyDigest: v } })}
          />
        </div>
      </Section>

      {/* Display */}
      <Section
        icon={Palette}
        title="Display"
        description="Customize the appearance"
      >
        <div className="space-y-1">
          <Toggle
            label="Compact Mode"
            description="Use smaller spacing and font sizes"
            checked={settings.display.compactMode}
            onChange={(v) => setSettings({ ...settings, display: { ...settings.display, compactMode: v } })}
          />
          <Toggle
            label="Show Avatars"
            description="Display user avatars in the interface"
            checked={settings.display.showAvatars}
            onChange={(v) => setSettings({ ...settings, display: { ...settings.display, showAvatars: v } })}
          />
          <Toggle
            label="Animations"
            description="Enable smooth transitions and effects"
            checked={settings.display.animations}
            onChange={(v) => setSettings({ ...settings, display: { ...settings.display, animations: v } })}
          />
        </div>
      </Section>

      {/* Auto Assignment */}
      <Section
        icon={Users}
        title="Auto Assignment"
        description="Configure automatic ticket distribution"
      >
        <div className="space-y-1">
          <Toggle
            label="Enable Auto Assignment"
            description="Automatically assign new tickets to agents"
            checked={settings.autoAssignment.enabled}
            onChange={(v) => setSettings({ ...settings, autoAssignment: { ...settings.autoAssignment, enabled: v } })}
            disabled={!canManageSettings}
          />
          <Toggle
            label="Skill-Based Assignment"
            description="Match tickets to agents based on expertise"
            checked={settings.autoAssignment.skillBased}
            onChange={(v) => setSettings({ ...settings, autoAssignment: { ...settings.autoAssignment, skillBased: v } })}
            disabled={!canManageSettings || !settings.autoAssignment.enabled}
          />
          {settings.autoAssignment.enabled && (
            <div className="py-3">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Maximum Workload per Agent
              </label>
              <input
                type="range"
                min="5"
                max="25"
                value={settings.autoAssignment.maxWorkload}
                onChange={(e) => setSettings({ ...settings, autoAssignment: { ...settings.autoAssignment, maxWorkload: parseInt(e.target.value) } })}
                disabled={!canManageSettings}
                className="w-full"
              />
              <p className="text-sm text-slate-500 mt-1">{settings.autoAssignment.maxWorkload} tickets</p>
            </div>
          )}
        </div>
      </Section>

      {/* Save Button */}
      {canManageSettings && (
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
            <Save className="w-4 h-4 mr-2 inline" />
            Save Changes
          </button>
        </div>
      )}

      {/* Role Info */}
      <div className="card p-6 bg-slate-800/30">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm text-slate-400">Current Role</p>
            <p className="font-medium text-slate-200 capitalize">{user?.role || 'Guest'}</p>
          </div>
        </div>
        {!canManageSettings && (
          <p className="text-xs text-slate-500 mt-2">
            Manager access required to modify system settings
          </p>
        )}
      </div>
    </div>
  );
}
