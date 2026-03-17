import React from 'react';

// All icons are 20x20 viewBox, stroke-based, 1.5 strokeWidth for consistency
interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

const I: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 20, className, color, children }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className} stroke={color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ── Life Stage ───────────────────────────
export const IconRocket: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M12 3c3 0 5 2 5 5-1 3-3 5.5-5.5 7.5L10 17l-1.5-1.5C6 13.5 4 11 3 8c0-3 2-5 5-5a4.5 4.5 0 0 1 4 0z" /><circle cx="10" cy="8.5" r="1.5" /></I>
);
export const IconTrendUp: React.FC<IconProps> = (p) => (
  <I {...p}><polyline points="4 14 8 9 12 11 16 5" /><polyline points="12 5 16 5 16 9" /></I>
);
export const IconMountain: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M3 16L7.5 7L10 12L12.5 7L17 16H3Z" /></I>
);
export const IconSunset: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M3 14h14" /><path d="M5 14a5 5 0 0 1 10 0" /><path d="M10 4v2" /><path d="M15.5 6.5l-1.5 1.5" /><path d="M4.5 6.5L6 8" /></I>
);

// ── Marital ──────────────────────────────
export const IconUser: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="10" cy="7" r="3" /><path d="M4 17a6 6 0 0 1 12 0" /></I>
);
export const IconUsers: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="7.5" cy="7" r="2.5" /><circle cx="13" cy="8" r="2" /><path d="M2 17a5.5 5.5 0 0 1 11 0" /><path d="M13 17a4 4 0 0 1 5 0" /></I>
);
export const IconClipboard: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="4" y="3" width="12" height="14" rx="1.5" /><path d="M7 3V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M7 8h6" /><path d="M7 11h4" /></I>
);
export const IconDove: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M5 15C3 13 3 10 5 8l3-3c2 0 4 1 4 3l5-2c0 3-2 5-4 6l-2 1v4" /></I>
);

// ── Goals ────────────────────────────────
export const IconShield: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 2L3 5.5V10c0 4.5 3 8 7 9.5 4-1.5 7-5 7-9.5V5.5L10 2z" /><path d="M7.5 10l1.5 2 3.5-4" /></I>
);
export const IconScale: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 3v14" /><path d="M4 7l6-3 6 3" /><path d="M2 12a3 3 0 0 0 4 0" /><path d="M14 12a3 3 0 0 0 4 0" /><path d="M4 7L2 12" /><path d="M4 7l2 5" /><path d="M16 7l-2 5" /><path d="M16 7l2 5" /></I>
);
export const IconChart: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="3" y="10" width="3" height="7" rx="0.5" /><rect x="8.5" y="6" width="3" height="11" rx="0.5" /><rect x="14" y="3" width="3" height="14" rx="0.5" /></I>
);
export const IconLaptop: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="3" y="4" width="14" height="10" rx="1.5" /><path d="M1 16h18" /></I>
);
export const IconBuilding: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="4" y="2" width="12" height="16" rx="1" /><path d="M7 5h2" /><path d="M11 5h2" /><path d="M7 8h2" /><path d="M11 8h2" /><path d="M7 11h2" /><path d="M11 11h2" /><rect x="8" y="14" width="4" height="4" /></I>
);
export const IconHeart: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 17S3 12 3 7.5a3.5 3.5 0 0 1 7 0 3.5 3.5 0 0 1 7 0C17 12 10 17 10 17z" /></I>
);
export const IconHospital: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" /><path d="M10 7v6" /><path d="M7 10h6" /></I>
);
export const IconBaby: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="10" cy="7" r="4" /><path d="M6 12c0 3 1.8 5 4 5s4-2 4-5" /><path d="M8.5 6.5a1 1 0 1 0 0 1" /><path d="M11.5 6.5a1 1 0 1 0 0 1" /></I>
);

// ── Asset Categories ─────────────────────
export const IconBanknote: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="2" y="5" width="16" height="10" rx="1.5" /><circle cx="10" cy="10" r="2.5" /><path d="M5 8v4" /><path d="M15 8v4" /></I>
);
export const IconBank: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M3 17h14" /><path d="M3 8l7-5 7 5" /><path d="M5 8v7" /><path d="M9 8v7" /><path d="M11 8v7" /><path d="M15 8v7" /></I>
);
export const IconHome: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M3 10L10 3l7 7" /><path d="M5 8.5V17h10V8.5" /><rect x="8" y="12" width="4" height="5" /></I>
);
export const IconBitcoin: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M7 4v12" /><path d="M7 4h4a3 3 0 0 1 0 6H7" /><path d="M7 10h5a3 3 0 0 1 0 6H7" /><path d="M9 3v2" /><path d="M12 3v2" /><path d="M9 16v2" /><path d="M12 16v2" /></I>
);
export const IconCar: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M5 13H3.5a1 1 0 0 1-1-1v-2l2-4h11l2 4v2a1 1 0 0 1-1 1H15" /><circle cx="6.5" cy="13.5" r="1.5" /><circle cx="13.5" cy="13.5" r="1.5" /><path d="M8 13h4" /></I>
);
export const IconDiamond: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M5 3h10l4 5-9 10L1 8l4-5z" /><path d="M1 8h18" /></I>
);
export const IconUmbrella: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 3a8 8 0 0 1 8 8H2a8 8 0 0 1 8-8z" /><path d="M10 11v5a2 2 0 0 1-4 0" /></I>
);

