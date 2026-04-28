import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

interface AllocationDonutProps {
  data: AllocationItem[];
  height?: number;
}

export function AllocationDonut({ data, height = 250 }: AllocationDonutProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            animationDuration={1200}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e1e24',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => [`${value}%`, 'Allocation']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AllocationLegendProps {
  data: AllocationItem[];
}

export function AllocationLegend({ data }: AllocationLegendProps) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          <span className="text-sm font-semibold tabular-nums">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}
