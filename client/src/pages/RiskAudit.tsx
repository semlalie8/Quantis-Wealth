import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

const riskMetrics = [
  { label: 'Portfolio Beta', value: '0.85', desc: '15% less volatile than the market', status: 'optimal' },
  { label: 'Sharpe Ratio', value: '1.42', desc: 'Excellent risk-adjusted returns', status: 'optimal' },
  { label: 'Max Drawdown', value: '-8.2%', desc: 'Largest peak-to-trough drop', status: 'warning' },
  { label: 'Value at Risk (95%)', value: '$2,140', desc: 'Max expected daily loss', status: 'optimal' },
];

const stressTests = [
  { scenario: '2008 Financial Crisis Repeat', impact: '-22.4%', mitigation: 'Strong bond/cash buffer' },
  { scenario: 'Tech Sector Crash (-30%)', impact: '-12.8%', mitigation: 'High tech exposure' },
  { scenario: 'Crypto Winter (-50%)', impact: '-10.0%', mitigation: 'Capped at 20% max allocation' },
];

export function RiskAudit() {
  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Risk Audit & Compliance</h1>
        <p className="text-secondary-foreground text-sm">Deep analytics, stress testing, and limit checks</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <GlassCard className="h-full">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ShieldAlert className="text-primary" size={20} /> Advanced Risk Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {riskMetrics.map((metric) => (
                <div key={metric.label} className="bg-white/5 border border-white/10 p-5 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-secondary-foreground">{metric.label}</p>
                    {metric.status === 'optimal' ? (
                      <CheckCircle2 size={16} className="text-success" />
                    ) : (
                      <AlertTriangle size={16} className="text-warning" />
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1">{metric.value}</p>
                  <p className="text-xs text-secondary-foreground/70">{metric.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="h-full bg-gradient-to-br from-background to-danger/5 border-danger/20">
            <h3 className="text-lg font-semibold mb-4 text-danger flex items-center gap-2">
              <AlertTriangle size={20} /> Stress Testing
            </h3>
            <p className="text-sm text-secondary-foreground mb-6">
              Simulating extreme market conditions against your current allocations.
            </p>
            <div className="space-y-4">
              {stressTests.map((test) => (
                <div key={test.scenario} className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="font-semibold text-sm mb-1">{test.scenario}</p>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-secondary-foreground">Impact</span>
                    <span className="text-danger font-bold">{test.impact}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg text-xs">
                    <Info size={14} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-secondary-foreground">{test.mitigation}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
