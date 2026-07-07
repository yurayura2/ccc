export type ScreenType = 'WELCOME' | 'CAMERA' | 'SELECTION' | 'DECORATION';

export interface CapturedPhoto {
  id: string;
  url: string; // original dataURL
  timestamp: number;
}

export type FilterType = 'normal' | 'warm' | 'cool' | 'vintage' | 'bw' | 'bright';

export interface FilterInfo {
  id: FilterType;
  name: string;
  style: string; // CSS filter string
}

export const FILTERS: FilterInfo[] = [
  { id: 'normal', name: '기본 사진', style: 'none' },
  { id: 'bright', name: '화사하게', style: 'brightness(1.1) contrast(1.05)' },
  { id: 'warm', name: '따뜻하게', style: 'sepia(0.15) saturate(1.1) hue-rotate(-5deg)' },
  { id: 'cool', name: '시원하게', style: 'saturate(0.9) hue-rotate(5deg) brightness(1.02)' },
  { id: 'vintage', name: '레트로', style: 'contrast(0.9) brightness(1.05) sepia(0.2) saturate(1.1)' },
  { id: 'bw', name: '흑백사진', style: 'grayscale(1) contrast(1.1)' },
];

export interface FrameTheme {
  id: string;
  name: string;
  bgColor: string; // CSS background class/color
  borderColor: string;
  textColor: string;
  accentColor: string;
  pattern?: string; // decorative CSS or SVGs
  emojiDecoration: string[]; // default emojis to render at top/bottom corners
}

export const FRAME_THEMES: FrameTheme[] = [
  {
    id: 'yellow-sun',
    name: '햇살 노랑 ☀️',
    bgColor: '#FFFBEB', // amber-50
    borderColor: '#FCD34D', // amber-300
    textColor: '#92400E', // amber-800
    accentColor: '#F59E0B', // amber-500
    emojiDecoration: ['☀️', '☁️', '🎈', '🌻'],
  },
  {
    id: 'green-forest',
    name: '숲속 초록 🌳',
    bgColor: '#F0FDF4', // green-50
    borderColor: '#86EFAC', // green-300
    textColor: '#166534', // green-800
    accentColor: '#22C55E', // green-500
    emojiDecoration: ['🌳', '🧸', '🐰', '🦁'],
  },
  {
    id: 'blue-ocean',
    name: '바다 파랑 🐳',
    bgColor: '#F0F9FF', // sky-50
    borderColor: '#7DD3FC', // sky-300
    textColor: '#075985', // sky-800
    accentColor: '#0EA5E9', // sky-500
    emojiDecoration: ['🐳', '🐠', '🐚', '⛵'],
  },
  {
    id: 'pink-heart',
    name: '달콤 핑크 🎀',
    bgColor: '#FFF5F5', // red-50 / pink-50
    borderColor: '#F9A8D4', // pink-300
    textColor: '#9D174D', // pink-800
    accentColor: '#EC4899', // pink-500
    emojiDecoration: ['🎀', '💝', '🍭', '🌸'],
  },
  {
    id: 'purple-space',
    name: '우주 보라 🚀',
    bgColor: '#FAF5FF', // purple-50
    borderColor: '#D8B4FE', // purple-300
    textColor: '#6B21A8', // purple-800
    accentColor: '#A855F7', // purple-500
    emojiDecoration: ['🚀', '🪐', '⭐', '👾'],
  },
  {
    id: 'classic-white',
    name: '심플 화이트 🤍',
    bgColor: '#FFFFFF',
    borderColor: '#E2E8F0', // slate-200
    textColor: '#1E293B', // slate-800
    accentColor: '#64748B', // slate-500
    emojiDecoration: ['📸', '✨', '🐾', '☘️'],
  },
  {
    id: 'classic-black',
    name: '시크 블랙 🖤',
    bgColor: '#1E293B', // slate-800
    borderColor: '#0F172A', // slate-900
    textColor: '#F8FAFC', // slate-50
    accentColor: '#38BDF8', // sky-400
    emojiDecoration: ['⚡', '🍿', '🎸', '🌟'],
  },
];

export interface Sticker {
  id: string;
  emoji: string;
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
  size: number; // size multiplier or px
  rotation: number; // in degrees
}
