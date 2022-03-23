import {
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
  Text,
  Image,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, cursor, illustration } from "../../Config";

export function PinchGesture() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const follow = useDerivedValue(() => {
    return withSpring(scale.value);
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: follow.value }],
  }));
  const animatedImage = useAnimatedStyle(() => ({
    bottom: withSpring(interpolate(scale.value, [1, 4], [-260, -60])),
  }));

  const gesture = Gesture.Pinch()
    .onUpdate((event) => {
      if (scale.value <= 4) scale.value = savedScale.value * event.scale;
    })
    .onEnd((_) => {
      if (scale.value >= 4) scale.value = scale.value - 0.5;
      savedScale.value = scale.value;
    });

  return (
    <GestureHandlerRootView style={{ flex: 1, alignItems: "center" }}>
      <GestureDetector gesture={gesture}>
        <Pointer style={animatedStyle} />
      </GestureDetector>
      <Animated.Image
        style={[styles.image1, animatedImage]}
        source={illustration.plant1}
      />
      <Animated.Image
        style={[styles.image2, animatedImage]}
        source={illustration.plant2}
      />
      <ResetPress
        onPress={() => {
          scale.value = 1;
          savedScale.value = 1;
        }}
      />
    </GestureHandlerRootView>
  );
}

export const Pointer = ({ style }: { style?: ViewStyle }) => {
  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[styles.cursor_container, style]}>
        <View style={styles.cursor} />
      </Animated.View>
    </Animated.View>
  );
};

//Reset settings position pan
const ResetPress = ({ onPress }: { onPress?(): void }) => {
  return (
    <Pressable style={styles.pressable} onPress={onPress}>
      <Text style={[styles.text]}>Reset scale</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  cursor_container: {
    width: cursor.size * 2,
    height: cursor.size * 2,
    borderWidth: 4,
    borderRadius: cursor.size,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cursor: {
    width: cursor.size * 2 - 16 * 2,
    height: cursor.size * 2 - 16 * 2,
    backgroundColor: colors.primary,
    borderRadius: cursor.size * 2 - 16 * 2,
  },
  pressable: {
    borderRadius: 16,
    borderWidth: 2,
    bottom: 16,
    position: "absolute",
    padding: 16,
    borderColor: colors.primary,
    alignSelf: "center",
  },
  text: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  image1: {
    width: 120,
    height: 220,
    position: "absolute",
    left: 26,
  },
  image2: {
    width: 180,
    height: 220,
    position: "absolute",
    bottom: -40,
    right: 10,
  },
});
