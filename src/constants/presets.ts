import { BrandConceptPreset, MotionPreset, StyleOption } from '../types';

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'minimalist-vector',
    name: 'Minimalist Vector',
    description: 'Clean geometry, strong negative space, Swiss design clarity',
    badge: 'Popular',
    iconName: 'Shapes',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Futuristic Cyberpunk',
    description: 'Glowing laser lines, electric neon gradient, cyber aesthetics',
    badge: 'Tech',
    iconName: 'Zap',
  },
  {
    id: 'luxury-monogram',
    name: 'Luxury Monogram',
    description: 'Refined serif interlocks, haute couture elegance, metallic sheen',
    badge: 'Premium',
    iconName: 'Crown',
  },
  {
    id: '3d-glassmorphism',
    name: '3D Glassmorphism',
    description: 'Frosted acrylic depth, glossy refractions, soft ambient occlusion',
    badge: 'Modern',
    iconName: 'Layers',
  },
  {
    id: 'vintage-badge',
    name: 'Heritage Emblem',
    description: 'Artisanal hand-crafted linework, rugged vintage typography & stamp',
    badge: 'Classic',
    iconName: 'Award',
  },
  {
    id: 'abstract-kinetic',
    name: 'Kinetic Dynamic',
    description: 'Fluid aerodynamic vectors, momentum swooshes, bold energy',
    badge: 'Active',
    iconName: 'Activity',
  },
];

export const COLOR_PALETTES = [
  {
    id: 'electric-cyber',
    name: 'Electric Cyber',
    colors: ['#00F2FE', '#4FACFE', '#7F00FF'],
    label: 'Cyan & Violet',
  },
  {
    id: 'champagne-gold',
    name: 'Imperial Gold',
    colors: ['#D4AF37', '#F3E5AB', '#1A1A1A'],
    label: 'Champagne & Obsidian',
  },
  {
    id: 'emerald-botanic',
    name: 'Emerald Botanic',
    colors: ['#059669', '#10B981', '#064E3B'],
    label: 'Deep Jade & Emerald',
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    colors: ['#FF512F', '#F09819', '#700B97'],
    label: 'Crimson & Tangerine',
  },
  {
    id: 'monochrome-pro',
    name: 'Monochrome Pro',
    colors: ['#000000', '#71717A', '#FFFFFF'],
    label: 'Pure Obsidian & Snow',
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo Neon',
    colors: ['#FF007F', '#00F0FF', '#FFE600'],
    label: 'Hot Magenta & Aqua',
  },
];

export const MOTION_PRESETS: MotionPreset[] = [
  {
    id: 'cinematic-3d-spin',
    name: 'Cinematic 3D Spin',
    description: 'Smooth 360-degree orbital rotation with dramatic volumetric light shafts',
    prompt: 'Cinematic studio 3D rotation of the logo, glossy reflections, dramatic spotlight sweeping across the metallic surfaces, smooth 60fps camera orbital track, dark atmospheric background with subtle floating dust particles',
    iconName: 'RotateCw',
    tag: 'Flagship',
  },
  {
    id: 'liquid-neon-surge',
    name: 'Liquid Neon Surge',
    description: 'Glowing energy pulses surging along the contours before blooming into light',
    prompt: 'Futuristic energy reveal animation of the logo, bright neon electrical currents tracing the outer vector paths, glowing cyan and magenta light arcs surging into a brilliant power surge reveal, dark tech backdrop',
    iconName: 'Zap',
    tag: 'Futuristic',
  },
  {
    id: 'vector-unfold-assemble',
    name: 'Vector Unfold & Assemble',
    description: 'Geometric pieces glide into position like mechanical origami with soft shadows',
    prompt: 'Precision geometric logo assembly animation, clean vector facets sliding seamlessly into place from depth, smooth kinetic typography reveal, soft ambient studio lighting, sophisticated broadcast intro',
    iconName: 'Box',
    tag: 'Clean',
  },
  {
    id: 'particle-emitter-bloom',
    name: 'Holographic Particle Bloom',
    description: 'Logo coalesces from shimmering gold and iridescent cosmic stardust',
    prompt: 'High-end holographic logo formation, thousands of shimmering luminous micro-particles coalescing together into the crisp logo emblem, subtle chromatic shimmer, cinematic slow motion reveal with soft glow',
    iconName: 'Sparkles',
    tag: 'Ethereal',
  },
  {
    id: 'brand-stinger-impact',
    name: 'Dynamic Sonic Stinger',
    description: 'High-impact speed zoom with subtle shockwave and sharp snap into focus',
    prompt: 'High impact cinematic brand stinger, camera rushes forward at warp speed stopping abruptly with an optical lens flare and subtle kinetic shockwave rippling outwards as the logo snaps into pristine focus',
    iconName: 'Flame',
    tag: 'Punchy',
  },
  {
    id: 'breathing-ambient-pulse',
    name: 'Ambient Glass Float',
    description: 'Weightless hovering with gentle prismatic light refraction and breathing pulse',
    prompt: 'Elegantly floating 3D logo hovering in zero gravity, subtle organic breathing bob motion, prismatic caustic light rays passing through translucent glass bevels, clean minimalist premium design studio atmosphere',
    iconName: 'Eye',
    tag: 'Subtle',
  },
];

export const BRAND_INSPIRATIONS: BrandConceptPreset[] = [
  {
    name: 'Aura Quantum',
    industry: 'Artificial Intelligence & Neural Compute',
    description: 'An abstract hypercube with an intersecting luminous neural node, geometric symmetry, clean negative space',
    style: 'Modern Minimalist',
    colors: 'Electric Cyber (Cyan & Violet)',
  },
  {
    name: 'Velox Kinetic',
    industry: 'Electric Performance Hypercars',
    description: 'Aerodynamic falcon wing silhouette transitioning into lightning velocity blades, sleek forward momentum',
    style: 'Kinetic Dynamic',
    colors: 'Sunset Amber (Crimson & Tangerine)',
  },
  {
    name: 'Atelier Noir',
    industry: 'Haute Horlogerie & Luxury Goods',
    description: 'Interlocking monogram initials A and N with micro-faceted crown motif, delicate serif curves, architectural precision',
    style: 'Luxury Monogram',
    colors: 'Imperial Gold (Champagne & Obsidian)',
  },
  {
    name: 'Verdant Roastery',
    industry: 'Artisanal Organic Coffee',
    description: 'Stylized coffee cherry and botanic leaf nestled inside an antique circular sunburst seal, clean hand-crafted linework',
    style: 'Heritage Emblem',
    colors: 'Emerald Botanic (Deep Jade & Emerald)',
  },
  {
    name: 'Nexus Cloud',
    industry: 'Enterprise Data Platform',
    description: 'Interconnected isometric 3D crystal prisms creating an infinity loop, floating in space with glossy refractions',
    style: '3D Glassmorphism',
    colors: 'Tokyo Neon (Hot Magenta & Aqua)',
  },
];

export const REASSURING_MESSAGES = [
  'Initializing Veo deep video diffusion pipeline...',
  'Deconstructing logo contours and vector geometry...',
  'Synthesizing temporal 3D motion keyframes...',
  'Simulating studio lighting sweeps and specular highlights...',
  'Calculating depth maps and camera trajectory...',
  'Rendering photorealistic motion frames with Veo...',
  'Applying temporal coherence and noise reduction...',
  'Encoding high-definition MP4 broadcast stream...',
];
