import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { ArrowUpRight, ArrowDownRight, Plus, Filter, Download } from 'lucide-react';

const assets = [
  { name: 'Apple Inc.', ticker: 'AAPL', price: 189.20, change: 1.12, allocation: 18.5, qty: 150, value: 28380 },
  { name: 'Nvidia Corporation', ticker: 'NVDA', price: 890.45, change: 3.24, allocation: 15.0, qty: 45, value: 40070.25 },
  { name: 'Bitcoin', ticker: 'BTC', price: 64200.10, change: 4.18, allocation: 12.0, qty: 0.5, value: 32100.05 },
  { name: 'Ethereum', ticker: 'ETH', price: 3240.50, change: 2.40, allocation: 8.0, qty: 12, value: 38886 },
  { name: 'Microsoft', ticker: 'MSFT', price: 415.80, change: -0.52, allocation: 11.5, qty: 85, value: 35343 },
  { name: 'SPDR S&P 500', ticker: 'SPY', price: 510.25, change: 0.85, allocation: 10.0, qty: 120, value: 61230 },
  { name: 'SPDR Gold Shares', ticker: 'GLD', price: 215.40, change: 0.32, allocation: 7.0, qty: 80, value: 17232 },
  { name: 'iShares Bond ETF', ticker: 'AGG', price: 98.50, change: -0.15, allocation: 8.0, qty: 200, value: 19700 },
];

export function Portfolio() {
  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">Portfolio Management</h1>
          <p className="text-secondary-foreground text-sm">View, track, and rebalance your active holdings</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-90 flex items-center gap-2">
            <Plus size={16} /> Add Asset
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Active Holdings</h3>
            <button className="text-secondary-foreground hover:text-white transition-colors">
              <Download size={18} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-left text-secondary-foreground text-xs border-b border-white/5">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium text-right">Price</th>
                  <th className="pb-3 font-medium text-right">24h Change</th>
                  <th className="pb-3 font-medium text-right">Holdings</th>
                  <th className="pb-3 font-medium text-right">Total Value</th>
                  <th className="pb-3 font-medium text-right">Weight</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assets.map((asset) => {
                  const isUp = asset.change >= 0;
                  return (
                    <tr key={asset.ticker} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs tracking-wider text-secondary-foreground">
                            {asset.ticker}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{asset.name}</p>
                            <p className="text-xs text-secondary-foreground">{asset.ticker}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right font-medium text-sm tabular-nums text-foreground">
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-4 text-right text-sm font-medium tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>
                        <span className="inline-flex items-center gap-0.5 bg-background/50 px-2 py-1 rounded-md">
                          {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {isUp ? '+' : ''}{asset.change.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-4 text-right text-sm font-medium tabular-nums text-secondary-foreground">
                        {asset.qty}
                      </td>
                      <td className="py-4 text-right text-sm font-bold tabular-nums text-foreground">
                        ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 text-right text-sm font-medium tabular-nums">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-secondary-foreground">{asset.allocation}%</span>
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${asset.allocation}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-xl transition-all text-secondary-foreground hover:text-white">
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
