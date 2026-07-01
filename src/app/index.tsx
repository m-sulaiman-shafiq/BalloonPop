import Balloon from "@/components/Balloon";
import { COLORS, FACES } from "@/components/utils";
import WelcomeScreen from "@/components/WelcomeScreen";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { ConfettiMethods, PIConfetti } from "react-native-fast-confetti";
import styles from "./styles";
import PartyBackground from "@/components/PartyBackground";

const { width, height } = Dimensions.get("window");

let nextBalloonId = 1;

export default function Home() {
  //background music code (birds, girl/man birthday)
  //background music (birds ambience + alternating birthday tracks)
  const TRACKS = [
    require("../../assets/birthday-girl.mp3"),
    require("../../assets/birthday-man.mp3"),
  ];

  const music = useRef(createAudioPlayer(TRACKS[0])).current;
  const trackIndex = useRef(0);

  const birds = useRef(
    createAudioPlayer(require("../../assets/birds.mp3"))
  ).current;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });

    // birds — continuous ambience, loops forever
    birds.loop = true;
    birds.volume = 0.08;
    birds.play();

    // girl/man — alternate on finish
    music.loop = false;
    music.volume = 0.2;
    music.play();

    const sub = music.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) {
        trackIndex.current = (trackIndex.current + 1) % TRACKS.length;
        music.replace(TRACKS[trackIndex.current]);
        music.volume = 0.2;
        music.play();
      }
    });

    return () => {
      sub.remove();
      music.pause();
      music.release();
      birds.pause();
      birds.release();
    };
  }, []);

  //balloon pop code
  const player = useRef(
    createAudioPlayer(require("../../assets/pop.mp3"))
  ).current;

  const [balloons, setBalloons] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const confettiRef = useRef<ConfettiMethods>(null);

  // blast point is now a prop, not a restart() argument
  const [blastPos, setBlastPos] = useState({ x: width / 2, y: height / 2 });
  const didMount = useRef(false);

  const removeBalloon = useCallback(
    (id: number) => setBalloons((prev) => prev.filter((b) => b.id !== id)),
    []
  );

  const popBalloon = useCallback(
    (balloon: any) => {
      player.seekTo(0);
      player.play();

      // move the origin; the effect below fires the burst
      setBlastPos({ x: balloon.x + 45, y: height / 2 });

      removeBalloon(balloon.id);
    },
    [player, removeBalloon]
  );

  // fire the burst after the new blastPosition prop is committed
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true; // skip the initial mount so nothing fires on load
      return;
    }
    confettiRef.current?.restart();
  }, [blastPos]);

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
    <>
      <View style={styles.screen}>
        <PartyBackground />

        {balloons.map((b) => (
          <Balloon
            key={b.id}
            data={b}
            onEscape={removeBalloon}
            onPop={popBalloon}
          />
        ))}

        <PIConfetti
          ref={confettiRef}
          autoplay={false}
          colors={COLORS}
          fadeOutOnEnd
        >
          <PIConfetti.Origin blastPosition={blastPos} count={80}>
            <PIConfetti.Flake size={12} radius={6} />
            <PIConfetti.Flake width={8} height={14} />
          </PIConfetti.Origin>
        </PIConfetti>
      </View>

      {showWelcome && <WelcomeScreen onFinish={() => setShowWelcome(false)} />}
    </>
  );
}
