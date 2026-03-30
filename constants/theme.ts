import { Platform } from "react-native";

export const Colors = {
  primary: "#F97316",
  secondary: "#FB923C",
  accent: "#FDBA74",
  background: "#050505",
  surface: "#111111",
  card: "#1C1C1C",
  text: "#FAFAFA",
  textSecondary: "#9CA3AF",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
