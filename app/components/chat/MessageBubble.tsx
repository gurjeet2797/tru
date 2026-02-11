import React from "react";
import { motion } from "framer-motion";
import LensTabs from "./LensTabs";
import ConfidenceBlock from "./ConfidenceBlock";
import SourcesPill from "./SourcesPill";
import ColorText from "../ui/ColorText";
import { Colors, Glass, Spacing, Typography, Radius } from "../../constants/theme";

interface Source {
  title: string;
  url: string;
}

interface Lenses {
  physics: string;
  math: string;
  human: string;
  contemplative: string;
}

interface Confidence {
  confident: string[];
  uncertain: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  lenses?: Lenses;
  confidence?: Confidence;
  sources?: Source[];
}

interface MessageBubbleProps {
  message: Message;
  showLensGuide?: boolean;
  isLastUserAndLoading?: boolean;
}

export default function MessageBubble({
  message,
  showLensGuide,
  isLastUserAndLoading,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        damping: 22,
        stiffness: 120,
        mass: 0.8,
      }}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: `${Spacing.xs}px ${Spacing.lg}px`,
      }}
    >
      <motion.div
        layout={false}
        initial={false}
        whileHover={{ scale: 1.005 }}
        animate={
          isLastUserAndLoading
            ? {
                borderColor: [
                  "rgba(255,255,255,0.07)",
                  "rgba(255,255,255,0.12)",
                  "rgba(255,255,255,0.07)",
                ],
              }
            : undefined
        }
        transition={
          isLastUserAndLoading
            ? { borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
            : { duration: 0.2 }
        }
        style={{
          maxWidth: "85%",
          borderRadius: Radius.lg,
          padding: `${Spacing.md}px ${Spacing.lg}px`,
          background: isUser ? Glass.bubbleUserBg : Glass.bubbleBg,
          backdropFilter: `blur(${Glass.blurLight}px)`,
          WebkitBackdropFilter: `blur(${Glass.blurLight}px)`,
          border: "1px solid",
          borderColor: Glass.border,
          borderBottomRightRadius: isUser ? Radius.sm : Radius.lg,
          borderBottomLeftRadius: isUser ? Radius.lg : Radius.sm,
        }}
      >
        <p
          style={{
            fontSize: Typography.sizes.body,
            lineHeight: "22px",
            color: Colors.textPrimary,
            fontWeight: isUser ? Typography.regular : Typography.light,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <ColorText
            text={typeof message.text === "string" ? message.text : ""}
            style={{ color: Colors.textPrimary }}
          />
        </p>

        {!isUser && message.lenses && (
          <LensTabs lenses={message.lenses} showLensGuide={showLensGuide} />
        )}

        {!isUser && message.confidence && (
          <ConfidenceBlock
            confident={message.confidence.confident}
            uncertain={message.confidence.uncertain}
          />
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesPill sources={message.sources} />
        )}
      </motion.div>
    </motion.div>
  );
}
