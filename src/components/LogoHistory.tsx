import React from 'react';
import { History, Image as ImageIcon, Trash2, Check } from 'lucide-react';
import { GeneratedLogo } from '../types';

interface LogoHistoryProps {
  history: GeneratedLogo[];
  activeLogoId: string | null;
  onSelectLogo: (logo: GeneratedLogo) => void;
  onClearHistory: () => void;
}

export const LogoHistory: React.FC<LogoHistoryProps> = ({
  history,
  activeLogoId,
  onSelectLogo,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-zinc-400" />
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Session History ({history.length})
          </h4>
        </div>
        <button
          onClick={onClearHistory}
          className="text-[10px] text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectLogo(item)}
            className={`relative flex items-center gap-2.5 p-2 rounded-xl border shrink-0 transition-all text-left ${
              activeLogoId === item.id
                ? 'bg-zinc-800 border-indigo-500 shadow-sm'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.companyName}
              className="w-9 h-9 object-contain rounded-lg bg-zinc-900 p-0.5 border border-zinc-800"
            />
            <div className="min-w-0 pr-2">
              <span className="text-xs font-bold text-zinc-200 block truncate max-w-[100px]">
                {item.companyName}
              </span>
              <span className="text-[10px] text-zinc-400 block truncate max-w-[100px]">
                {item.imageSize} • {item.style}
              </span>
            </div>
            {activeLogoId === item.id && (
              <span className="w-2 h-2 rounded-full bg-indigo-400 absolute top-2 right-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
