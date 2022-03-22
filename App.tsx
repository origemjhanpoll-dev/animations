import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { PanGesture, TapGesture, PinchGesture } from "./src";
import { colors } from "./src/Config";
import "react-native-gesture-handler";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* <PanGesture /> */}
      {/* <TapGesture /> */}
      <PinchGesture />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
});
