import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "../components/particles/Particles";
import GlassSurface from "../components/ui/GlassSurface";
import MessageList from "../components/chat/MessageList";
import InputBar from "../components/chat/InputBar";
import GlowText from "../components/ui/GlowText";
import useChat from "../hooks/useChat";
import { Colors, Glass, Card, Spacing, Typography } from "../constants/theme";

const QUICK_ASK = [
  "Why is the sky blue?",
  "What is consciousness?",
  "Why do we dream?",
  "What happens when we die?",
  "Is time real?",
];

function getCardSize(hasMessages: boolean) {
  if (typeof window === "undefined") return { w: 520, h: 680 };
  const isLarge = window.innerWidth >= 900;
  if (hasMessages && isLarge) {
    return {
      w: Math.min(800, window.innerWidth * 0.9),
      h: Math.min(750, window.innerHeight * 0.88),
    };
  }
  return {
    w: Math.min(520, window.innerWidth * 0.95),
    h: Math.min(680, window.innerHeight * 0.9),
  };
}

export default function ChatScreen() {
  const { messages, isLoading, send } = useChat();
  const [showSplash, setShowSplash] = useState(true);
  const hasMessages = messages.length > 0;
  const [cardSize, setCardSize] = useState(() => getCardSize(hasMessages));

  useEffect(() => {
    const update = () => setCardSize(getCardSize(messages.length > 0));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [messages.length]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (text: string) => {
    if (showSplash) setShowSplash(false);
    send(text);
  };

  return (
    <div style={styles.root}>
      <Particles
        particleCount={80}
        speed={0.02}
        particleColors={["#aaaaaa", "#999999", "#888888"]}
        moveParticlesOnHover
        alphaParticles
        particleBaseSize={2.2}
        sizeRandomness={0.6}
        connectDistance={90}
      />

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6 }}
            style={styles.centered}
          >
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
                Michael
              </GlowText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
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
              transition={{ duration: 0.6, delay: 1.8 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={styles.centered}
          >
            <motion.div
              layout
              initial={{ width: 280, height: 360, opacity: 0 }}
              animate={{
                width: cardSize.w,
                height: cardSize.h,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 80,
                mass: 1,
              }}
              style={styles.cardOuter}
            >
              <GlassSurface
                blur={24}
                borderRadius={Card.borderRadius}
                shadow={Glass.shadow}
                animate={false}
                background="rgba(255,255,255,0.07)"
                style={styles.card}
              >
                <div style={styles.header}>
                  <GlowText size={Typography.sizes.xl}>Michael</GlowText>
                </div>

                {messages.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptySubtitle}>
                      <span style={styles.emptyText}>
                        ask anything &middot; four perspectives
                      </span>
                    </div>
                    <div style={styles.quickAsk}>
                      {QUICK_ASK.map((q, i) => (
                        <motion.button
                          key={q}
                          onClick={() => handleSend(q)}
                          disabled={isLoading}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.3 + i * 0.08,
                            duration: 0.4,
                          }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          style={styles.quickAskPill}
                        >
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <MessageList messages={messages} isLoading={isLoading} />
                )}

                <InputBar onSend={handleSend} disabled={isLoading} />
              </GlassSurface>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed",
    inset: 0,
    width: "100%",
    minHeight: "100dvh",
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
  cardOuter: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    width: "100%",
    height: "100%",
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
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
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
  quickAsk: {
    display: "flex",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
    marginTop: Spacing.lg,
    maxWidth: 400,
  },
  quickAskPill: {
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    borderRadius: 20,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.regular,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
