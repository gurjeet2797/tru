import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ColorText from "../ui/ColorText";
import { Colors, Glass, Spacing, Typography, Radius, Animation } from "../../constants/theme";

const LENS_KEYS = ["physics", "math", "human", "contemplative"] as const;
type LensKey = (typeof LENS_KEYS)[number];

const LENS_LABELS: Record<LensKey, string> = {
  physics: "Physics",
  math: "Math",
  human: "Human",
  contemplative: "Contemplative",
};

interface LensTabsProps {
  lenses: Record<LensKey, string>;
}

export default function LensTabs({ lenses }: LensTabsProps) {
  const [activeTab, setActiveTab] = useState<LensKey | null>(null);

  const hasContent = LENS_KEYS.some((k) => lenses[k]?.trim());
  if (!hasContent) return null;

  return (
    <div style={{ marginTop: Spacing.md }}>
      {/* Tab Row */}
      <div style={{ display: "flex", gap: Spacing.xs }}>
        {LENS_KEYS.map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(isActive ? null : key)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: `${Spacing.xs}px ${Spacing.sm}px`,
                position: "relative",
                outline: "none",
              }}
            >
              <span
                style={{
                  color: isActive ? Colors.textPrimary : Colors.textSecondary,
                  fontSize: Typography.sizes.sm,
                  fontWeight: Typography.regular,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  transition: "color 0.2s ease",
                }}
              >
                {LENS_LABELS[key]}
              </span>
              {isActive && (
                <motion.div
                  layoutId="lens-underline"
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: Colors.accent,
                    marginTop: 3,
                    borderRadius: 0.5,
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab && lenses[activeTab]?.trim() && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: Animation.fast }}
            style={{
              marginTop: Spacing.sm,
              paddingTop: Spacing.sm,
              borderTop: `1px solid ${Glass.border}`,
            }}
          >
            <p
              style={{
                color: Colors.textPrimary,
                fontSize: Typography.sizes.body,
                fontWeight: Typography.regular,
                lineHeight: "22px",
                margin: 0,
              }}
            >
              <ColorText text={lenses[activeTab]} style={{ color: Colors.textPrimary }} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
