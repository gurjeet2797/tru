export const Colors = {
  background: "#000000",
  surface: "#0A0A0A",
  surfaceElevated: "#141414",
  border: "#222222",
  textPrimary: "#F0F0F0",
  textSecondary: "#A0A0A0",
  textDim: "#707070",
  accent: "#FFFFFF",
} as const;

export const Glass = {
  background: "rgba(255, 255, 255, 0.06)",
  backgroundHover: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.07)",
  borderFocus: "rgba(255, 255, 255, 0.15)",
  blur: 20,
  blurLight: 12,
  blurHeavy: 28,
  bubbleBg: "rgba(255, 255, 255, 0.05)",
  bubbleUserBg: "rgba(255, 255, 255, 0.08)",
  inputBg: "rgba(255, 255, 255, 0.04)",
  shadow: "0 0 80px rgba(255, 255, 255, 0.02)",
  shadowGlow: "0 0 120px rgba(255, 255, 255, 0.04)",
} as const;

export const Card = {
  maxWidth: 520,
  height: 680,
  borderRadius: 24,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Typography = {
  light: "300" as const,
  regular: "400" as const,
  semibold: "600" as const,
  sizes: {
    xs: 11,
    sm: 13,
    body: 15,
    lg: 17,
    xl: 22,
    title: 28,
    splash: 42,
  },
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Animation = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  splash: 2.5,
  spring: {
    type: "spring" as const,
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  springGentle: {
    type: "spring" as const,
    damping: 25,
    stiffness: 80,
    mass: 1,
  },
} as const;
