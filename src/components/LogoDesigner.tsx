import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Wand2,
  Upload,
  ArrowRight,
  Layers,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Film,
  Download,
  Play,
  Sliders,
  Maximize2,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { GeneratedLogo, ImageSize, LogoAspectRatio } from '../types';
import { STYLE_OPTIONS, COLOR_PALETTES, BRAND_INSPIRATIONS } from '../constants/presets';

interface LogoDesignerProps {
  activeLogo: GeneratedLogo | null;
  setActiveLogo: (logo: GeneratedLogo) => void;
  onProceedToVeo: () => void;
  onProceedToMotion: () => void;
  onSelectInspiration: (concept: (typeof BRAND_INSPIRATIONS)[0]) => void;
}

export const LogoDesigner: React.FC<LogoDesignerProps> = ({
  activeLogo,
  setActiveLogo,
  onProceedToVeo,
  onProceedToMotion,
}) => {
  // Input states
  const [mode, setMode] = useState<'generate' | 'upload'>('generate');
  const [companyName, setCompanyName] = useState('Aura Quantum');
  const [industry, setIndustry] = useState('Artificial Intelligence & Neural Compute');
  const [description, setDescription] = useState(
    'An abstract hypercube with an intersecting luminous neural node, sharp geometric symmetry, clean negative space, iconic emblem'
  );
  const [selectedStyle, setSelectedStyle] = useState('Minimalist Vector');
  const [selectedColors, setSelectedColors] = useState('Electric Cyber');
  const [customColors, setCustomColors] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [aspectRatio, setAspectRatio] = useState<LogoAspectRatio>('1:1');

  // Preview options
  const [previewBg, setPreviewBg] = useState<'dark' | 'light' | 'checker' | 'gradient'>('dark');

  // Loading & status states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick concept suggestion chips
  const quickIdeas = [
    'Intersecting geometric monograms with clean lines',
    'Futuristic origami cyber-bird in forward flight',
    'Minimalist optical illusion triangle with neon core',
    'Luxurious gold crest with fine architectural linework',
    'Modern bio-tech organic leaf merged with circuit nodes',
  ];

  // AI Prompt Enhance
  const handleEnhancePrompt = async () => {
    if (!description && !companyName) return;
    setIsEnhancing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          description,
          industry,
          style: selectedStyle,
          colors: customColors || selectedColors,
        }),
      });
      const data = await res.json();
      if (res.ok && data.enhancedPrompt) {
        setDescription(data.enhancedPrompt);
      } else {
        setErrorMessage(data.error || 'Failed to enhance prompt.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with enhance service.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Logo with Gemini 3 Pro Image
  const handleGenerateLogo = async () => {
    if (!description.trim() && !companyName.trim()) {
      setErrorMessage('Please provide a company name or logo description.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          prompt: description,
          industry,
          style: selectedStyle,
          colors: customColors || selectedColors,
          imageSize,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate logo.');
      }

      const newLogo: GeneratedLogo = {
        id: `logo-${Date.now()}`,
        companyName: companyName || 'Custom Brand',
        industry,
        description,
        style: selectedStyle,
        colors: customColors || selectedColors,
        imageUrl: data.imageUrl,
        imageSize: data.imageSize || imageSize,
        aspectRatio: data.aspectRatio || aspectRatio,
        createdAt: Date.now(),
        promptUsed: data.promptUsed,
        isUploaded: false,
      };

      setActiveLogo(newLogo);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred while generating logo.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, SVG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const uploadedLogo: GeneratedLogo = {
        id: `upload-${Date.now()}`,
        companyName: file.name.replace(/\.[^/.]+$/, ''),
        industry: 'Uploaded Asset',
        description: 'Uploaded user image for animation',
        style: 'Original Artwork',
        colors: 'Original Palette',
        imageUrl: result,
        imageSize: '1K',
        aspectRatio: '1:1',
        createdAt: Date.now(),
        isUploaded: true,
      };
      setActiveLogo(uploadedLogo);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Controls & Creator Forms (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Creation Mode Switcher: AI Generation vs Photo Upload */}
        <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              mode === 'generate'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate Logo with Gemini 3 Pro</span>
          </button>

          <button
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              mode === 'upload'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Existing Photo / Logo</span>
          </button>
        </div>

        {/* AI GENERATOR PANEL */}
        {mode === 'generate' ? (
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5 backdrop-blur-sm">
            {/* Model Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-medium text-zinc-300">
                  Model: <span className="text-indigo-400 font-semibold">gemini-3-pro-image-preview</span>
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/50">
                Studio Quality Vector Synthesis
              </span>
            </div>

            {/* Company & Industry Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., NovaWave, Apex Dynamics"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Industry / Field
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Aerospace, Luxury Fashion, SaaS"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Description & Prompt Details */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Visual Concept &amp; Description
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || (!description && !companyName)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50 font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Enhancing with AI...' : 'AI Enhance Prompt'}</span>
                </button>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe shapes, symbols, motifs, mood, negative space or metaphors..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
              />

              {/* Quick suggestion chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-zinc-400 flex items-center mr-1">Quick ideas:</span>
                {quickIdeas.slice(0, 3).map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescription(idea)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-700/50 transition-colors truncate max-w-xs"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector Grid */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Aesthetic Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.name)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                      selectedStyle === style.name
                        ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/50'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-200">{style.name}</span>
                      {selectedStyle === style.name && (
                        <Check className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 line-clamp-1">{style.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Color Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => {
                      setSelectedColors(pal.name);
                      setCustomColors('');
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      selectedColors === pal.name && !customColors
                        ? 'bg-zinc-800 border-indigo-500/80'
                        : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-medium text-zinc-300">{pal.name}</span>
                    <div className="flex items-center -space-x-1.5">
                      {pal.colors.map((c, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-zinc-900 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* MANDATORY AFFORDANCES: IMAGE SIZE (1K, 2K, 4K) & ASPECT RATIO */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4">
              {/* Image Size Selection (1K, 2K, 4K) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                      Image Resolution Affordance
                    </label>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                      Required
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">gemini-3-pro-image-preview</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`relative flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border text-center transition-all ${
                        imageSize === size
                          ? 'bg-gradient-to-b from-indigo-900/60 to-zinc-900 border-indigo-500 text-white shadow-md shadow-indigo-950/50'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold tracking-tight">{size}</span>
                        {imageSize === size && (
                          <Check className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5">
                        {size === '1K' && '1024 × 1024 (Standard)'}
                        {size === '2K' && '2048 × 2048 (Crisp HD)'}
                        {size === '4K' && '4096 × 4096 (Ultra Master)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="pt-2 border-t border-zinc-800/80">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Canvas Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: '1:1', label: '1:1 Square (Emblem)' },
                      { id: '16:9', label: '16:9 Banner' },
                      { id: '4:3', label: '4:3 Classic' },
                      { id: '9:16', label: '9:16 Vertical' },
                    ] as { id: LogoAspectRatio; label: string }[]
                  ).map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setAspectRatio(ratio.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        aspectRatio === ratio.id
                          ? 'bg-zinc-800 border-indigo-500 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {ratio.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Primary Generate Button */}
            <button
              type="button"
              onClick={handleGenerateLogo}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing High-Resolution Logo ({imageSize})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Generate Logo ({imageSize} Resolution)</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* UPLOAD EXISTING PHOTO / LOGO PANEL */
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
            <div className="border-b border-zinc-800/80 pb-3">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload a Photo or Logo to Animate with Veo</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Have an existing brand mark, mascot, or company graphic? Upload it here to transform it into a cinematic animated video.
              </p>
            </div>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-cyan-500/80 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-zinc-950/40 hover:bg-zinc-950/70 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800/80 group-hover:bg-cyan-950/40 border border-zinc-700 group-hover:border-cyan-500/40 flex items-center justify-center transition-all mb-4">
                <Upload className="w-7 h-7 text-zinc-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-zinc-200 group-hover:text-cyan-300">
                Click to browse or drag &amp; drop your logo/photo
              </h4>
              <p className="text-xs text-zinc-400 mt-1.5 max-w-sm mx-auto">
                Supports high-res PNG, JPG, WEBP, and SVG. Transparent or solid background recommended for best motion physics.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Active Logo Canvas & Transition Actions (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm sticky top-24 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Current Brand Mark Canvas
              </h3>
            </div>

            {/* Background Selector */}
            <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setPreviewBg('dark')}
                title="Dark Stage"
                className={`w-5 h-5 rounded bg-zinc-900 border ${
                  previewBg === 'dark' ? 'border-indigo-400' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => setPreviewBg('light')}
                title="Light Stage"
                className={`w-5 h-5 rounded bg-zinc-100 border ${
                  previewBg === 'light' ? 'border-indigo-400' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => setPreviewBg('checker')}
                title="Transparent Checkers"
                className={`w-5 h-5 rounded bg-[linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)] bg-[size:6px_6px] bg-zinc-900 border ${
                  previewBg === 'checker' ? 'border-indigo-400' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => setPreviewBg('gradient')}
                title="Studio Glow"
                className={`w-5 h-5 rounded bg-gradient-to-tr from-indigo-900 to-cyan-900 border ${
                  previewBg === 'gradient' ? 'border-indigo-400' : 'border-transparent'
                }`}
              />
            </div>
          </div>

          {/* Canvas Display */}
          <div
            className={`relative aspect-square w-full rounded-2xl overflow-hidden flex items-center justify-center p-6 border transition-all ${
              previewBg === 'dark'
                ? 'bg-zinc-950 border-zinc-800'
                : previewBg === 'light'
                ? 'bg-zinc-100 border-zinc-300'
                : previewBg === 'checker'
                ? 'bg-[linear-gradient(45deg,#18181b_25%,transparent_25%),linear-gradient(-45deg,#18181b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18181b_75%),linear-gradient(-45deg,transparent_75%,#18181b_75%)] bg-[size:16px_16px] bg-zinc-900 border-zinc-800'
                : 'bg-gradient-to-tr from-zinc-950 via-indigo-950 to-zinc-950 border-zinc-800'
            }`}
          >
            {activeLogo ? (
              <div className="relative group w-full h-full flex items-center justify-center">
                <img
                  src={activeLogo.imageUrl}
                  alt={activeLogo.companyName}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-900/90 text-zinc-200 border border-zinc-700 backdrop-blur-md">
                    {activeLogo.imageSize} • {activeLogo.aspectRatio}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ImageIcon className="w-6 h-6 text-zinc-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300">No Logo Loaded Yet</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Fill in the form on the left or click an inspiration below to design your company logo.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Logo Meta Details if available */}
          {activeLogo && (
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-sm">{activeLogo.companyName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {activeLogo.isUploaded ? 'Uploaded Photo' : activeLogo.style}
                </span>
              </div>
              <p className="text-zinc-400 line-clamp-2 text-[11px] leading-relaxed">
                {activeLogo.description}
              </p>
            </div>
          )}

          {/* NEXT STEP CTA BUTTONS */}
          {activeLogo ? (
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={onProceedToVeo}
                className="w-full flex items-center justify-between py-3.5 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>Animate with Veo Video Generations</span>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onProceedToMotion}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Live CSS Motion</span>
                </button>

                <a
                  href={activeLogo.imageUrl}
                  download={`${activeLogo.companyName.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PNG</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <p className="text-center text-[11px] text-zinc-400">
                Select an inspiration below to load immediate company presets
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
