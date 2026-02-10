
import { Platform } from 'react-native';

const honeyPrimary = '#CA8A04'; // Darker gold/amber for better contrast
const honeyDark = '#A16207'; // Even darker for text/hover

export const Colors = {
  light: {
    text: '#111827', // Gray-900 (Softer than pure black)
    background: '#F8FAFC', // Slate-50 (Cool, premium white-gray)
    tint: honeyPrimary,
    icon: '#6B7280', // Gray-500
    primary: honeyPrimary,
    primaryDark: honeyDark,
    cardBg: '#FFFFFF',
    border: '#E2E8F0', // Slate-200
    shadow: '#000000', // Neutral shadow, NO gold tint
  },
  dark: {
    // keeping dark mode same as light for now to match specific landing page request "whiteish bg"
    // or we can implement true dark mode later. For now, matching the requested landing style.
    text: '#111827',
    background: '#F8FAFC',
    tint: honeyPrimary,
    icon: '#6B7280',
    primary: honeyPrimary,
    primaryDark: honeyDark,
    cardBg: '#FFFFFF',
    border: '#E2E8F0',
    shadow: '#000000',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
