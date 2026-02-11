import React from "react";
import { motion } from "framer-motion";
import { Colors, Typography } from "../../constants/theme";

interface GlowTextProps {
  children: string;
  size?: number;
  breathe?: boolean;
  style?: React.CSSProperties;
}

export default function GlowText({
  children,
  size = Typography.sizes.lg,
  breathe = false,
  style,
}: GlowTextProps) {
  return (
    <motion.span
      animate={
        breathe
          ? { opacity: [0.85, 1, 0.85] }
          : undefined
      }
      transition={
        breathe
          ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      style={{
        color: Colors.accent,
        fontSize: size,
        fontWeight: Typography.semibold,
        textShadow:
          "0 0 10px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.05)",
        letterSpacing: 2,
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </motion.span>
  );
}
