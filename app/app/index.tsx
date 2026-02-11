import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "../components/particles/Particles";
import GlassSurface from "../components/ui/GlassSurface";
import MessageList from "../components/chat/MessageList";
import InputBar from "../components/chat/InputBar";
import GlowText from "../components/ui/GlowText";
import useChat from "../hooks/useChat";
import { Colors, Glass, Card, Spacing, Typography } from "../constants/theme";

export default function ChatScreen() {
  const { messages, isLoading, send } = useChat();
  const [showSplash, setShowSplash] = useState(true);

  // Auto-dismiss splash after 2.5s, or immediately on first send
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (text: string) => {
    if (showSplash) setShowSplash(false);
    send(text);
  };

  return (
    <div style={styles.root}>
      {/* WebGL Particle background */}
      <Particles
        particleCount={80}
        speed={0.06}
        particleColors={["#555555", "#444444", "#333333"]}
        moveParticlesOnHover
        alphaParticles
        particleBaseSize={1.5}
        sizeRandomness={0.6}
        connectDistance={90}
      />

      {/* Splash or Chat */}
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            style={styles.centered}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 80,
                delay: 0.2,
              }}
            >
              <GlowText size={Typography.sizes.splash} breathe>
                Tru
              </GlowText>
            </motion.div>

            {/* Taglines */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={styles.tagline}
            >
              <span style={styles.taglineDash} />
              <span style={styles.taglineText}>
                truth-anchored thought engine
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              style={styles.tagline}
            >
              <span style={styles.taglineDash} />
              <span style={styles.taglineText}>
                four lenses &middot; one question
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 90,
              mass: 1,
            }}
            style={styles.centered}
          >
            {/* Glass Card */}
            <GlassSurface
              blur={24}
              borderRadius={Card.borderRadius}
              shadow={Glass.shadow}
              animate={false}
              style={styles.card}
            >
              {/* Header */}
              <div style={styles.header}>
                <GlowText size={Typography.sizes.xl}>Tru</GlowText>
              </div>

              {/* Messages or empty state */}
              {messages.length === 0 ? (
                <div style={styles.emptyState}>
                  <GlowText size={28} breathe>
                    Tru
                  </GlowText>
                  <div style={styles.emptySubtitle}>
                    <span style={styles.emptyText}>
                      ask anything &middot; four perspectives
                    </span>
                  </div>
                </div>
              ) : (
                <MessageList messages={messages} isLoading={isLoading} />
              )}

              {/* Input */}
              <InputBar onSend={handleSend} disabled={isLoading} />
            </GlassSurface>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: Colors.background,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    position: "relative",
  },
  centered: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    zIndex: 1,
  },
  tagline: {
    display: "flex",
    alignItems: "center",
    gap: Spacing.sm,
  },
  taglineDash: {
    width: 16,
    height: 1,
    backgroundColor: Colors.textDim,
    display: "inline-block",
  },
  taglineText: {
    color: Colors.textDim,
    fontSize: 13,
    fontWeight: Typography.light,
    letterSpacing: 1.5,
  },
  card: {
    width: "100%",
    maxWidth: Card.maxWidth,
    height: Card.height,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: `${Spacing.lg}px ${Spacing.xl}px ${Spacing.md}px`,
    flexShrink: 0,
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  emptySubtitle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.textDim,
    fontSize: 13,
    fontWeight: Typography.light,
    letterSpacing: 1,
  },
};
