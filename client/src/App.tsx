import { useState } from 'react';
import { 
  TrendingUp, PieChart, ShieldCheck, 
  LayoutDashboard, Wallet, Settings as SettingsIcon, Bell, Search, BarChart3, Mail, BookOpen
} from 'lucide-react';
import { NavItem } from './components/ui/NavItem';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Allocation } from './pages/Allocation';
import { Performance } from './pages/Performance';
import { RiskAudit } from './pages/RiskAudit';
import { AiInsights } from './pages/AiInsights';
import { Inbox } from './pages/Inbox';
import { PlatformGuide } from './pages/PlatformGuide';
import { Settings } from './pages/Settings';

// ── Main App ───────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationTab, setNotificationTab] = useState('all');

  const notifications = [
    { id: 1, title: 'Rebalance Opportunity', message: 'Quantis AI suggests a 4.2% shift in Equities.', time: '2m ago', type: 'opportunity' },
    { id: 2, title: 'Risk Alert', message: 'Portfolio Beta has exceeded the 0.85 threshold.', time: '1h ago', type: 'warning' },
    { id: 3, title: 'Performance Report', message: 'Monthly returns are ready for review.', time: '5h ago', type: 'info' },
  ];

  const filteredNotifications = notificationTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === 'warning' || n.type === 'opportunity');

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-white/5 p-6 flex-col hidden lg:flex">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-white/10">
            <img src="/logo.png" alt="Quantis Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Quantis Wealth
          </span>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-secondary-foreground/50 mb-3 px-4">Navigation</p>
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Wallet size={20} />} label="Portfolio" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
          <NavItem icon={<PieChart size={20} />} label="Allocation" active={activeTab === 'allocation'} onClick={() => setActiveTab('allocation')} />
          <NavItem icon={<TrendingUp size={20} />} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
          <NavItem icon={<ShieldCheck size={20} />} label="Risk Audit" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} badge={2} />
          <NavItem icon={<BarChart3 size={20} />} label="AI Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
          <NavItem icon={<Mail size={20} />} label="Inbox" active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} badge={3} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-1">
          <NavItem icon={<BookOpen size={20} />} label="Platform Guide" active={activeTab === 'guide'} onClick={() => setActiveTab('guide')} />
          <NavItem icon={<SettingsIcon size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/60" size={16} />
            <input 
              type="text" 
              placeholder="Search assets, strategies..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-secondary-foreground/40"
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-secondary-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-white/5"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-background" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-background border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl bg-background/95">
                  <div className="p-4 border-b border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm">Notifications</h3>
                      <button className="text-[10px] text-primary font-bold hover:underline">Mark all as read</button>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl">
                      {['all', 'alerts'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setNotificationTab(t)}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize ${
                            notificationTab === t ? 'bg-primary text-white shadow-lg' : 'text-secondary-foreground hover:text-foreground'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredNotifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.type === 'opportunity' ? 'bg-success' : 
                            n.type === 'warning' ? 'bg-warning' : 'bg-primary'
                          }`} />
                          <div className="flex-1">
                            <p className="text-xs font-bold mb-0.5 group-hover:text-primary transition-colors">{n.title}</p>
                            <p className="text-[11px] text-secondary-foreground leading-relaxed mb-1.5">{n.message}</p>
                            <p className="text-[9px] text-secondary-foreground/50">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredNotifications.length === 0 && (
                      <div className="p-8 text-center">
                        <p className="text-xs text-secondary-foreground italic">No alerts found.</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center bg-white/[0.02]">
                    <button className="text-[11px] font-bold text-secondary-foreground hover:text-foreground transition-colors">View all notifications</button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-tight">Sam Semlali</p>
                <p className="text-[11px] text-secondary-foreground">Institutional</p>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg shadow-primary/20 border border-white/10">
                <img src="/avatar.png" alt="Sam Semlali Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'portfolio' && <Portfolio />}
        {activeTab === 'allocation' && <Allocation />}
        {activeTab === 'performance' && <Performance />}
        {activeTab === 'audit' && <RiskAudit />}
        {activeTab === 'insights' && <AiInsights />}
        {activeTab === 'inbox' && <Inbox />}
        {activeTab === 'guide' && <PlatformGuide />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
