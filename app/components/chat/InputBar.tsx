import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Colors, Glass, Spacing, Radius, Typography, Animation } from "../../constants/theme";

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function InputBar({ onSend, disabled }: InputBarProps) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = text.trim().length > 0 && !disabled;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 64) + "px";
  }, [text]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div style={{ padding: `${Spacing.xs}px ${Spacing.lg}px ${Spacing.md}px` }}>
      <motion.div
        animate={{
          borderColor: focused ? Glass.borderFocus : Glass.border,
          boxShadow: focused
            ? "0 0 20px rgba(255,255,255,0.04)"
            : "0 0 0px rgba(255,255,255,0)",
        }}
        transition={{ duration: Animation.normal }}
        style={{
          display: "flex",
          alignItems: "center",
          background: Glass.inputBg,
          backdropFilter: `blur(${Glass.blur}px)`,
          WebkitBackdropFilter: `blur(${Glass.blur}px)`,
          borderRadius: Radius.xl,
          border: `1px solid ${Glass.border}`,
          paddingLeft: Spacing.lg,
          paddingRight: Spacing.sm,
          paddingTop: Spacing.xs,
          paddingBottom: Spacing.xs,
          minHeight: 40,
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Michael anything..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: Colors.textPrimary,
            fontSize: Typography.sizes.body,
            fontWeight: Typography.regular,
            fontFamily: "inherit",
            resize: "none",
            maxHeight: 64,
            lineHeight: "22px",
            padding: "6px 0 2px 0",
          }}
        />

        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.08 } : undefined}
          whileTap={canSend ? { scale: 0.92 } : undefined}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: Spacing.xs,
            background: canSend ? "rgba(255,255,255,0.08)" : "transparent",
            border: "none",
            cursor: canSend ? "pointer" : "default",
            outline: "none",
            transition: "background 0.2s ease",
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke={canSend ? Colors.accent : Colors.textDim}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}
