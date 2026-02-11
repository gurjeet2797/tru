import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Colors, Glass, Spacing, Typography, Radius, Animation } from "../../constants/theme";

interface Source {
  title: string;
  url: string;
}

interface SourcesPillProps {
  sources: Source[];
}

export default function SourcesPill({ sources }: SourcesPillProps) {
  const [expanded, setExpanded] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div style={{ marginTop: Spacing.md }}>
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: Glass.inputBg,
          backdropFilter: `blur(${Glass.blurLight}px)`,
          WebkitBackdropFilter: `blur(${Glass.blurLight}px)`,
          borderRadius: Radius.full,
          padding: `${Spacing.xs}px ${Spacing.md}px`,
          border: `1px solid ${Glass.border}`,
          cursor: "pointer",
          outline: "none",
          color: Colors.textSecondary,
          fontSize: Typography.sizes.sm,
          fontWeight: Typography.regular,
        }}
      >
        {sources.length} source{sources.length !== 1 ? "s" : ""}
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: Animation.fast }}
            style={{
              overflow: "hidden",
              marginTop: Spacing.sm,
              paddingLeft: Spacing.sm,
              display: "flex",
              flexDirection: "column",
              gap: Spacing.xs,
            }}
          >
            {sources.map((source, i) => (
              <a
                key={i}
                href={source.url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: source.url ? Colors.textPrimary : Colors.textSecondary,
                  fontSize: Typography.sizes.sm,
                  fontWeight: Typography.light,
                  textDecoration: source.url ? "underline" : "none",
                  cursor: source.url ? "pointer" : "default",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {source.title}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
