import React from "react";
import { motion } from "framer-motion";
import { Glass, Radius } from "../../constants/theme";

interface GlassSurfaceProps {
  children: React.ReactNode;
  blur?: number;
  background?: string;
  borderColor?: string;
  borderRadius?: number;
  shadow?: string;
  padding?: number | string;
  style?: React.CSSProperties;
  animate?: boolean;
  className?: string;
}

export default function GlassSurface({
  children,
  blur = Glass.blur,
  background = Glass.background,
  borderColor = Glass.border,
  borderRadius = Radius.xxl,
  shadow = Glass.shadow,
  padding,
  style,
  animate = true,
  className,
}: GlassSurfaceProps) {
  const baseStyle: React.CSSProperties = {
    background,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${borderColor}`,
    borderRadius,
    boxShadow: shadow,
    overflow: "hidden",
    ...(padding !== undefined ? { padding } : {}),
    ...style,
  };

  if (!animate) {
    return (
      <div className={className} style={baseStyle}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={baseStyle}
      whileHover={{
        boxShadow: Glass.shadowGlow,
        borderColor: Glass.borderFocus,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
