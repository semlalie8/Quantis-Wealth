import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Sparkles, BrainCircuit, TrendingUp, Lightbulb, ArrowUpRight } from 'lucide-react';

const insights = [
  {
    title: "Overweight in Tech Sector",
    content: "Your portfolio has a 40% concentration in technology stocks. While this has driven recent outperformance, it increases your correlation risk to NASDAQ movements. Consider reallocating 5% to defensive sectors.",
    type: "warning",
    icon: <BrainCircuit size={18} className="text-warning" />
  },
  {
    title: "Crypto Volatility Opportunity",
    content: "Bitcoin's recent 15% dip has moved your crypto allocation below your 20% target. The RL model suggests this is an optimal entry point for tax-loss harvesting and rebalancing.",
    type: "opportunity",
    icon: <TrendingUp size={18} className="text-success" />
  },
  {
    title: "Interest Rate Sensitivity",
    content: "With the Fed signaling a potential rate cut in Q3, your Fixed Income duration (currently 4.2 years) might be too short to fully capitalize on bond price appreciation.",
    type: "info",
    icon: <Lightbulb size={18} className="text-accent" />
  }
];

export function AiInsights() {
  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-3">
          <Sparkles className="text-primary" /> AI Agent Insights
        </h1>
        <p className="text-secondary-foreground text-sm">LLM-generated contextual reasoning based on your latest portfolio state</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {insights.map((insight, i) => (
          <motion.div key={insight.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="h-full">
            <GlassCard className="h-full flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${insight.type === 'warning' ? 'bg-warning' : insight.type === 'opportunity' ? 'bg-success' : 'bg-accent'}`} />
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {insight.icon}
                </div>
                <h3 className="font-semibold text-base leading-tight">{insight.title}</h3>
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed flex-1">
                {insight.content}
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <button className="text-xs font-semibold text-primary hover:text-white transition-colors">
                  Take Action →
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard className="bg-black/20">
          <div className="flex flex-col md:flex-row items-center gap-6 p-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <BrainCircuit size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Chat with Quantis AI</h3>
              <p className="text-sm text-secondary-foreground mb-4">
                Ask specific questions about your portfolio strategy, request backtesting scenarios, or explore alternative allocations.
              </p>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g., 'What happens to my portfolio if tech stocks drop 20%?'" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-all text-white placeholder:text-secondary-foreground/40"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-lg hover:opacity-90 transition-opacity">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