// ── Documents ────────────────────────────
export const IconDocument: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M5 2h7l4 4v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 17V3.5A1.5 1.5 0 0 1 5.5 2z" /><path d="M12 2v4h4" /><path d="M7 9h6" /><path d="M7 12h4" /></I>
);
export const IconPen: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M14 3l3 3L7 16H4v-3L14 3z" /></I>
);
export const IconUserGroup: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="7" cy="6" r="2.5" /><circle cx="14" cy="7" r="2" /><path d="M2 16a5 5 0 0 1 10 0" /><path d="M14 16a3.5 3.5 0 0 1 4.5 0" /></I>
);
export const IconWrench: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M14.5 3.5a4 4 0 0 0-5 5L4 14l2 2 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5L12 6l2-2z" /></I>
);

// ── Vault ────────────────────────────────
export const IconLock: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="4" y="9" width="12" height="8" rx="1.5" /><path d="M7 9V6a3 3 0 0 1 6 0v3" /><circle cx="10" cy="13" r="1" /></I>
);
export const IconUnlock: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="4" y="9" width="12" height="8" rx="1.5" /><path d="M7 9V6a3 3 0 0 1 6 0" /><circle cx="10" cy="13" r="1" /></I>
);
export const IconKey: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="7" cy="7" r="4" /><path d="M10 10l7 7" /><path d="M14.5 14.5l2-2" /></I>
);
export const IconCoins: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="8" cy="8" r="5" /><path d="M11.5 10A5 5 0 1 0 13 15.5" /><path d="M8 6v4" /><path d="M6 8h4" /></I>
);
export const IconNote: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" /><path d="M7 7h6" /><path d="M7 10h6" /><path d="M7 13h3" /></I>
);

// ── Executor ─────────────────────────────
export const IconCheck: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M4 10l4 4 8-8" /></I>
);
export const IconCheckSquare: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" /><path d="M6.5 10l2.5 2.5L13.5 7" /></I>
);
export const IconSquare: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" /></I>
);
export const IconSparkle: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 2v3" /><path d="M10 15v3" /><path d="M2 10h3" /><path d="M15 10h3" /><path d="M4.5 4.5l2 2" /><path d="M13.5 13.5l2 2" /><path d="M15.5 4.5l-2 2" /><path d="M6.5 13.5l-2 2" /></I>
);
export const IconTarget: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="4" /><circle cx="10" cy="10" r="1" /></I>
);
export const IconArrowRight: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M4 10h12" /><path d="M12 6l4 4-4 4" /></I>
);

// ── Landing / Misc ───────────────────────
export const IconLayers: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 2L2 7l8 5 8-5-8-5z" /><path d="M2 12l8 5 8-5" /><path d="M2 17l8 5 8-5" /></I>
);
export const IconEye: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></I>
);
export const IconZap: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" /></I>
);
export const IconLifebuoy: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="3" /><path d="M7.8 7.8L4.5 4.5" /><path d="M12.2 7.8l3.3-3.3" /><path d="M12.2 12.2l3.3 3.3" /><path d="M7.8 12.2l-3.3 3.3" /></I>
);
export const IconPlay: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M6 4l10 6-10 6V4z" fill={p.color || 'currentColor'} stroke="none" /></I>
);
export const IconClock: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" /></I>
);
export const IconDollar: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 2v16" /><path d="M6 6c0-1.5 1.5-2.5 4-2.5s4 1 4 2.5-1.5 2.5-4 3-4 1.5-4 3 1.5 2.5 4 2.5 4-1 4-2.5" /></I>
);
export const IconWarning: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M10 3L2 17h16L10 3z" /><path d="M10 8v4" /><circle cx="10" cy="14.5" r="0.5" fill={p.color || 'currentColor'} stroke="none" /></I>
);
export const IconInfo: React.FC<IconProps> = (p) => (
  <I {...p}><circle cx="10" cy="10" r="7" /><path d="M10 9v4" /><circle cx="10" cy="6.5" r="0.5" fill={p.color || 'currentColor'} stroke="none" /></I>
);
export const IconBriefcase: React.FC<IconProps> = (p) => (
  <I {...p}><rect x="2" y="6" width="16" height="11" rx="1.5" /><path d="M7 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M2 11h16" /></I>
);
export const IconRefresh: React.FC<IconProps> = (p) => (
  <I {...p}><path d="M16 4v4h-4" /><path d="M4 16v-4h4" /><path d="M5.5 8a6 6 0 0 1 10-1.5L16 8" /><path d="M14.5 12a6 6 0 0 1-10 1.5L4 12" /></I>
);

// Utility - renders any icon by key
export const ICON_MAP: Record<string, React.FC<IconProps>> = {
  rocket: IconRocket, trend_up: IconTrendUp, mountain: IconMountain, sunset: IconSunset,
  user: IconUser, users: IconUsers, clipboard: IconClipboard, dove: IconDove,
  shield: IconShield, scale: IconScale, chart: IconChart, laptop: IconLaptop,
  building: IconBuilding, heart: IconHeart, hospital: IconHospital, baby: IconBaby,
  banknote: IconBanknote, bank: IconBank, home: IconHome, bitcoin: IconBitcoin,
  car: IconCar, diamond: IconDiamond, umbrella: IconUmbrella,
  document: IconDocument, pen: IconPen, user_group: IconUserGroup, wrench: IconWrench,
  lock: IconLock, unlock: IconUnlock, key: IconKey, coins: IconCoins, note: IconNote,
  check: IconCheck, check_square: IconCheckSquare, square: IconSquare,
  sparkle: IconSparkle, target: IconTarget, arrow_right: IconArrowRight,
  layers: IconLayers, eye: IconEye, zap: IconZap, lifebuoy: IconLifebuoy,
  play: IconPlay, clock: IconClock, dollar: IconDollar, warning: IconWarning,
  info: IconInfo, briefcase: IconBriefcase,
};

export const Icon: React.FC<IconProps & { name: string }> = ({ name, ...rest }) => {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp {...rest} /> : null;
};
