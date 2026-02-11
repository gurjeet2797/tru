import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Colors, Glass, Spacing, Typography, Animation } from "../../constants/theme";

interface ConfidenceBlockProps {
  confident: string[];
  uncertain: string[];
}

export default function ConfidenceBlock({
  confident,
  uncertain,
}: ConfidenceBlockProps) {
  const [expanded, setExpanded] = useState(false);

  if (confident.length === 0 && uncertain.length === 0) return null;

  return (
    <div style={{ marginTop: Spacing.md }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          outline: "none",
          color: Colors.textSecondary,
          fontSize: Typography.sizes.sm,
          fontWeight: Typography.regular,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {expanded ? "Hide" : "Show"} confidence
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: Animation.normal }}
            style={{ overflow: "hidden", marginTop: Spacing.sm }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: Spacing.md }}>
              {confident.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: Spacing.xs }}>
                  <span
                    style={{
                      color: Colors.textSecondary,
                      fontSize: Typography.sizes.xs,
                      fontWeight: Typography.semibold,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Confident
                  </span>
                  {confident.map((item, i) => (
                    <span
                      key={i}
                      style={{
                        color: Colors.textPrimary,
                        fontSize: Typography.sizes.body,
                        fontWeight: Typography.regular,
                        lineHeight: "20px",
                        paddingLeft: Spacing.sm,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
              {uncertain.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: Spacing.xs }}>
                  <span
                    style={{
                      color: Colors.textSecondary,
                      fontSize: Typography.sizes.sm,
                      fontWeight: Typography.semibold,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Uncertain
                  </span>
                  {uncertain.map((item, i) => (
                    <span
                      key={i}
                      style={{
                        color: Colors.textPrimary,
                        fontSize: Typography.sizes.body,
                        fontWeight: Typography.regular,
                        lineHeight: "20px",
                        paddingLeft: Spacing.sm,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
