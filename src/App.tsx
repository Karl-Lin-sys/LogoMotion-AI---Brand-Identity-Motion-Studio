import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LogoDesigner } from './components/LogoDesigner';
import { VeoAnimator } from './components/VeoAnimator';
import { InteractiveMotionStage } from './components/InteractiveMotionStage';
import { BrandMockups } from './components/BrandMockups';
import { ExportBrandKit } from './components/ExportBrandKit';
import { InspirationsModal } from './components/InspirationsModal';
import { LogoHistory } from './components/LogoHistory';
import { GeneratedLogo, VideoJob, BrandConceptPreset } from './types';
import { BRAND_INSPIRATIONS } from './constants/presets';
import { Sparkles, Film, ArrowRight, Wand2, Shield, Eye, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'design' | 'veo' | 'motion' | 'mockups' | 'export'>('design');
  const [activeLogo, setActiveLogo] = useState<GeneratedLogo | null>(null);
  const [videoJob, setVideoJob] = useState<VideoJob | null>(null);
  const [history, setHistory] = useState<GeneratedLogo[]>([]);
  const [isInspirationsOpen, setIsInspirationsOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('logomotion_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setActiveLogo(parsed[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Update active logo and persist to history
  const handleSetActiveLogo = (logo: GeneratedLogo) => {
    setActiveLogo(logo);
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== logo.id);
      const updated = [logo, ...filtered].slice(0, 12);
      try {
        localStorage.setItem('logomotion_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage limit reached, saving partial:', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('logomotion_history');
    } catch (e) {}
  };

  const handleSelectInspiration = (concept: BrandConceptPreset) => {
    // When concept selected, jump to design tab and prefill
    setActiveTab('design');
  };

  const handleReset = () => {
    setActiveLogo(null);
    setVideoJob(null);
    setActiveTab('design');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Studio Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveLogo={Boolean(activeLogo)}
        hasGeneratedVideo={Boolean(videoJob?.videoUrl)}
        onOpenInspirations={() => setIsInspirationsOpen(true)}
        onReset={handleReset}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Session History Carousel if logos exist */}
        <LogoHistory
          history={history}
          activeLogoId={activeLogo?.id || null}
          onSelectLogo={(logo) => setActiveLogo(logo)}
          onClearHistory={handleClearHistory}
        />

        {/* Tab 1: Logo Designer & Photo Upload */}
        {activeTab === 'design' && (
          <LogoDesigner
            activeLogo={activeLogo}
            setActiveLogo={handleSetActiveLogo}
            onProceedToVeo={() => setActiveTab('veo')}
            onProceedToMotion={() => setActiveTab('motion')}
            onSelectInspiration={handleSelectInspiration}
          />
        )}

        {/* Tab 2: Veo Video Animation Studio */}
        {activeTab === 'veo' && (
          <VeoAnimator
            activeLogo={activeLogo}
            videoJob={videoJob}
            setVideoJob={setVideoJob}
            onBackToDesign={() => setActiveTab('design')}
          />
        )}

        {/* Tab 3: Interactive Live Motion Stage */}
        {activeTab === 'motion' && (
          <InteractiveMotionStage
            activeLogo={activeLogo}
            onProceedToVeo={() => setActiveTab('veo')}
          />
        )}

        {/* Tab 4: Brand Mockups Showcase */}
        {activeTab === 'mockups' && <BrandMockups activeLogo={activeLogo} />}

        {/* Tab 5: Export & Brand Identity Kit */}
        {activeTab === 'export' && (
          <ExportBrandKit
            activeLogo={activeLogo}
            videoJob={videoJob}
            onProceedToVeo={() => setActiveTab('veo')}
          />
        )}
      </main>

      {/* Footer info & Model specifications */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-400">LogoMotion AI Studio</span>
            <span>•</span>
            <span className="font-mono text-zinc-400">
              gemini-3-pro-image-preview (1K/2K/4K) + veo-3.1-fast-generate-preview (16:9/9:16)
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>Server-side GenAI Orchestration</span>
            <span>•</span>
            <span>High-Fidelity Temporal Diffusion</span>
          </div>
        </div>
      </footer>

      {/* Inspirations Modal */}
      <InspirationsModal
        isOpen={isInspirationsOpen}
        onClose={() => setIsInspirationsOpen(false)}
        onSelectConcept={handleSelectInspiration}
      />
    </div>
  );
}
