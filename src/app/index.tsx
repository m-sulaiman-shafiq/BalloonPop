import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = [
  "#FF1B6B",
  "#00C2FF",
  "#FFD500",
  "#7B2FFF",
  "#00D26A",
  "#FF7A00",
  "#FF4FD8",
];
const FACES = ["🦸", "🦸‍♀️", "🤖", "🦄", "🐲", "👽", "🧙", "🐱", "🐭", "🦇"];

let nextId = 1;

function BalloonString() {
  // a few short segments, alternating tilt → reads as a gentle curl
  const segments = [6, -8, 9, -7, 5];
  return (
    <View style={styles.stringWrap}>
      {segments.map((deg, i) => (
        <View
          key={i}
          style={[styles.stringSeg, { transform: [{ rotate: `${deg}deg` }] }]}
        />
      ))}
    </View>
  );
}

function Balloon({ data, onEscape }: any) {
  const y = useRef(new Animated.Value(height + 120)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(y, {
      toValue: -180,
      duration: data.duration,
      useNativeDriver: true,
    }).start(({ finished }) => finished && onEscape(data.id));

    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: -1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = sway.interpolate({
    inputRange: [-1, 1],
    outputRange: [-14, 14],
  });

  return (
    <Animated.View
      style={[
        styles.balloonWrap,
        { left: data.x, transform: [{ translateY: y }, { translateX }] },
      ]}
    >
      <View style={[styles.balloon, { backgroundColor: data.color }]}>
        <Text style={styles.face}>{data.emoji}</Text>
      </View>
      <View style={[styles.knot, { borderTopColor: data.color }]} />
      <BalloonString />

      <View style={styles.string} />
    </Animated.View>
  );
}

export default function Home() {
  const [balloons, setBalloons] = useState<any[]>([]);

  useEffect(() => {
    const spawn = () => {
      setBalloons((prev) => [
        ...prev,
        {
          id: nextId++,
          emoji: FACES[Math.floor(Math.random() * FACES.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x: 12 + Math.random() * (width - 110), // random horizontal spot
          duration: 9000 + Math.random() * 5000, // 9–14s, each different
        },
      ]);
    };

    spawn(); // one immediately
    const t = setInterval(spawn, 1300); // a new one every 1.3s
    return () => clearInterval(t);
  }, []);

  const removeBalloon = useCallback(
    (id: number) => setBalloons((prev) => prev.filter((b) => b.id !== id)),
    []
  );

  return (
    <View style={styles.screen}>
      {balloons.map((b) => (
        <Balloon key={b.id} data={b} onEscape={removeBalloon} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF1C9", overflow: "hidden" },
  balloonWrap: { position: "absolute", alignItems: "center" },
  balloon: {
    width: 86,
    height: 106,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  face: { fontSize: 48 },
  knot: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    alignSelf: "center",
    marginTop: -1,
  },
  string: {
    width: 1.5,
    height: 34,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignSelf: "center",
  },
  stringWrap: { alignItems: "center", marginTop: -1 },
  stringSeg: {
    width: 2,
    height: 9,
    backgroundColor: "rgba(0,0,0,0.28)",
    borderRadius: 2,
    marginTop: -1, // overlap slightly so segments connect
  },
});
