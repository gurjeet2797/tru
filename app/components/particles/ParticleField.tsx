import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PARTICLE_COUNT = 50;

interface Particle {
  id: number;
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  driftX: number;
  driftY: number;
  period: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_W,
    y: Math.random() * SCREEN_H,
    r: 1 + Math.random() * 2,
    baseOpacity: 0.03 + Math.random() * 0.05,
    driftX: (Math.random() - 0.5) * 0.15,
    driftY: (Math.random() - 0.5) * 0.15,
    period: 3000 + Math.random() * 5000,
  }));
}

function ParticleDot({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);
  const posX = useSharedValue(particle.x);
  const posY = useSharedValue(particle.y);

  useEffect(() => {
    // Opacity oscillation
    progress.value = withRepeat(
      withTiming(1, {
        duration: particle.period,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    // Drift X
    const targetX =
      particle.driftX > 0
        ? SCREEN_W + particle.r
        : -particle.r;
    const distX = Math.abs(targetX - particle.x);
    const durationX = distX / Math.abs(particle.driftX) * 16;

    posX.value = withRepeat(
      withTiming(targetX, {
        duration: Math.min(durationX, 120000),
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Drift Y
    const targetY =
      particle.driftY > 0
        ? SCREEN_H + particle.r
        : -particle.r;
    const distY = Math.abs(targetY - particle.y);
    const durationY = distY / Math.abs(particle.driftY) * 16;

    posY.value = withRepeat(
      withTiming(targetY, {
        duration: Math.min(durationY, 120000),
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedOpacity = useDerivedValue(() => {
    const sine = Math.sin(progress.value * Math.PI);
    return particle.baseOpacity * (0.3 + 0.7 * sine);
  });

  const animatedProps = useAnimatedProps(() => ({
    cx: posX.value,
    cy: posY.value,
    opacity: animatedOpacity.value,
  }));

  return (
    <AnimatedCircle
      r={particle.r}
      fill="#FFFFFF"
      animatedProps={animatedProps}
    />
  );
}

export default function ParticleField() {
  const particles = useMemo(() => generateParticles(), []);

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width={SCREEN_W}
      height={SCREEN_H}
      pointerEvents="none"
    >
      {particles.map((p) => (
        <ParticleDot key={p.id} particle={p} />
      ))}
    </Svg>
  );
}
