import React from 'react';
import { Clock, TrendingDown, TrendingUp, Eye, BarChart2, Tag } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// Generate plausible mock price-trend data relative to the listing price
function generatePriceTrend(currentPrice) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let price = currentPrice * 1.08;
  return months.map((month) => {
    price = price * (0.97 + Math.random() * 0.025);
    return { month, price: Math.round(price) };
  });
}

export default function VehicleStats({ car }) {
  const daysOnSite = Math.floor(Math.random() * 40) + 3; // 3–42 days (deterministic feel)
  const views = Math.floor(car.id * 73 + 112); // pseudo-deterministic
  const priceData = generatePriceTrend(car.price);
  const marketAvg = Math.round(car.price * 1.06);
  const saving = marketAvg - car.price;
  const isBelowMarket = saving > 0;

  const stats = [
    {
      icon: Clock,
      label: 'Days on site',
      value: `${daysOnSite} days`,
      sub: daysOnSite <= 7 ? 'Just listed' : daysOnSite <= 21 ? 'Listed recently' : 'Listed a while ago',
      color: 'text-primary',
      bg: 'bg-primary/8',
    },
    {
      icon: Eye,
      label: 'Listing views',
      value: views.toLocaleString(),
      sub: 'People viewed this ad',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: isBelowMarket ? TrendingDown : TrendingUp,
      label: 'vs. Market avg',
      value: `€${marketAvg.toLocaleString()}`,
      sub: isBelowMarket
        ? `€${saving.toLocaleString()} below average`
        : `€${Math.abs(saving).toLocaleString()} above average`,
      color: isBelowMarket ? 'text-green-600' : 'text-orange-500',
      bg: isBelowMarket ? 'bg-green-50' : 'bg-orange-50',
    },
    {
      icon: Tag,
      label: 'Price changes',
      value: '1 reduction',
      sub: 'Price dropped since listing',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-primary" />
        <h2 className="text-base font-bold text-foreground">Market Insights</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className={`rounded-xl p-3.5 ${bg}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
            </div>
            <p className={`text-lg font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Price trend chart */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Price Trend (similar vehicles)</p>
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={priceData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(213,80%,50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(213,80%,50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => [`€${v.toLocaleString()}`, 'Avg price']}
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
            <Area type="monotone" dataKey="price" stroke="hsl(213,80%,50%)" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground text-center mt-1">Average market prices for comparable vehicles</p>
      </div>
    </div>
  );
}