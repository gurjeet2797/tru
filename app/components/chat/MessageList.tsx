import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageBubble, { Message } from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Spacing } from "../../constants/theme";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstAssistantWithLenses = messages.find(
    (m) => m.role === "assistant" && m.lenses
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  return (
    <motion.div
      animate={
        isLoading
          ? {
              opacity: [1, 0.97, 1],
            }
          : undefined
      }
      transition={
        isLoading
          ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: Spacing.md,
        paddingTop: Spacing.xl,
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.08) transparent",
      }}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showLensGuide={
              !!firstAssistantWithLenses && msg.id === firstAssistantWithLenses.id
            }
            isLastUserAndLoading={
              isLoading && msg.role === "user" && i === messages.length - 1
            }
          />
        ))}
      </AnimatePresence>

      {isLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </motion.div>
  );
}
