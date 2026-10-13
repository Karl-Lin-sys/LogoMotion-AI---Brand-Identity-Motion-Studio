import React from 'react';
import {
  Sparkles,
  Film,
  Layers,
  Palette,
  Play,
  RotateCcw,
  Sliders,
  Wand2,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'design' | 'veo' | 'motion' | 'mockups' | 'export';
  setActiveTab: (tab: 'design' | 'veo' | 'motion' | 'mockups' | 'export') => void;
  hasActiveLogo: boolean;
  hasGeneratedVideo: boolean;
  onOpenInspirations: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveLogo,
  hasGeneratedVideo,
  onOpenInspirations,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('design')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                  <Film className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-zinc-100 tracking-tight font-sans">
                  LogoMotion<span className="text-cyan-400 font-mono">.ai</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  Studio
                </span>
              </div>
              <p className="hidden sm:block text-xs text-zinc-400 truncate">
                AI Brand Design &amp; Veo Motion Suite
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'design'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>1. Design Logo</span>
            </button>

            <button
              onClick={() => setActiveTab('veo')}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'veo'
                  ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-indigo-200 border border-indigo-500/50 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-purple-400" />
              <span>2. Veo Animation</span>
              {hasGeneratedVideo && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('motion')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'motion'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">3. Live Motion</span>
              <span className="sm:hidden">Live</span>
            </button>

            <button
              onClick={() => setActiveTab('mockups')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'mockups'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">4. Mockups</span>
              <span className="sm:hidden">Mockups</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'export'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">5. Brand Kit</span>
              <span className="sm:hidden">Kit</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInspirations}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspirations</span>
            </button>

            {hasActiveLogo && (
              <button
                onClick={onReset}
                title="Create New Logo"
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
