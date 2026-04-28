import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AllocationDonut, AllocationLegend } from '../components/charts/AllocationDonut';
import { PieChart, Zap, Plus, Target, Upload, Database, Activity as ActivityIcon, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

// ... (existing allocationData and subAllocation)


const allocationData = [
  { name: 'Equities', value: 55, color: '#6366f1' },
  { name: 'Crypto', value: 20, color: '#06b6d4' },
  { name: 'Fixed Income', value: 15, color: '#10b981' },
  { name: 'Commodities', value: 7, color: '#f59e0b' },
  { name: 'Cash', value: 3, color: '#94a3b8' },
];

const subAllocation = {
  Equities: [
    { name: 'Tech', value: 40, color: '#818cf8' },
    { name: 'Healthcare', value: 20, color: '#a5b4fc' },
    { name: 'Finance', value: 20, color: '#c7d2fe' },
    { name: 'Consumer', value: 20, color: '#e0e7ff' },
  ],
  Crypto: [
    { name: 'Bitcoin', value: 60, color: '#22d3ee' },
    { name: 'Ethereum', value: 30, color: '#67e8f9' },
    { name: 'Altcoins', value: 10, color: '#a5f3fc' },
  ]
};

export function Allocation() {
  const [strategy, setStrategy] = useState('moderate');
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isAddingAsset) {
      fetchAssets();
    }
  }, [isAddingAsset]);

  const fetchAssets = async () => {
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:5000/api/assets');
      const result = await response.json();
      setAvailableAssets(result.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddAsset = async (asset: any) => {
    try {
      // Portfolio ID from previous seed
      const portfolioId = 'e96be20e-9fa3-4637-b153-6fb33d1e5573';
      const response = await fetch(`http://localhost:5000/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: {
            create: { assetId: asset.id, quantity: 1, weight: 0.05 }
          }
        })
      });
      if (response.ok) {
        alert(`${asset.ticker} added to portfolio!`);
        setIsAddingAsset(false);
      }
    } catch (error) {
      console.error('Failed to add asset:', error);
    }
  };

  const strategies = [
    { id: 'conservative', label: 'Conservative', desc: 'Focus on wealth preservation and low volatility.', icon: <Target size={16} /> },
    { id: 'moderate', label: 'Moderate', desc: 'Balanced growth with controlled risk exposure.', icon: <Zap size={16} /> },
    { id: 'aggressive', label: 'Aggressive', desc: 'Maximum growth potential through high volatility.', icon: <Target size={16} /> },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">Asset Allocation</h1>
          <p className="text-secondary-foreground text-sm">Deep dive into your portfolio's distribution strategy</p>
        </div>
        <button 
          onClick={() => setIsAddingAsset(true)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Add New Asset
        </button>
      </motion.div>

      {/* Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {strategies.map((s) => (
          <button
            key={s.id}
            onClick={() => setStrategy(s.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              strategy === s.id 
                ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${strategy === s.id ? 'bg-primary text-white' : 'bg-white/10 text-secondary-foreground'}`}>
                {s.icon}
              </div>
              <span className={`font-bold ${strategy === s.id ? 'text-primary' : 'text-foreground'}`}>{s.label}</span>
            </div>
            <p className="text-xs text-secondary-foreground leading-relaxed">{s.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChart size={20} className="text-primary" /> Target vs Actual
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <AllocationDonut data={allocationData} />
              <div className="w-full mt-6">
                <AllocationLegend data={allocationData} />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-6">
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Equities Breakdown</h3>
            <div className="space-y-4">
              {subAllocation.Equities.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-foreground">{item.name}</span>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Crypto Breakdown</h3>
            <div className="space-y-4">
              {subAllocation.Crypto.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-foreground">{item.name}</span>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Zap className="text-accent" size={20} /> AI Allocation Optimizer
            </h3>
            <p className="text-sm text-secondary-foreground max-w-2xl">
              Your portfolio is currently 4% drifted from its optimal Markowitz efficient frontier target. Run the reinforcement learning engine to generate rebalancing trades.
            </p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all whitespace-nowrap">
            Generate Rebalance Plan
          </button>
        </div>
      </motion.div>

      {/* Data Management Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database size={20} className="text-primary" /> Data Sources & Sets
              </h3>
              <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <Upload size={14} /> Import Dataset (CSV/JSON)
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'S&P 500 Historical (5Y)', source: 'Quantis Cloud', status: 'Synced', date: '2h ago' },
                { name: 'Crypto Core Liquidity', source: 'Coinbase API', status: 'Live', date: 'Real-time' },
                { name: 'Custom Alpha Set #4', source: 'Manual Upload', status: 'Verified', date: 'Yesterday' },
              ].map((data, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-secondary-foreground">
                      <Database size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{data.name}</p>
                      <p className="text-[11px] text-secondary-foreground/60">{data.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'Live' ? 'bg-success animate-pulse' : 'bg-primary'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{data.status}</span>
                    </div>
                    <p className="text-[10px] text-secondary-foreground/40">{data.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ActivityIcon size={20} className="text-accent" /> Engine Health
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-secondary-foreground">Learning Consistency</span>
                  <span className="text-success font-bold">98.4%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[98.4%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-secondary-foreground">Data Pipeline Latency</span>
                  <span className="text-accent font-bold">12ms</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[15%] rounded-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[11px] text-secondary-foreground leading-relaxed italic">
                  "The RL engine is currently consuming 12 high-fidelity data streams. Accuracy is within standard institutional thresholds."
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
      {/* Add Asset Modal */}
      {isAddingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0a0a0b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold">Add Institutional Asset</h3>
              <button onClick={() => setIsAddingAsset(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-foreground/60" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by ticker or name (e.g. AAPL, BTC)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                {availableAssets
                  .filter(a => a.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((asset) => (
                  <div 
                    key={asset.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group cursor-pointer"
                    onClick={() => handleAddAsset(asset)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        {asset.ticker}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{asset.name}</p>
                        <p className="text-[10px] text-secondary-foreground/60 uppercase tracking-wider">{asset.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${asset.currentPrice.toLocaleString()}</p>
                      <button className="text-[10px] text-primary font-bold uppercase hover:underline">Add Asset</button>
                    </div>
                  </div>
                ))}
                {isSearching && <p className="text-center text-secondary-foreground text-sm py-8">Scanning markets...</p>}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
