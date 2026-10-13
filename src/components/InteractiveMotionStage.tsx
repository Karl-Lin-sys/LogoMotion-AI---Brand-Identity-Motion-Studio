import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Zap,
  Sliders,
  Maximize2,
  RefreshCw,
  Sun,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';
import { GeneratedLogo } from '../types';

interface InteractiveMotionStageProps {
  activeLogo: GeneratedLogo | null;
  onProceedToVeo: () => void;
}

export const InteractiveMotionStage: React.FC<InteractiveMotionStageProps> = ({
  activeLogo,
  onProceedToVeo,
}) => {
  const [animationType, setAnimationType] = useState<
    'spin' | 'pulse' | 'float' | 'shine' | 'glitch' | 'particles'
  >('spin');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(0.8);
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
    setTiltAngle({ x, y });
  };

  const handleMouseLeave = () => {
    setTiltAngle({ x: 0, y: 0 });
  };

  // Canvas particle simulation for 'particles' mode
  useEffect(() => {
    if (animationType !== 'particles' || !isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }[] = [];

    const colors = ['#00F2FE', '#4FACFE', '#7F00FF', '#FF007F', '#F09819'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 120,
        y: height / 2 + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 1.5 * speed,
        vy: (Math.random() - 0.5) * 1.5 * speed,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Orbit towards center
        const dx = width / 2 - p.x;
        const dy = height / 2 - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.vx += (dx / dist) * 0.05 * speed;
        p.vy += (dy / dist) * 0.05 * speed;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10 * glowIntensity;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationType, isPlaying, speed, glowIntensity]);

  if (!activeLogo) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
          <Play className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100">Please Generate or Upload a Logo</h3>
        <p className="text-sm text-zinc-400">
          Create a logo first to test real-time physics, continuous rotation, and chromatic effects.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Motion Controls (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Motion Engines</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              GPU Accelerated CSS
            </span>
          </div>

          {/* Animation Presets */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                id: 'spin',
                name: '3D Turntable Spin',
                desc: 'Continuous 360° axial rotation',
                icon: RotateCw,
              },
              {
                id: 'pulse',
                name: 'Breathing Radiance',
                desc: 'Rhythmic scale & neon glow',
                icon: Activity,
              },
              {
                id: 'float',
                name: 'Zero-G Hover',
                desc: 'Smooth floating inertia',
                icon: Sparkles,
              },
              {
                id: 'shine',
                name: 'Metallic Sheen',
                desc: 'Specular glare light sweep',
                icon: Sun,
              },
              {
                id: 'glitch',
                name: 'Cyber Glitch',
                desc: 'Digital displacement twitch',
                icon: Zap,
              },
              {
                id: 'particles',
                name: 'Particle Swarm',
                desc: 'Interactive cosmic orbiters',
                icon: Flame,
              },
            ].map((anim) => {
              const Icon = anim.icon;
              return (
                <button
                  key={anim.id}
                  onClick={() => setAnimationType(anim.id as any)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    animationType === anim.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-100 shadow-md shadow-cyan-950/30'
                      : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-zinc-200">{anim.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 line-clamp-1">{anim.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Sliders for Speed & Intensity */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Motion Velocity</span>
                <span className="text-cyan-400 font-mono">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Glow &amp; Aura Intensity</span>
                <span className="text-cyan-400 font-mono">{Math.round(glowIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={onProceedToVeo}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>Synthesize with Veo AI Video Diffusion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Motion Stage Canvas (7 cols) */}
      <div className="lg:col-span-7 space-y-5">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm sticky top-24 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Interactive Kinetic Stage (Move mouse to tilt)
              </h3>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700/60"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'Freeze' : 'Play'}</span>
            </button>
          </div>

          {/* Kinetic Stage Box */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-center cursor-grab active:cursor-grabbing p-12 perspective-[1000px]"
          >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Particle Canvas */}
            {animationType === 'particles' && (
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            )}

            {/* Kinetic Animated Logo Wrapper */}
            <div
              style={{
                transform: `rotateY(${tiltAngle.x}deg) rotateX(${tiltAngle.y}deg)`,
                transition: 'transform 0.1s ease-out',
                filter:
                  animationType === 'glitch' && isPlaying
                    ? 'drop-shadow(3px 0px 0px rgba(255,0,128,0.7)) drop-shadow(-3px 0px 0px rgba(0,255,255,0.7))'
                    : `drop-shadow(0px 10px 25px rgba(6,182,212,${glowIntensity * 0.4}))`,
              }}
              className="relative z-10 flex items-center justify-center max-w-[280px] max-h-[280px]"
            >
              {/* Shine Sweep Overlay */}
              {animationType === 'shine' && isPlaying && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none -skew-x-12 animate-[shimmer_2s_infinite]"
                  style={{
                    animationDuration: `${2 / speed}s`,
                  }}
                />
              )}

              <img
                src={activeLogo.imageUrl}
                alt={activeLogo.companyName}
                style={{
                  animation:
                    !isPlaying
                      ? 'none'
                      : animationType === 'spin'
                      ? `spin ${8 / speed}s linear infinite`
                      : animationType === 'pulse'
                      ? `pulse ${2 / speed}s ease-in-out infinite`
                      : animationType === 'float'
                      ? `bounce ${3 / speed}s ease-in-out infinite`
                      : animationType === 'glitch'
                      ? `glitch ${0.4 / speed}s infinite alternate`
                      : 'none',
                }}
                className="max-w-full max-h-full object-contain select-none pointer-events-none drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Stage Physics: Active CSS3 Matrix Transforms</span>
            <span className="font-mono text-zinc-300">{activeLogo.companyName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
