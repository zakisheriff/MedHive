
import { Platform } from 'react-native';

const honeyPrimary = '#dca349';
const honeyDark = '#b8873d';

export const Colors = {
  light: {
    text: '#111111',
    background: '#f9f9f9', // Whiteish bg from landing
    tint: honeyPrimary,
    icon: '#687076',
    primary: honeyPrimary,
    primaryDark: honeyDark,
    cardBg: '#ffffff',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(220, 163, 73, 0.3)',
  },
  dark: {
    // keeping dark mode same as light for now to match specific landing page request "whiteish bg"
    // or we can implement true dark mode later. For now, matching the requested landing style.
    text: '#111111',
    background: '#f9f9f9',
    tint: honeyPrimary,
    icon: '#687076',
    primary: honeyPrimary,
    primaryDark: honeyDark,
    cardBg: '#ffffff',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(220, 163, 73, 0.3)',
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
