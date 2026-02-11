import React, { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble, { Message } from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Spacing } from "../../constants/theme";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: Spacing.md,
        paddingTop: Spacing.xl,
        /* Custom scrollbar for glass aesthetic */
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.08) transparent",
      }}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      {isLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
