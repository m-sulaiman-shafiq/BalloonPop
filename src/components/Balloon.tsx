import styles from "@/app/styles";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, Text, View } from "react-native";
import BalloonString from "./BalloonString";

const { height } = Dimensions.get("window");

export default function Balloon({ data, onEscape, onPop }: any) {
  const y = useRef(new Animated.Value(height + 120)).current;
  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(y, {
      toValue: -180,
      duration: data.duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onEscape(data.id);
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(sway, {
          toValue: -1,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const translateX = sway.interpolate({
    inputRange: [-1, 1],
    outputRange: [-14, 14],
  });

  return (
    <Pressable
      onPress={() => onPop(data)}
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
    >
      <Animated.View
        style={[
          styles.balloonWrap,
          {
            left: data.x,
            transform: [{ translateY: y }, { translateX }],
          },
        ]}
      >
        <View style={[styles.balloon, { backgroundColor: data.color }]}>
          <Text style={styles.face}>{data.emoji}</Text>
        </View>

        <View
          pointerEvents="none"
          style={[styles.neck, { backgroundColor: data.color }]}
        />

        <View
          pointerEvents="none"
          style={[styles.knot, { borderTopColor: data.color }]}
        />

        <BalloonString />

        <View pointerEvents="none" style={styles.string} />
      </Animated.View>
    </Pressable>
  );
}
