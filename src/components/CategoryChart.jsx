import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CategoryChart({ categoryDist }) {
  const data = categoryDist
    .filter((c) => c.count > 0)
    .map((c) => ({
      name: `${c.emoji} ${c.label}`,
      value: c.count,
      ratio: c.ratio,
      color: c.color,
    }));

  if (data.length === 0) {
    return <div className="text-zinc-500 text-sm">표시할 데이터가 없어요.</div>;
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#242424',
              border: '1px solid #3a3a3a',
              borderRadius: 12,
              color: '#f3f4f6',
            }}
            formatter={(value, name, props) => [
              `${value.toLocaleString()}편 (${Math.round(props.payload.ratio * 100)}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            iconSize={10}
            wrapperStyle={{ fontSize: 12, color: '#d4d4d8' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
