import React from "react";
import { motion } from "framer-motion";
import LensTabs from "./LensTabs";
import ConfidenceBlock from "./ConfidenceBlock";
import SourcesPill from "./SourcesPill";
import ColorText from "../ui/ColorText";
import { Colors, Glass, Spacing, Typography, Radius, Animation } from "../../constants/theme";

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
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={Animation.spring}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: `${Spacing.xs}px ${Spacing.lg}px`,
      }}
    >
      <div
        style={{
          maxWidth: "85%",
          borderRadius: Radius.lg,
          padding: `${Spacing.md}px ${Spacing.lg}px`,
          background: isUser ? Glass.bubbleUserBg : Glass.bubbleBg,
          backdropFilter: `blur(${Glass.blurLight}px)`,
          WebkitBackdropFilter: `blur(${Glass.blurLight}px)`,
          border: `1px solid ${Glass.border}`,
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
          }}
        >
          <ColorText text={message.text} style={{ color: Colors.textPrimary }} />
        </p>

        {!isUser && message.lenses && <LensTabs lenses={message.lenses} />}

        {!isUser && message.confidence && (
          <ConfidenceBlock
            confident={message.confidence.confident}
            uncertain={message.confidence.uncertain}
          />
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesPill sources={message.sources} />
        )}
      </div>
    </motion.div>
  );
}
