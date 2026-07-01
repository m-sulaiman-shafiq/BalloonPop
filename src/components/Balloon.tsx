import styles from "@/app/styles";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    Text,
    View,
  } from "react-native";
import BalloonString from "./BalloonString";

const { height } = Dimensions.get("window");


export default function Balloon({ data, onEscape, onPop }: any) {
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
      ]),
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
      <Pressable onPress={() => onPop(data)}>
        <View style={[styles.balloon, { backgroundColor: data.color }]}>
          <Text style={styles.face}>{data.emoji}</Text>
        </View>
      </Pressable>
      <View style={[styles.neck, { backgroundColor: data.color }]} />
      <View style={[styles.knot, { borderTopColor: data.color }]} />
      <BalloonString />

      <View style={styles.string} />
    </Animated.View>
  );
}