import { COLORS, FACES } from "@/components/utils";
import { createAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import styles from "./styles";
import Balloon from "@/components/Balloon";

const { width, height } = Dimensions.get("window");

let nextBalloonId = 1;
let nextConfettiId = 1;

export default function Home() {
  const player = useRef(
    createAudioPlayer(require("../../assets/pop.mp3"))
  ).current;
  const [balloons, setBalloons] = useState<any[]>([]);
  const [confetti, setConfetti] = useState<any[]>([]);

  const removeBalloon = useCallback(
    (id: number) => setBalloons((prev) => prev.filter((b) => b.id !== id)),
    []
  );

  const removeConfetti = useCallback(
    (id: number) => setConfetti((prev) => prev.filter((c) => c.id !== id)),
    []
  );

  const popBalloon = useCallback(
    (balloon: any) => {
      player.seekTo(0);
      player.play();

      setConfetti((prev) => [
        ...prev,
        { id: nextConfettiId++, x: balloon.x + 45, y: height / 2 },
      ]);

      removeBalloon(balloon.id);
    },
    [player, removeBalloon]
  );

  useEffect(() => {
    const spawn = () => {
      setBalloons((prev) => [
        ...prev,
        {
          id: nextBalloonId++,
          emoji: FACES[Math.floor(Math.random() * FACES.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x: 12 + Math.random() * (width - 110),
          duration: 9000 + Math.random() * 5000,
        },
      ]);
    };

    spawn();
    const t = setInterval(spawn, 1300);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.screen}>
      {balloons.map((b) => (
        <Balloon
          key={b.id}
          data={b}
          onEscape={removeBalloon}
          onPop={popBalloon}
        />
      ))}

      {confetti.map((c) => (
        <ConfettiCannon
          key={c.id}
          count={80}
          origin={{ x: c.x, y: c.y }}
          fadeOut
          onAnimationEnd={() => removeConfetti(c.id)}
        />
      ))}
    </View>
  );
}