import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

const performanceData = [
  { name: 'Jan', value: 102400 }, { name: 'Feb', value: 98500 },
  { name: 'Mar', value: 115200 }, { name: 'Apr', value: 112800 },
  { name: 'May', value: 121600 }, { name: 'Jun', value: 118900 },
  { name: 'Jul', value: 128450 }, { name: 'Aug', value: 135000 },
  { name: 'Sep', value: 132000 }, { name: 'Oct', value: 142500 },
  { name: 'Nov', value: 155000 }, { name: 'Dec', value: 168400 },
];

export function Performance() {
  const [timePeriod, setTimePeriod] = useState('1Y');

  // Simulate data change based on time period
  const displayData = timePeriod === '1M' ? performanceData.slice(-4) : performanceData;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">Performance History</h1>
          <p className="text-secondary-foreground text-sm">Historical returns, benchmarking, and growth metrics</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          {['1M', '3M', '6M', 'YTD', '1Y', 'ALL'].map((p) => (
            <button 
              key={p} 
              onClick={() => setTimePeriod(p)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${timePeriod === p ? 'bg-primary text-white shadow-md' : 'text-secondary-foreground hover:text-white'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success">
                <ArrowUpRight size={16} />
              </div>
              <p className="text-sm text-secondary-foreground font-medium">Time-Weighted Return</p>
            </div>
            <p className="text-3xl font-bold mt-2">+24.5%</p>
            <p className="text-xs text-success mt-1 inline-block bg-success/10 px-2 py-0.5 rounded">Outperforming S&P 500 by 4.2%</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <TrendingUp size={16} />
              </div>
              <p className="text-sm text-secondary-foreground font-medium">Money-Weighted Return</p>
            </div>
            <p className="text-3xl font-bold mt-2">+22.8%</p>
            <p className="text-xs text-secondary-foreground mt-1">Accounts for cash flows</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Calendar size={16} />
              </div>
              <p className="text-sm text-secondary-foreground font-medium">Best Month</p>
            </div>
            <p className="text-3xl font-bold mt-2">November</p>
            <p className="text-xs text-accent mt-1 inline-block bg-accent/10 px-2 py-0.5 rounded">+8.7% growth</p>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard className="h-[450px]">
          <h3 className="text-lg font-semibold mb-6">Historical Growth ($)</h3>
          <div className="h-[350px] w-full">
            <PerformanceChart data={displayData} />
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
