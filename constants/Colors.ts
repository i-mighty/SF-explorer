/**
 * SF Explorer - Design System
 * Premium color palette with glassmorphism-ready tokens
 */

const tintColorLight = '#0A84FF';
const tintColorDark = '#64D2FF';

export const Colors = {
  light: {
    text: '#1C1C1E',
    textSecondary: '#636366',
    textTertiary: '#8E8E93',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    tint: tintColorLight,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    border: '#E5E5EA',
    card: 'rgba(255, 255, 255, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.3)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    gradient: {
      start: '#667EEA',
      end: '#764BA2',
    },
    accent: '#FF6B6B',
    success: '#34C759',
    warning: '#FF9500',
    categoryBadge: 'rgba(10, 132, 255, 0.12)',
    categoryBadgeText: '#0A84FF',
  },
  dark: {
    text: '#F5F5F7',
    textSecondary: '#A1A1A6',
    textTertiary: '#636366',
    background: '#000000',
    surface: '#1C1C1E',
    tint: tintColorDark,
    icon: '#8E8E93',
    tabIconDefault: '#636366',
    tabIconSelected: tintColorDark,
    border: '#38383A',
    card: 'rgba(44, 44, 46, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    gradient: {
      start: '#667EEA',
      end: '#764BA2',
    },
    accent: '#FF6B6B',
    success: '#30D158',
    warning: '#FF9F0A',
    categoryBadge: 'rgba(100, 210, 255, 0.15)',
    categoryBadgeText: '#64D2FF',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
  micro: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },
};
