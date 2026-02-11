import React from "react";
import { motion } from "framer-motion";
import { Colors, Glass, Spacing, Radius } from "../../constants/theme";

export default function TypingIndicator() {
  return (
    <div style={{ alignSelf: "flex-start", padding: `${Spacing.sm}px ${Spacing.lg}px` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: Glass.bubbleBg,
          backdropFilter: `blur(${Glass.blurLight}px)`,
          WebkitBackdropFilter: `blur(${Glass.blurLight}px)`,
          borderRadius: Radius.lg,
          padding: `${Spacing.md}px ${Spacing.lg}px`,
          border: `1px solid ${Glass.border}`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: Colors.textSecondary,
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
}
