import { useState, useCallback, useRef } from "react";
import { sendMessage, ChatApiResponse } from "../services/api";
import { Message } from "../components/chat/MessageBubble";

let messageCounter = 0;
function nextId(): string {
  return `msg_${Date.now()}_${++messageCounter}`;
}

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const previousResponseId = useRef<string | null>(null);

  const send = useCallback(async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: nextId(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response: ChatApiResponse = await sendMessage(
        text,
        previousResponseId.current
      );

      previousResponseId.current = response.response_id;

      const mainText =
        typeof response.main_text === "string" ? response.main_text : "";
      const assistantMsg: Message = {
        id: nextId(),
        role: "assistant",
        text: mainText,
        lenses: response.lenses,
        confidence: response.confidence,
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: nextId(),
        role: "assistant",
        text:
          err instanceof Error
            ? `Connection error: ${err.message}`
            : "Something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    previousResponseId.current = null;
  }, []);

  return { messages, isLoading, send, reset };
}
