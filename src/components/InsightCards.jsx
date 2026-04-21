import { Zap, Clock, Users } from 'lucide-react';

const ICONS = [Zap, Clock, Users];
const COLORS = [
  'from-yt-red/20 to-yt-red/5 border-yt-red/30',
  'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30',
  'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
];

export default function InsightCards({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((text, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <div
            key={i}
            className={`rounded-2xl p-5 bg-gradient-to-br ${COLORS[i % COLORS.length]} border backdrop-blur animate-fade-up`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
              <p className="text-sm md:text-base text-zinc-100 leading-relaxed">
                {text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
