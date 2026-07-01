import { useEffect, useRef } from "react";
import { Dimensions, View } from "react-native";
import styles from "@/app/styles";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

type Props = {
  onFinish?: () => void;
  duration?: number; // total ms on screen (default 2800)
};

function FloatingEmoji({ emoji, x, delay }: { emoji: string; x: number; delay: number }) {
  const y = useSharedValue(60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(delay, withTiming(-140, { duration: 1400, easing: Easing.out(Easing.quad) }));
    opacity.value = withSequence(
      withDelay(delay, withTiming(1, { duration: 250 })),
      withDelay(900, withTiming(0, { duration: 400 }))
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return <Animated.Text style={[styles.floatEmoji, { left: x }, style]}>{emoji}</Animated.Text>;
}

export default function WelcomeScreen({ onFinish, duration = 2800 }: Props) {
  const screenOpacity = useSharedValue(1);
  const cakeScale = useSharedValue(0);
  const cakeRot = useSharedValue(0);
  const titleY = useSharedValue(24);
  const titleOpacity = useSharedValue(0);

  // fire onFinish exactly once, even if the effect runs twice (Strict Mode)
  const finished = useRef(false);
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onFinish?.();
  };

  useEffect(() => {
    const FADE = 350;

    // entrance
    cakeScale.value = withSpring(1, { damping: 9, stiffness: 150 });
    cakeRot.value = withDelay(
      300,
      withSequence(
        withTiming(-0.06, { duration: 150 }),
        withTiming(0.06, { duration: 300 }),
        withTiming(0, { duration: 150 })
      )
    );
    titleOpacity.value = withDelay(220, withTiming(1, { duration: 350 }));
    titleY.value = withDelay(220, withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }));

    // hold, then fade — dismissal is tied to THIS animation finishing
    screenOpacity.value = withDelay(
      Math.max(0, duration - FADE),
      withTiming(0, { duration: FADE }, (done) => {
        if (done) runOnJS(finish)();
      })
    );
  }, []);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const cakeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cakeScale.value }, { rotate: `${cakeRot.value}rad` }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <View style={styles.glow} />

      <FloatingEmoji emoji="🎈" x={width * 0.18} delay={120} />
      <FloatingEmoji emoji="🎉" x={width * 0.45} delay={200} />
      <FloatingEmoji emoji="🎈" x={width * 0.72} delay={260} />

      <Animated.Text style={[styles.cake, cakeStyle]}>🎂</Animated.Text>
      <Animated.Text style={[styles.title, titleStyle]}>Happy Birthday!</Animated.Text>
    </Animated.View>
  );
}