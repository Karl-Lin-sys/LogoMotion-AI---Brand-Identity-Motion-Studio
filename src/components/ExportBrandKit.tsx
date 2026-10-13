import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Palette,
  FileCode,
  Film,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { GeneratedLogo, VideoJob } from '../types';

interface ExportBrandKitProps {
  activeLogo: GeneratedLogo | null;
  videoJob: VideoJob | null;
  onProceedToVeo: () => void;
}

export const ExportBrandKit: React.FC<ExportBrandKitProps> = ({
  activeLogo,
  videoJob,
  onProceedToVeo,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedSvg, setCopiedSvg] = useState(false);

  // Default cohesive brand swatches derived from style & selection
  const swatches = [
    { name: 'Brand Primary', hex: '#00F2FE' },
    { name: 'Secondary Accent', hex: '#6366F1' },
    { name: 'Obsidian Canvas', hex: '#09090B' },
    { name: 'Pure Contrast', hex: '#FAFAFA' },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopySvgWrapper = () => {
    if (!activeLogo) return;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <title>${activeLogo.companyName} Brand Mark</title>
  <image href="${activeLogo.imageUrl}" width="1024" height="1024" />
</svg>`;
    navigator.clipboard.writeText(svgContent);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  if (!activeLogo) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <Palette className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100">No Brand Assets to Export</h3>
        <p className="text-sm text-zinc-400">
          Generate or upload a logo first to access the high-resolution master files and brand kit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-base font-bold text-zinc-100">
              {activeLogo.companyName} — Official Brand Identity Package
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Export production-ready vector masters, {activeLogo.imageSize} high-resolution PNGs, and Veo MP4 animations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={activeLogo.imageUrl}
            download={`${activeLogo.companyName.toLowerCase().replace(/\s+/g, '-')}-${activeLogo.imageSize}-master.png`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Master PNG ({activeLogo.imageSize})</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Brand Swatches */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span>Color System</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-400">HEX / RGB</span>
          </div>

          <div className="space-y-2.5">
            {swatches.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg border border-zinc-700 shadow-sm"
                    style={{ backgroundColor: s.hex }}
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">{s.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{s.hex}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyHex(s.hex)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === s.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Format Exports */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>File Deliverables</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-400">Direct Assets</span>
          </div>

          <div className="space-y-2.5">
            {/* PNG Master */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Raster Master PNG</span>
                <span className="text-[10px] text-zinc-400">{activeLogo.imageSize} Resolution</span>
              </div>
              <a
                href={activeLogo.imageUrl}
                download={`${activeLogo.companyName.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
              >
                Save
              </a>
            </div>

            {/* SVG Wrapper */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-200 block">SVG Container</span>
                <span className="text-[10px] text-zinc-400">Scalable vector markup</span>
              </div>
              <button
                onClick={handleCopySvgWrapper}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                {copiedSvg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSvg ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Veo Video */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Veo Video (.mp4)</span>
                <span className="text-[10px] text-zinc-400">
                  {videoJob?.videoUrl ? `${videoJob.aspectRatio} Render` : 'Not rendered yet'}
                </span>
              </div>
              {videoJob?.videoUrl ? (
                <a
                  href={videoJob.videoUrl}
                  download={`${activeLogo.companyName.toLowerCase().replace(/\s+/g, '-')}-animation.mp4`}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white transition-colors"
                >
                  Download
                </a>
              ) : (
                <button
                  onClick={onProceedToVeo}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Brand Guidelines */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Usage Guidelines</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-400">Rules</span>
          </div>

          <div className="space-y-3 text-xs text-zinc-300">
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block mb-0.5">Clear Space</span>
              <p className="text-[11px] text-zinc-400">
                Maintain minimum padding equal to 20% of the emblem width around all perimeter borders.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block mb-0.5">Contrast Rule</span>
              <p className="text-[11px] text-zinc-400">
                Always ensure sufficient contrast against dark obsidian or light snow background surfaces.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block mb-0.5">Motion Integrity</span>
              <p className="text-[11px] text-zinc-400">
                Use the Veo animated video for digital intros, video cards, presentations, and product splash screens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
