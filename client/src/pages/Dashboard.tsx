import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, RefreshCw, Plus, Wallet, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { GlassCard } from '../components/ui/GlassCard';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { AllocationDonut, AllocationLegend } from '../components/charts/AllocationDonut';

// ── Mock Data ──────────────────────────────────────────────
const performanceData = [
  { name: 'Jan', value: 102400 }, { name: 'Feb', value: 98500 },
  { name: 'Mar', value: 115200 }, { name: 'Apr', value: 112800 },
  { name: 'May', value: 121600 }, { name: 'Jun', value: 118900 },
  { name: 'Jul', value: 128450 },
];

const allocationData = [
  { name: 'Equities', value: 55, color: '#6366f1' },
  { name: 'Crypto', value: 20, color: '#06b6d4' },
  { name: 'Fixed Income', value: 15, color: '#10b981' },
  { name: 'Commodities', value: 7, color: '#f59e0b' },
  { name: 'Cash', value: 3, color: '#94a3b8' },
];

const assets = [
  { name: 'Apple Inc.', ticker: 'AAPL', price: 189.20, change: 1.12, allocation: 18.5 },
  { name: 'Nvidia Corporation', ticker: 'NVDA', price: 890.45, change: 3.24, allocation: 15.0 },
  { name: 'Bitcoin', ticker: 'BTC', price: 64200.10, change: 4.18, allocation: 12.0 },
  { name: 'Ethereum', ticker: 'ETH', price: 3240.50, change: 2.40, allocation: 8.0 },
  { name: 'Microsoft', ticker: 'MSFT', price: 415.80, change: -0.52, allocation: 11.5 },
  { name: 'SPDR S&P 500', ticker: 'SPY', price: 510.25, change: 0.85, allocation: 10.0 },
  { name: 'SPDR Gold Shares', ticker: 'GLD', price: 215.40, change: 0.32, allocation: 7.0 },
  { name: 'iShares Bond ETF', ticker: 'AGG', price: 98.50, change: -0.15, allocation: 8.0 },
];

const riskMetrics = [
  { label: 'Sharpe Ratio', value: '1.42', color: 'text-success' },
  { label: 'Max Drawdown', value: '-8.2%', color: 'text-danger' },
  { label: 'Beta', value: '0.85', color: 'text-accent' },
  { label: 'VaR (95%)', value: '$2,140', color: 'text-warning' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

export function Dashboard() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [timePeriod, setTimePeriod] = useState('1M');
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const filteredPerformanceData = timePeriod === '1M' ? performanceData.slice(-4) : performanceData;

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      // In a real app, the portfolio ID would come from the user's session
      const portfolioId = 'e96be20e-9fa3-4637-b153-6fb33d1e5573';
      const response = await fetch(`http://localhost:5000/api/portfolios/${portfolioId}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riskTolerance: 0.6, strategy: 'moderate' })
      });
      const result = await response.json();
      setOptimizationResult(result.data);
      
      // Simulate success delay for animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Optimization Complete! Your portfolio has been rebalanced by the RL engine.');
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">Quantis Wealth Dashboard</h1>
          <p className="text-secondary-foreground text-sm">AI-Driven Multi-Asset Allocation · Reinforcement Learning Engine</p>
        </div>
        <button 
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <RefreshCw size={16} className={isOptimizing ? 'animate-spin' : ''} />
          {isOptimizing ? 'Optimizing...' : 'Smart Rebalance'}
        </button>
      </motion.div>

      {/* Success Banner */}
      {optimizationResult && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 overflow-hidden"
        >
          <div className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-success">Portfolio Rebalanced Successfully</p>
                <p className="text-xs text-success/70">The RL engine has updated {optimizationResult.optimizedWeights.length} asset weights based on {optimizationResult.strategy} strategy.</p>
              </div>
            </div>
            <button 
              onClick={() => setOptimizationResult(null)}
              className="text-success/50 hover:text-success transition-colors text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Balance', value: '$128,450', change: '+12.5%', up: true, icon: <Wallet size={18} /> },
          { label: 'Annual Yield', value: '8.42%', change: '+0.4%', up: true, icon: <TrendingUp size={18} /> },
          { label: 'Risk Grade', value: 'B — Moderate', badge: 'β 0.85', icon: <ShieldCheck size={18} /> },
          { label: 'Active Assets', value: '8', change: '+2', up: true, icon: <Activity size={18} /> },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeIn} initial="hidden" animate="visible">
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        <motion.div custom={4} variants={fadeIn} initial="hidden" animate="visible" className="lg:col-span-2">
          <GlassCard className="overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">Performance Analytics</h3>
              <div className="flex gap-1">
                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(p => (
                  <button
                    key={p}
                    onClick={() => setTimePeriod(p)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                      p === timePeriod 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'hover:bg-white/5 text-secondary-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <PerformanceChart data={filteredPerformanceData} />
          </GlassCard>
        </motion.div>

        {/* Allocation Donut */}
        <motion.div custom={5} variants={fadeIn} initial="hidden" animate="visible">
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
            <AllocationDonut data={allocationData} />
            <AllocationLegend data={allocationData} />
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Risk Metrics Row ── */}
      <motion.div custom={6} variants={fadeIn} initial="hidden" animate="visible" className="mb-8">
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Risk Metrics</h3>
            <span className="text-[10px] bg-success/10 text-success px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              RL-Optimized
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {riskMetrics.map(m => (
              <div key={m.label} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-secondary-foreground mb-1">{m.label}</p>
                <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Holdings Table ── */}
      <motion.div custom={7} variants={fadeIn} initial="hidden" animate="visible">
        <GlassCard>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold">Portfolio Holdings</h3>
            <button className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="text-left text-secondary-foreground text-xs border-b border-white/5">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium text-right">Price</th>
                  <th className="pb-3 font-medium text-right">24h Change</th>
                  <th className="pb-3 font-medium text-right">Weight</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assets.map((asset) => {
                  const isUp = asset.change >= 0;
                  return (
                    <tr key={asset.ticker} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[10px] tracking-wider text-secondary-foreground">
                            {asset.ticker}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{asset.name}</p>
                            <p className="text-[11px] text-secondary-foreground">{asset.ticker}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-medium text-sm tabular-nums">
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-3.5 text-right text-sm font-medium tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>
                        <span className="inline-flex items-center gap-0.5">
                          {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {isUp ? '+' : ''}{asset.change.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-sm font-medium tabular-nums">{asset.allocation}%</td>
                      <td className="py-3.5 text-right">
                        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-lg transition-all">
                          <Plus size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
