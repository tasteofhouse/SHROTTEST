import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

export default function TrendChart({ trend }) {
  if (!trend || trend.length === 0) {
    return <div className="text-zinc-500 text-sm">데이터가 없어요.</div>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF0000" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#FF0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
          <XAxis
            dataKey="shortDate"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            interval="preserveStartEnd"
            minTickGap={24}
            stroke="#3a3a3a"
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            stroke="#3a3a3a"
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: '#242424',
              border: '1px solid #3a3a3a',
              borderRadius: 12,
              color: '#f3f4f6',
            }}
            formatter={(value) => [`${value}편`, '시청량']}
            labelFormatter={(l) => `${l}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#FF0000"
            strokeWidth={2}
            fill="url(#trendGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
