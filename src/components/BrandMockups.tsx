import React, { useState } from 'react';
import {
  Layers,
  Smartphone,
  CreditCard,
  Shirt,
  Monitor,
  Building2,
  Download,
  Eye,
  Check,
} from 'lucide-react';
import { GeneratedLogo } from '../types';

interface BrandMockupsProps {
  activeLogo: GeneratedLogo | null;
}

export const BrandMockups: React.FC<BrandMockupsProps> = ({ activeLogo }) => {
  const [selectedMockup, setSelectedMockup] = useState<
    'card' | 'app' | 'merch' | 'web' | 'signage'
  >('card');
  const [mockupTheme, setMockupTheme] = useState<'dark' | 'light'>('dark');

  if (!activeLogo) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <Layers className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100">No Logo Loaded Yet</h3>
        <p className="text-sm text-zinc-400">
          Design or upload your brand logo first to preview it on luxury business cards, app icons, and merch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar: Mockup Category Switcher & Theme */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
          {[
            { id: 'card', name: 'Business Card', icon: CreditCard },
            { id: 'app', name: 'Mobile App Icon', icon: Smartphone },
            { id: 'merch', name: 'Apparel Merch', icon: Shirt },
            { id: 'web', name: 'SaaS Header', icon: Monitor },
            { id: 'signage', name: 'Office Signage', icon: Building2 },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMockup(m.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedMockup === m.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Mockup Stage:</span>
          <div className="flex p-1 bg-zinc-950 rounded-lg border border-zinc-800">
            <button
              onClick={() => setMockupTheme('dark')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${
                mockupTheme === 'dark' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
              }`}
            >
              Obsidian Dark
            </button>
            <button
              onClick={() => setMockupTheme('light')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${
                mockupTheme === 'light' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
              }`}
            >
              Gallery White
            </button>
          </div>
        </div>
      </div>

      {/* MOCKUP SHOWCASE CANVAS */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-12 min-h-[500px] flex items-center justify-center backdrop-blur-sm overflow-hidden">
        {/* 1. BUSINESS CARD MOCKUP */}
        {selectedMockup === 'card' && (
          <div className="relative perspective-[1200px]">
            <div
              className={`w-80 sm:w-96 aspect-[1.75/1] rounded-2xl p-7 flex flex-col justify-between shadow-2xl transition-all transform rotate-y-[-10deg] rotate-x-[8deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] border ${
                mockupTheme === 'dark'
                  ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-zinc-700/60 shadow-black/80'
                  : 'bg-gradient-to-br from-white via-zinc-50 to-zinc-100 border-zinc-300 shadow-zinc-400/40 text-zinc-900'
              }`}
            >
              {/* Foil Stamp Effect on Logo */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-zinc-900/40 p-1 flex items-center justify-center">
                  <img
                    src={activeLogo.imageUrl}
                    alt={activeLogo.companyName}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                </div>
                <span
                  className={`text-[9px] font-mono tracking-widest uppercase opacity-60 ${
                    mockupTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  EST. 2026
                </span>
              </div>

              <div>
                <h4
                  className={`text-lg font-bold tracking-tight ${
                    mockupTheme === 'dark' ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {activeLogo.companyName}
                </h4>
                <p
                  className={`text-xs opacity-75 font-medium ${
                    mockupTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {activeLogo.industry}
                </p>
                <div className="mt-3 pt-3 border-t border-zinc-800/40 flex justify-between text-[10px] font-mono opacity-50">
                  <span>hello@{activeLogo.companyName.toLowerCase().replace(/\s+/g, '')}.io</span>
                  <span>SAN FRANCISCO • TOKYO</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MOBILE APP ICON MOCKUP */}
        {selectedMockup === 'app' && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[36px] bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 p-6 flex items-center justify-center shadow-2xl border border-zinc-700/60 group-hover:scale-105 transition-transform">
                <img
                  src={activeLogo.imageUrl}
                  alt={activeLogo.companyName}
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
              </div>
              {/* App notification badge */}
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                1
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-zinc-100">{activeLogo.companyName}</span>
              <p className="text-xs text-zinc-400 mt-0.5">iOS &amp; Android App Store Icon</p>
            </div>
          </div>
        )}

        {/* 3. APPAREL / MERCH MOCKUP */}
        {selectedMockup === 'merch' && (
          <div className="relative max-w-md w-full rounded-2xl bg-zinc-950 p-8 border border-zinc-800 text-center flex flex-col items-center justify-center">
            {/* Minimalist Hoodie Mockup Graphic */}
            <div className="relative w-64 h-64 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
              <div className="absolute inset-4 rounded-full border border-dashed border-zinc-800" />
              <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                <img
                  src={activeLogo.imageUrl}
                  alt={activeLogo.companyName}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Heavyweight Cotton Crewneck
              </span>
              <h5 className="text-sm font-bold text-zinc-200 mt-0.5">
                {activeLogo.companyName} Embroidered Emblem
              </h5>
            </div>
          </div>
        )}

        {/* 4. SAAS WEBSITE HERO HEADER */}
        {selectedMockup === 'web' && (
          <div className="w-full max-w-3xl rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="ml-4 px-3 py-1 rounded bg-zinc-950 text-[11px] font-mono text-zinc-400 border border-zinc-800/80">
                https://{activeLogo.companyName.toLowerCase().replace(/\s+/g, '')}.com
              </div>
            </div>

            {/* Navigation Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeLogo.imageUrl}
                  alt={activeLogo.companyName}
                  className="w-9 h-9 object-contain"
                />
                <span className="font-bold text-sm text-zinc-100">{activeLogo.companyName}</span>
              </div>
              <div className="hidden sm:flex items-center gap-5 text-xs text-zinc-400 font-medium">
                <span>Platform</span>
                <span>Solutions</span>
                <span>Developers</span>
                <span>Pricing</span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
                Get Started
              </button>
            </div>

            {/* Hero Body */}
            <div className="p-8 sm:p-12 text-center space-y-4 bg-gradient-to-b from-zinc-950 to-zinc-900">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Empowering Next-Gen {activeLogo.industry}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
                Built with precision engineering, intelligent automation, and unforgettable identity.
              </p>
            </div>
          </div>
        )}

        {/* 5. OFFICE GLASS SIGNAGE */}
        {selectedMockup === 'signage' && (
          <div className="relative max-w-lg w-full aspect-video rounded-2xl bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950 border border-zinc-800 flex items-center justify-center p-8">
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center space-y-3 max-w-xs text-center">
              <img
                src={activeLogo.imageUrl}
                alt={activeLogo.companyName}
                className="w-20 h-20 object-contain drop-shadow-xl"
              />
              <span className="text-lg font-bold text-white tracking-wider uppercase">
                {activeLogo.companyName}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                HEADQUARTERS • FLOOR 42
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
