import styles from "@/app/styles";
import { View } from "react-native";

export default function BalloonString() {
  // a few short segments, alternating tilt → reads as a gentle curl
  const segments = [6, -8, 9, -7, 5];

  return (
    <View pointerEvents="none" style={styles.stringWrap}>
      {segments.map((deg, i) => (
        <View
          key={i}
          style={[styles.stringSeg, { transform: [{ rotate: `${deg}deg` }] }]}
        />
      ))}
    </View>
  );
}
