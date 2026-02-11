import React from "react";
import { motion } from "framer-motion";

// Pastel color map for color words
const COLOR_MAP: Record<string, string> = {
  red: "#FF8A8A",
  orange: "#FFB87A",
  yellow: "#FFE57A",
  green: "#8AE6A2",
  blue: "#8AC4FF",
  purple: "#C48AFF",
  violet: "#C48AFF",
  pink: "#FFB3D9",
  cyan: "#8AE8E8",
  teal: "#7AD4C8",
  magenta: "#FF8AD8",
  indigo: "#A08AFF",
  gold: "#FFD97A",
  silver: "#C8D0D8",
  white: "#E8E8E8",
  black: "#8A8A8A",
  brown: "#C4A882",
  gray: "#B0B0B0",
  grey: "#B0B0B0",
  crimson: "#FF7A8A",
  scarlet: "#FF7A6E",
  maroon: "#CC8A8A",
  navy: "#8A9ECC",
  turquoise: "#7AD8D0",
  coral: "#FF9E8A",
  salmon: "#FFA08A",
  lavender: "#C8A8FF",
  amber: "#FFCC6E",
  lime: "#B8E87A",
  olive: "#B8C88A",
  aqua: "#8AE8E8",
  rose: "#FFA0B8",
  peach: "#FFCCA8",
  mint: "#8AE8C0",
  ivory: "#E8E0D0",
  beige: "#D8C8A8",
  tan: "#D8C0A0",
  chartreuse: "#C0E87A",
  plum: "#D08ACA",
  mauve: "#D8A0CC",
  lilac: "#CCA8E0",
};

// Build a regex that matches any color word (case insensitive, whole word)
const colorWords = Object.keys(COLOR_MAP);
const colorRegex = new RegExp(
  `\\b(${colorWords.join("|")})\\b`,
  "gi"
);

interface ColorTextProps {
  text: string;
  style?: React.CSSProperties;
}

export default function ColorText({ text, style }: ColorTextProps) {
  const parts = splitByColors(text);

  return (
    <span style={style}>
      {parts.map((part, i) =>
        part.color ? (
          <motion.span
            key={i}
            initial={{ color: style?.color || "#F0F0F0" }}
            animate={{ color: part.color }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            style={{
              display: "inline",
              textShadow: `0 0 8px ${part.color}40`,
            }}
          >
            {part.text}
          </motion.span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}

interface TextPart {
  text: string;
  color?: string;
}

function splitByColors(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let lastIndex = 0;

  // Reset regex state
  colorRegex.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = colorRegex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) });
    }

    // The color word
    const word = match[0];
    const color = COLOR_MAP[word.toLowerCase()];
    parts.push({ text: word, color });

    lastIndex = match.index + word.length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  return parts;
}
