import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Sparkles,
  Play,
  RotateCw,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Box,
  Zap,
  Flame,
  Eye,
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GeneratedLogo, VideoAspectRatio, VideoResolution, VideoJob } from '../types';
import { MOTION_PRESETS, REASSURING_MESSAGES } from '../constants/presets';

interface VeoAnimatorProps {
  activeLogo: GeneratedLogo | null;
  videoJob: VideoJob | null;
  setVideoJob: React.Dispatch<React.SetStateAction<VideoJob | null>>;
  onBackToDesign: () => void;
}

export const VeoAnimator: React.FC<VeoAnimatorProps> = ({
  activeLogo,
  videoJob,
  setVideoJob,
  onBackToDesign,
}) => {
  // Motion settings
  const [selectedPresetId, setSelectedPresetId] = useState(MOTION_PRESETS[0].id);
  const [customMotionPrompt, setCustomMotionPrompt] = useState(MOTION_PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
  const [resolution, setResolution] = useState<VideoResolution>('720p');

  // Loading animation state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // When preset changes, update prompt
  const handleSelectPreset = (preset: (typeof MOTION_PRESETS)[0]) => {
    setSelectedPresetId(preset.id);
    setCustomMotionPrompt(preset.prompt);
  };

  // Reassuring messages cycle and timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let msgTimer: NodeJS.Timeout;

    if (videoJob?.status === 'processing') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      msgTimer = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % REASSURING_MESSAGES.length);
      }, 4500);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, [videoJob?.status]);

  // Polling loop for Veo video operation
  useEffect(() => {
    if (!videoJob || videoJob.status !== 'processing') return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: videoJob.operationName }),
        });

        const data = await res.json();
        if (!isSubscribed) return;

        if (data.error) {
          setVideoJob((prev) =>
            prev ? { ...prev, status: 'failed', error: data.error.message || 'Generation failed' } : null
          );
          clearInterval(interval);
          return;
        }

        if (data.done) {
          // Video generation is finished! Fetch video stream
          const videoDownloadUrl = `/api/video-download?operationName=${encodeURIComponent(
            videoJob.operationName
          )}`;

          // Test downloading the video blob to verify completion and get object URL
          const downloadRes = await fetch(videoDownloadUrl);
          if (downloadRes.ok) {
            const blob = await downloadRes.blob();
            const localVideoUrl = URL.createObjectURL(blob);
            setVideoJob((prev) =>
              prev ? { ...prev, status: 'completed', videoUrl: localVideoUrl } : null
            );
          } else {
            // Fallback to direct url
            setVideoJob((prev) =>
              prev ? { ...prev, status: 'completed', videoUrl: videoDownloadUrl } : null
            );
          }
          clearInterval(interval);
        }
      } catch (err: any) {
        console.error('Polling error:', err);
      }
    }, 4500);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [videoJob?.operationName, videoJob?.status, setVideoJob]);

  // Start Veo generation
  const handleStartAnimation = async () => {
    if (!activeLogo) return;

    const newJob: VideoJob = {
      operationName: '',
      status: 'processing',
      aspectRatio,
      resolution,
      prompt: customMotionPrompt,
      startedAt: Date.now(),
    };
    setVideoJob(newJob);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeLogo.imageUrl,
          prompt: customMotionPrompt,
          aspectRatio,
          resolution,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.operationName) {
        throw new Error(data.error || 'Failed to start video generation.');
      }

      setVideoJob((prev) =>
        prev ? { ...prev, operationName: data.operationName, status: 'processing' } : null
      );
    } catch (err: any) {
      console.error(err);
      setVideoJob((prev) =>
        prev ? { ...prev, status: 'failed', error: err.message || 'Failed to trigger Veo' } : null
      );
    }
  };

  // Icon selector helper
  const renderPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'RotateCw':
        return <RotateCw className="w-4 h-4 text-cyan-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Box':
        return <Box className="w-4 h-4 text-indigo-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-fuchsia-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <Eye className="w-4 h-4 text-emerald-400" />;
    }
  };

  if (!activeLogo) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <Film className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-100">No Logo Loaded Yet</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-md mx-auto">
            Design a custom company logo or upload an existing image to animate it using Veo video generations.
          </p>
        </div>
        <button
          onClick={onBackToDesign}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Logo Designer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Motion Style & Configuration (6 cols) */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5 backdrop-blur-sm">
          {/* Header & Model Spec */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-zinc-300">
                Model: <span className="text-cyan-400 font-semibold">veo-3.1-fast-generate-preview</span>
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/50">
              AI Temporal Video Diffusion
            </span>
          </div>

          {/* Source Logo Preview Snippet */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <img
              src={activeLogo.imageUrl}
              alt="Source Logo"
              className="w-12 h-12 object-contain rounded-lg bg-zinc-900 p-1 border border-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-zinc-200 truncate block">
                {activeLogo.companyName}
              </span>
              <span className="text-[11px] text-zinc-400 truncate block">
                {activeLogo.isUploaded ? 'Uploaded Artwork' : activeLogo.style} • {activeLogo.imageSize}
              </span>
            </div>
            <button
              onClick={onBackToDesign}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-800/40 transition-colors"
            >
              Change
            </button>
          </div>

          {/* MOTION PRESETS */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              Select Motion Style Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MOTION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-gradient-to-br from-indigo-950/70 to-purple-950/40 border-cyan-500 shadow-md shadow-cyan-950/30'
                      : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-zinc-900 border border-zinc-800">
                        {renderPresetIcon(preset.iconName)}
                      </div>
                      <span className="text-xs font-bold text-zinc-200">{preset.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/40">
                      {preset.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Details / Custom Prompt */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Custom Cinematic Motion Prompt
            </label>
            <textarea
              value={customMotionPrompt}
              onChange={(e) => setCustomMotionPrompt(e.target.value)}
              rows={3}
              placeholder="Describe camera movement, lighting reflections, trajectory, and particles..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none leading-relaxed font-mono"
            />
          </div>

          {/* MANDATORY ASPECT RATIO (16:9 or 9:16) & RESOLUTION */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                  Video Aspect Ratio (Required: 16:9 or 9:16)
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  Veo Spec
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-100 shadow-md shadow-cyan-950/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-10 h-6 border-2 border-current rounded-sm mb-1.5 opacity-80" />
                  <span className="text-xs font-bold">16:9 Landscape</span>
                  <span className="text-[10px] text-zinc-400">YouTube, Presentations, TV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-100 shadow-md shadow-cyan-950/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-6 h-10 border-2 border-current rounded-sm mb-1.5 opacity-80" />
                  <span className="text-xs font-bold">9:16 Portrait</span>
                  <span className="text-[10px] text-zinc-400">Reels, TikTok, Stories, Shorts</span>
                </button>
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Output Resolution
              </span>
              <div className="flex gap-2">
                {(['720p', '1080p'] as VideoResolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      resolution === res
                        ? 'bg-zinc-800 border-cyan-500 text-zinc-100'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {videoJob?.error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Generation Encountered an Issue</span>
                {videoJob.error}
              </div>
            </div>
          )}

          {/* Trigger Generate Button */}
          <button
            type="button"
            onClick={handleStartAnimation}
            disabled={videoJob?.status === 'processing'}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] cursor-pointer"
          >
            {videoJob?.status === 'processing' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating Video with Veo ({aspectRatio})...</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4 text-cyan-200" />
                <span>Generate Animated Video with Veo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Video Player & Reassuring Loading Experience (6 cols) */}
      <div className="lg:col-span-6 space-y-5">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm sticky top-24 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Veo Animation Studio Player
              </h3>
            </div>
            {videoJob?.status === 'completed' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Render Complete</span>
              </span>
            )}
          </div>

          {/* VIDEO STAGE CONTAINER */}
          <div
            className={`relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto transition-all ${
              aspectRatio === '9:16'
                ? 'aspect-[9/16] max-h-[580px] w-auto max-w-[340px]'
                : 'aspect-video w-full'
            }`}
          >
            {/* 1. COMPLETED VIDEO PLAYER */}
            {videoJob?.status === 'completed' && videoJob.videoUrl ? (
              <div className="relative w-full h-full group bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoJob.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-contain"
                />

                {/* Overlay controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg bg-zinc-900/80 backdrop-blur-md text-zinc-200 border border-zinc-700/60 hover:bg-zinc-800 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <a
                    href={videoJob.videoUrl}
                    download={`${activeLogo.companyName.toLowerCase().replace(/\s+/g, '-')}-veo-animation.mp4`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white text-xs font-medium backdrop-blur-md shadow-lg shadow-cyan-600/30 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save MP4</span>
                  </a>
                </div>
              </div>
            ) : videoJob?.status === 'processing' ? (
              /* 2. REASSURING LOADING SCREEN WITH DYNAMIC STATUS */
              <div className="p-8 text-center space-y-6 max-w-sm">
                <div className="relative w-20 h-20 mx-auto">
                  {/* Outer pulse */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-indigo-500 border-b-purple-500 border-l-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center shadow-inner">
                    <Film className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-zinc-100 tracking-tight">
                    Veo Diffusion in Progress
                  </h4>
                  <div className="min-h-[40px] flex items-center justify-center">
                    <p className="text-xs text-cyan-300 font-medium animate-fade-in transition-all">
                      {REASSURING_MESSAGES[messageIndex]}
                    </p>
                  </div>
                </div>

                {/* Progress metadata */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Elapsed: {elapsedSeconds}s</span>
                  </div>
                  <span>{aspectRatio} • {resolution}</span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                  Veo synthesizes lighting, physics, and vector depth for cinematic quality. This usually takes ~60-90 seconds.
                </p>
              </div>
            ) : (
              /* 3. READY STATE: SOURCE IMAGE WITH PROMPT TO ANIMATE */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <img
                  src={activeLogo.imageUrl}
                  alt={activeLogo.companyName}
                  className="max-h-48 max-w-48 object-contain mb-4 drop-shadow-xl opacity-80"
                />
                <div className="max-w-xs space-y-1.5">
                  <h4 className="text-sm font-bold text-zinc-200">Ready for Veo Video Generation</h4>
                  <p className="text-xs text-zinc-400">
                    Pick a motion style on the left and click "Generate Animated Video with Veo" to start.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {videoJob?.status === 'completed' && videoJob.videoUrl && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">
                    {activeLogo.companyName} Animated Logo
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {videoJob.aspectRatio} format • Veo 3.1 Fast Preview
                  </span>
                </div>
                <a
                  href={videoJob.videoUrl}
                  download={`${activeLogo.companyName.toLowerCase().replace(/\s+/g, '-')}-animated-logo.mp4`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
