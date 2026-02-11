import React, { useState, useEffect } from "react";
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
  showLensGuide?: boolean;
}

export default function LensTabs({ lenses, showLensGuide }: LensTabsProps) {
  const [activeTab, setActiveTab] = useState<LensKey | null>(null);
  const [showPhysicsGlow, setShowPhysicsGlow] = useState(false);
  const [guideDismissed, setGuideDismissed] = useState(false);

  useEffect(() => {
    if (!showLensGuide || guideDismissed) return;
    const timer = setTimeout(() => setShowPhysicsGlow(true), 3500);
    return () => clearTimeout(timer);
  }, [showLensGuide, guideDismissed]);

  const handleTabClick = (key: LensKey) => {
    if (guideDismissed === false && showLensGuide) setGuideDismissed(true);
    setActiveTab((prev) => (prev === key ? null : key));
  };

  const hasContent = LENS_KEYS.some((k) => lenses[k]?.trim());
  if (!hasContent) return null;

  const shouldGlowPhysics = showPhysicsGlow && showLensGuide && !guideDismissed;

  return (
    <div style={{ marginTop: Spacing.md }}>
      {/* Tab Row */}
      <div
        style={{
          display: "flex",
          gap: Spacing.xs,
          alignItems: "center",
          position: "relative",
        }}
      >
        {LENS_KEYS.map((key) => {
          const isActive = activeTab === key;
          const isPhysics = key === "physics";
          return (
            <motion.button
              key={key}
              onClick={() => handleTabClick(key)}
              animate={
                isPhysics && shouldGlowPhysics
                  ? {
                      boxShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 12px rgba(255,255,255,0.25)",
                        "0 0 0px rgba(255,255,255,0)",
                      ],
                    }
                  : undefined
              }
              transition={
                isPhysics && shouldGlowPhysics
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: `${Spacing.xs}px ${Spacing.sm}px`,
                position: "relative",
                outline: "none",
                borderRadius: Radius.sm,
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
                  layout="position"
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: Colors.accent,
                    marginTop: 3,
                    borderRadius: 0.5,
                  }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Hint text - appears when glow starts */}
      <AnimatePresence>
        {shouldGlowPhysics && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              margin: 0,
              marginTop: Spacing.xs,
              fontSize: Typography.sizes.xs,
              color: Colors.textDim,
              fontWeight: Typography.light,
            }}
          >
            Tap to explore 4 perspectives
          </motion.p>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab && lenses[activeTab]?.trim() && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
