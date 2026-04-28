import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { User, Bell, Lock, Eye, Key, Database, Save, Trash2, Camera } from 'lucide-react';

export function Settings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1000px] mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Platform Settings</h1>
        <p className="text-secondary-foreground text-sm">Manage your institutional account and API preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Column */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', icon: <User size={18} />, label: 'Profile' },
            { id: 'security', icon: <Lock size={18} />, label: 'Security' },
            { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
            { id: 'api', icon: <Key size={18} />, label: 'API & Data' },
            { id: 'appearance', icon: <Eye size={18} />, label: 'Appearance' },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.id === 'profile' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-secondary-foreground hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center overflow-hidden border border-white/10">
                   <img src="/avatar.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl text-white shadow-lg border-4 border-background group-hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h4 className="font-bold">Sam Semlali</h4>
                <p className="text-xs text-secondary-foreground">Institutional Portfolio Manager</p>
                <button className="text-primary text-xs font-bold mt-2 hover:underline">Change Avatar</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-secondary-foreground/60 px-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Sam Semlali"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-secondary-foreground/60 px-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="sam.semlali@quantis.capital"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          </GlassCard>

          {/* API Keys Section */}
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">API & Data Connections</h3>
              <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <Plus size={14} /> New Key
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-primary" />
                    <span className="text-sm font-bold">Quantis Live Stream</span>
                  </div>
                  <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="password" 
                    readOnly 
                    value="********************************"
                    className="flex-1 bg-transparent text-xs text-secondary-foreground focus:outline-none"
                  />
                  <button className="text-primary text-[10px] font-bold">Reveal</button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-white/5">
            <h3 className="text-sm font-bold text-destructive mb-4">Danger Zone</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-xs font-bold hover:bg-destructive hover:text-white transition-all">
              <Trash2 size={14} /> Delete Institutional Data
            </button>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-6">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 min-w-[140px] justify-center disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Save size={18} />
                  </motion.div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
