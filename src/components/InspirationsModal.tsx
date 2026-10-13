import React from 'react';
import { Sparkles, X, ArrowRight, Zap, Check } from 'lucide-react';
import { BRAND_INSPIRATIONS } from '../constants/presets';
import { BrandConceptPreset } from '../types';

interface InspirationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept: (concept: BrandConceptPreset) => void;
}

export const InspirationsModal: React.FC<InspirationsModalProps> = ({
  isOpen,
  onClose,
  onSelectConcept,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Brand Inspiration Gallery</h3>
              <p className="text-xs text-zinc-400">
                Choose a pre-configured studio concept to populate the designer instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Concepts */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {BRAND_INSPIRATIONS.map((concept, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectConcept(concept);
                onClose();
              }}
              className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/60 transition-all cursor-pointer group flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {concept.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    {concept.industry}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{concept.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
                  <span>Style: <strong className="text-zinc-300">{concept.style}</strong></span>
                  <span>•</span>
                  <span>Palette: <strong className="text-zinc-300">{concept.colors}</strong></span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
