export const colors = {
  paper: {
    DEFAULT: '#F7F5F0',
    light: '#FAF9F6',
    warm: '#F4F1EA',
    deep: '#EEE9DF',
  },
  canvas: '#F7F5F0',
  surface: {
    DEFAULT: '#FFFFFF',
    elevated: '#FCFBF9',
    sand: '#EDE8DF',
    muted: '#E6DFD4',
  },
  border: {
    DEFAULT: '#E5DED4',
    light: '#EFEAE2',
    subtle: '#EAE4DC',
    dark: '#D5CCC0',
  },
  ink: {
    DEFAULT: '#282523',
    heading: '#161413',
    muted: '#736B63',
    faint: '#A69E96',
  },
  terracotta: {
    DEFAULT: '#C8624B',
    50: '#FAF2F0',
    100: '#F5E6E3',
    200: '#ECCDC7',
    300: '#DFB0A7',
    400: '#D3887B',
    500: '#C8624B',
    600: '#B6523C',
    700: '#94412E',
    800: '#753526',
    900: '#5A2B20',
  },
  blush: {
    DEFAULT: '#B97B72',
    50: '#FAF4F3',
    100: '#F5EAE8',
    200: '#EBD6D3',
    300: '#DCBAB5',
    400: '#CB9890',
    500: '#B97B72',
    600: '#A4655C',
    700: '#844E46',
  },
  burgundy: {
    DEFAULT: '#682D32',
    light: '#853C42',
    dark: '#4F1F24',
  },
  campus: {
    sage: '#687E71',
    gold: '#B68B40',
  },
  rose: {
    50: '#FFF0F0',
    100: '#FFE0E0',
    200: '#FFC8C8',
    300: '#FF9999',
    400: '#FF6666',
    500: '#FF3333',
    600: '#E60000',
  },
  emerald: {
    50: '#F0FFF4',
    100: '#DCEFD6',
    200: '#B8DFAD',
    300: '#86CF78',
    400: '#5ABF4A',
    500: '#3AA33A',
    600: '#2E822E',
  },
  amber: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
  },
  semantic: {
    success: '#3AA33A',
    warning: '#FFB300',
    error: '#E60000',
    info: '#3B82F6',
    focus: '#C8624B',
  },
  selection: {
    bg: '#F5E6E3',
    text: '#753526',
  },
} as const;

export const typography = {
  fontFamilies: {
    sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  fontSizes: {
    xs: '0.625rem',
    sm: '0.75rem',
    base: '0.875rem',
    lg: '1rem',
    xl: '1.125rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    '4xl': '1.875rem',
    '5xl': '2.25rem',
    '6xl': '3rem',
    '7xl': '3.75rem',
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.04em',
    widest: '0.1em',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.75rem',
  '4xl': '2.25rem',
  full: '9999px',
} as const;

export const shadows = {
  soft: '0 2px 10px rgba(40, 37, 35, 0.04), 0 1px 3px rgba(40, 37, 35, 0.02)',
  hover: '0 12px 30px -4px rgba(40, 37, 35, 0.07), 0 4px 10px -2px rgba(40, 37, 35, 0.04)',
  modal: '0 24px 60px -8px rgba(22, 20, 19, 0.18)',
  card3d: '0 30px 60px -12px rgba(22, 20, 19, 0.15), 0 18px 36px -18px rgba(22, 20, 19, 0.12)',
  elevated: '0 20px 40px -12px rgba(22, 20, 19, 0.1)',
  inner: 'inset 0 2px 4px 0 rgba(40, 37, 35, 0.06)',
  focus: '0 0 0 3px rgba(200, 98, 75, 0.4)',
} as const;

export const motion = {
  durations: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  springConfigs: {
    gentle: { damping: 25, stiffness: 180, mass: 0.5 },
    normal: { damping: 22, stiffness: 320, mass: 1 },
    stiff: { damping: 20, stiffness: 500, mass: 1 },
    bouncy: { damping: 15, stiffness: 400, mass: 1 },
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndices = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const focusStyles = {
  ring: '3px',
  ringColor: colors.semantic.focus,
  ringOffset: '2px',
  ringOffsetColor: colors.paper.DEFAULT,
} as const;

export const componentSizes = {
  button: {
    sm: { height: '32px', padding: '0 12px', fontSize: typography.fontSizes.xs },
    md: { height: '40px', padding: '0 16px', fontSize: typography.fontSizes.sm },
    lg: { height: '48px', padding: '0 24px', fontSize: typography.fontSizes.base },
    xl: { height: '56px', padding: '0 32px', fontSize: typography.fontSizes.lg },
  },
  input: {
    sm: { height: '36px', padding: '0 12px', fontSize: typography.fontSizes.xs },
    md: { height: '44px', padding: '0 14px', fontSize: typography.fontSizes.sm },
    lg: { height: '52px', padding: '0 16px', fontSize: typography.fontSizes.base },
  },
  card: {
    sm: { padding: spacing[4] },
    md: { padding: spacing[5] },
    lg: { padding: spacing[6] },
    xl: { padding: spacing[8] },
  },
} as const;

export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border.subtle}`,
  },
  medium: {
    background: 'rgba(252, 251, 249, 0.9)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${colors.border.DEFAULT}`,
  },
  heavy: {
    background: 'rgba(247, 245, 240, 0.95)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${colors.border.dark}`,
  },
} as const;

export const matte3d = {
  materials: {
    paper: { color: colors.surface.DEFAULT, roughness: 0.9, metalness: 0 },
    fabric: { color: colors.paper.warm, roughness: 0.95, metalness: 0 },
    terracotta: { color: colors.terracotta.DEFAULT, roughness: 0.7, metalness: 0 },
    sage: { color: colors.campus.sage, roughness: 0.8, metalness: 0 },
  },
  lighting: {
    ambient: { color: '#FFFFFF', intensity: 0.4 },
    key: { color: '#FFF8F0', intensity: 0.8, position: [2, 4, 3] },
    fill: { color: '#F5E6E3', intensity: 0.3, position: [-2, 2, 2] },
    rim: { color: '#ECCDC7', intensity: 0.2, position: [0, 0, -3] },
  },
  shadows: {
    soft: { opacity: 0.08, blur: 20, offset: [0, 8, -4] },
    medium: { opacity: 0.12, blur: 30, offset: [0, 12, -6] },
    strong: { opacity: 0.18, blur: 40, offset: [0, 20, -10] },
  },
} as const;

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  motion,
  breakpoints,
  zIndices,
  transitions,
  focusStyles,
  componentSizes,
  glassmorphism,
  matte3d,
} as const;

export type DesignTokens = typeof designTokens;
export type ColorToken = keyof typeof colors;
export type FontSizeToken = keyof typeof typography.fontSizes;
export type SpacingToken = keyof typeof spacing;
export type ShadowToken = keyof typeof shadows;
export type DurationToken = keyof typeof motion.durations;
export type EasingToken = keyof typeof motion.easings;