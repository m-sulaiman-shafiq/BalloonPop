import { Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

// festive bunting colors
const FLAGS = ["#FF6B9D", "#FFD93D", "#6BCB77", "#4D96FF", "#FF9F45", "#9B5DE5"];
const flagCount = Math.ceil(width / 34) + 1;

// a few faint static confetti dots for texture
const DOTS = [
  { top: "14%", left: "12%", color: "#FF6B9D" },
  { top: "22%", left: "80%", color: "#4D96FF" },
  { top: "38%", left: "28%", color: "#FFD93D" },
  { top: "46%", left: "68%", color: "#6BCB77" },
  { top: "60%", left: "16%", color: "#9B5DE5" },
  { top: "68%", left: "84%", color: "#FF9F45" },
] as const;

export default function PartyBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* sky → warm ground gradient */}
      <LinearGradient
        colors={["#BFE3FF", "#E8F4FF", "#FFF1C9"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* faint confetti specks */}
      {DOTS.map((d, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { top: d.top, left: d.left, backgroundColor: d.color },
          ]}
        />
      ))}

      {/* bunting garland across the top */}
      <View style={styles.bunting}>
        {Array.from({ length: flagCount }).map((_, i) => (
          <View
            key={i}
            style={[styles.flag, { borderTopColor: FLAGS[i % FLAGS.length] }]}
          />
        ))}
      </View>
      <View style={styles.buntingString} />
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.35,
  },
  bunting: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 3,
  },
  flag: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 22, // downward triangle = hanging flag
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  buntingString: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
});