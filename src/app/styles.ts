import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#FFF1C9", overflow: "hidden" },
    balloonWrap: { position: "absolute", alignItems: "center" },
    balloon: {
      width: 90,
      height: 80, // equal → perfect circle base
      borderRadius: 40, // half of width → fully round
      backgroundColor: "#FF1B6B", // per-balloon via data.color
      alignItems: "center",
      justifyContent: "center",
      transform: [{ scaleY: 1.25 }], // stretch vertically → prolate spheroid
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 3 },
    },
    neck: {
      width: 12,
      height: 10,
      backgroundColor: "#FF1B6B",
      alignSelf: "center",
      marginTop: -4,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
    face: {
      fontSize: 44,
      transform: [{ scaleY: 1 / 1.25 }], // 0.8 → cancels the parent's vertical stretch
    },
    knot: {
      width: 10,
      height: 10,
      alignSelf: "center",
      marginTop: -3,
      transform: [{ rotate: "45deg" }],
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
  export default styles;