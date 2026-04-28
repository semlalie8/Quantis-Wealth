import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { BookOpen, TrendingUp, ShieldCheck, Zap, Database, Mail, Info } from 'lucide-react';

const sections = [
  {
    title: 'The Core Philosophy',
    icon: <TrendingUp className="text-primary" />,
    content: 'Quantis utilizes Dynamic Asset Allocation (DAA), where the engine continuously learns from market volatility and macroeconomic shifts to adjust your exposure using MPT and Reinforcement Learning.'
  },
  {
    title: 'Dashboard Analysis',
    icon: <BookOpen className="text-accent" />,
    content: 'Monitor your absolute growth, annual yield, and risk grade. Use time-period tabs to distinguish between short-term noise and long-term institutional trends.'
  },
  {
    title: 'Asset & Strategy Management',
    icon: <Zap className="text-warning" />,
    content: 'Define your constraints by choosing between Conservative, Moderate, or Aggressive strategies. Add new institutional assets to the tracking list with a single click.'
  },
  {
    title: 'Smart Rebalancing',
    icon: <Zap className="text-primary" />,
    content: 'Run the RL engine to calculate optimal weights that minimize variance while aiming for your target return. Review suggested shifts before execution.'
  },
  {
    title: 'Risk Auditing',
    icon: <ShieldCheck className="text-success" />,
    content: 'Deep-dive into Beta, Value at Risk (VaR), and historical stress testing to ensure your portfolio health remains within institutional thresholds.'
  },
  {
    title: 'Data Management',
    icon: <Database className="text-primary" />,
    content: 'Import custom CSV/JSON datasets and monitor live API streams from Coinbase or Quantis Cloud. Track learning consistency and pipeline latency.'
  }
];

export function PlatformGuide() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
          <BookOpen size={32} />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">Strategic Platform Guide</h1>
        <p className="text-secondary-foreground text-lg max-w-2xl mx-auto">
          Master the Quantis Wealth ecosystem with our comprehensive institutional framework.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sections.map((s, i) => (
          <motion.div 
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="h-full hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                  {s.icon}
                </div>
                <h3 className="font-bold text-lg">{s.title}</h3>
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed">
                {s.content}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.8 }}
        className="bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4 text-primary">
          <Info size={20} />
          <span className="font-bold uppercase tracking-wider text-xs">Fiduciary Transparency</span>
        </div>
        <p className="text-secondary-foreground text-sm max-w-3xl mx-auto mb-6">
          "As an institutional user, every AI-driven decision is recorded in the immutable Allocation History, ensuring complete auditability of your wealth management journey."
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            Contact Support
          </button>
          <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
            Download PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}
