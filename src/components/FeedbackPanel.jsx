import { useState } from 'react';

const FEEDBACKS = [
  {
    id: 'accurate',
    emoji: '✅',
    label: '정확해요',
    activeClass: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
  },
  {
    id: 'interesting',
    emoji: '✨',
    label: '흥미로워요',
    activeClass: 'border-yellow-500 bg-yellow-500/10 text-yellow-300',
  },
  {
    id: 'disappointing',
    emoji: '😕',
    label: '아쉬워요',
    activeClass: 'border-zinc-500 bg-zinc-700/50 text-zinc-300',
  },
];

const SESSION_KEY = 'shorts-insight-feedback';

export default function FeedbackPanel({ personalityId }) {
  const storageKey = `${SESSION_KEY}-${personalityId}`;
  const [selected, setSelected] = useState(() => {
    try {
      return sessionStorage.getItem(storageKey);
    } catch {
      return null;
    }
  });

  const handleSelect = (id) => {
    setSelected(id);
    try {
      sessionStorage.setItem(storageKey, id);
    } catch {}
  };

  if (selected) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-zinc-400">
          피드백 감사해요! 더 나은 분석을 위해 활용할게요 🙏
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-3">
      <p className="text-sm text-zinc-400">결과가 마음에 드셨나요?</p>
      <div className="flex gap-3">
        {FEEDBACKS.map(({ id, emoji, label, activeClass }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border transition
              ${selected === id
                ? activeClass
                : 'border-zinc-700 bg-bg-card text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800'
              }`}
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
