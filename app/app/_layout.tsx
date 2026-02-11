import { useEffect } from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";

const webSafeAreaStyles = `
  html, body { background: #000 !important; margin: 0; min-height: 100%; }
  html { -webkit-tap-highlight-color: transparent; }
`;

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute("content", "#000000");
      } else {
        const m = document.createElement("meta");
        m.name = "theme-color";
        m.content = "#000000";
        document.head.appendChild(m);
      }
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport && !viewport.getAttribute("content")?.includes("viewport-fit")) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1, viewport-fit=cover"
        );
      }
    }
  }, []);

  return (
    <>
      {Platform.OS === "web" && (
        <style dangerouslySetInnerHTML={{ __html: webSafeAreaStyles }} />
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
          animation: "fade",
        }}
      />
    </>
  );
}
