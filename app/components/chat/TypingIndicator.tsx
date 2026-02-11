import React from "react";
import { motion } from "framer-motion";
import { Colors, Glass, Spacing, Radius } from "../../constants/theme";

export default function TypingIndicator() {
  return (
    <div
      style={{
        alignSelf: "flex-start",
        padding: `${Spacing.sm}px ${Spacing.lg}px`,
        width: "fit-content",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            "0 0 0 rgba(255,255,255,0)",
            "0 0 16px rgba(255,255,255,0.03)",
            "0 0 0 rgba(255,255,255,0)",
          ],
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { type: "spring", damping: 20, stiffness: 200 },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
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
            animate={{
              opacity: [0.25, 0.9, 0.25],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: Colors.textSecondary,
              display: "inline-block",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
