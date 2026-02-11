import { useEffect, useRef } from "react";

interface ParticlesProps {
  particleCount?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  alphaParticles?: boolean;
  connectDistance?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  phase: number;
  oscSpeed: number;
  color: string;
}

function createParticles(
  w: number,
  h: number,
  count: number,
  baseSize: number,
  sizeRandom: number,
  colors: string[]
): Particle[] {
  return Array.from({ length: count }, () => {
    const r = baseSize * (1 + (Math.random() - 0.5) * sizeRandom);
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.max(0.5, r),
      baseAlpha: 0.25 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      oscSpeed: 0.15 + Math.random() * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const int = parseInt(hex, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export default function Particles({
  particleCount = 120,
  speed = 0.08,
  particleColors = ["#ffffff", "#cccccc", "#888888"],
  moveParticlesOnHover = true,
  particleBaseSize = 2,
  sizeRandomness = 0.8,
  alphaParticles = true,
  connectDistance = 100,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
      if (particles.current.length === 0) {
        particles.current = createParticles(
          window.innerWidth,
          window.innerHeight,
          particleCount,
          particleBaseSize,
          sizeRandomness,
          particleColors
        );
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    if (moveParticlesOnHover) {
      window.addEventListener("mousemove", handleMouse);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    let time = 0;

    const draw = () => {
      time += 0.016 * speed * 10;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const pts = particles.current;

      // Update + draw particles
      for (const p of pts) {
        // Mouse repulsion
        if (moveParticlesOnHover) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx += (dx / dist) * force * 0.3;
            p.vy += (dy / dist) * force * 0.3;
          }
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Oscillating alpha
        const alpha = alphaParticles
          ? p.baseAlpha * (0.4 + 0.6 * Math.sin(time * p.oscSpeed + p.phase))
          : p.baseAlpha;

        const [cr, cg, cb] = hexToRgb(p.color);

        // Soft glow
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.r * 3
        );
        gradient.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
        gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha * 0.9})`;
        ctx.fill();
      }

      // Draw connections
      if (connectDistance > 0) {
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectDistance) {
              const lineAlpha = (1 - dist / connectDistance) * 0.08;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animId.current = requestAnimationFrame(draw);
    };

    animId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover) {
        window.removeEventListener("mousemove", handleMouse);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [
    particleCount,
    speed,
    moveParticlesOnHover,
    particleBaseSize,
    sizeRandomness,
    alphaParticles,
    connectDistance,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: moveParticlesOnHover ? "auto" : "none",
        zIndex: 0,
      }}
    />
  );
}
