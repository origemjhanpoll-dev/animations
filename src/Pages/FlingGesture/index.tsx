import React from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, Pressable, View, ViewStyle } from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
  Directions,
} from "react-native-gesture-handler";
import { colors, cursor, pivot, position, screen } from "../../Config";

const rect_size = {
  w: screen.width - 32,
  h: 100,
};

export function FlingGesture() {
  const position = useSharedValue(0);

  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart((_) => {
      position.value = 100;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(position.value) }],
  }));

  const animatedStylePointer = useAnimatedStyle(() => ({
    transform: [
      { scale: position.value === 100 ? withSpring(1) : withSpring(0) },
    ],
    opacity: position.value === 100 ? withTiming(1) : withTiming(0),
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={flingGesture}>
        <View style={styles.flingRigth}>
          <Pointer
            onPress={() => (position.value = 0)}
            style={animatedStylePointer}
          />
          <Animated.View style={[styles.rectangle, animatedStyle]} />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const Pointer = ({
  onPress,
  style,
}: {
  onPress?(): void;
  style?: ViewStyle;
}) => {
  return (
    <Animated.View style={[styles.pressable, style]}>
      <Pressable style={styles.pointer_container} onPress={onPress}>
        <View style={styles.pointer} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rectangle: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    width: rect_size.w,
    height: rect_size.h,
    position: "relative",
    zIndex: -10,
    left: -30,
  },
  text: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  flingRigth: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressable: {
    width: 100 - 16,
    height: 100 - 16,
    position: "relative",
    left: 54,
  },
  pointer_container: {
    borderWidth: 4,
    padding: 8,
    borderColor: colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  pointer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
});
