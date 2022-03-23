import React from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, Pressable, Text, View, ViewStyle } from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, cursor, pivot, position, screen } from "../../Config";
import { Pivot } from "../../Components/Pivot";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function PanGesture() {
  const translateX = useSharedValue(position.init_screen_cursor.x);
  const translateY = useSharedValue(position.init_screen_cursor.y);
  const moved = useSharedValue(false);
  const context = useSharedValue({ x: 0, y: 0 });

  const followX = useDerivedValue(() => {
    return withSpring(translateX.value);
  });
  const followY = useDerivedValue(() => {
    return withSpring(translateY.value);
  });

  //Reanimated animated styles
  const styleAnimatedCursor = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: followX.value }, { translateY: followY.value }],
    };
  });
  const styleAnimatedPress = useAnimatedStyle(() => ({
    bottom: moved.value ? withTiming(16) : withTiming(-100),
  }));

  //Creating the svg path
  const animatedPath = useAnimatedProps(() => {
    const path = `
    M ${position.init_screen.x} ${position.init_screen.y} 
    L ${followX.value + position.init_cursor}
     ${followY.value + position.init_cursor}
    `;
    return { d: path };
  });

  //Gesture Settings Pan
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = translationX + context.value.x;
      translateY.value = translationY + context.value.y;
    })
    .onEnd(() => {
      if (translateX.value != 0 || translateY.value != 0) moved.value = true;
    });

  return (
    <GestureHandlerRootView style={{ flex: 1, alignItems: "center" }}>
      <Svg width={screen.width} height={screen.height}>
        <Pivot
          x={position.init_screen.x - position.init_pivot}
          y={position.init_screen.y - position.init_pivot}
        />
        <GestureDetector gesture={gesture}>
          <Pointer style={styleAnimatedCursor} />
        </GestureDetector>
        <AnimatedPath
          animatedProps={animatedPath}
          fill="transparent"
          strokeWidth={5}
          strokeMiterlimit="10"
          strokeDasharray={10}
          stroke={colors.primary}
        />
      </Svg>
      <ResetPress
        style={styleAnimatedPress}
        onPress={() => {
          translateX.value = position.init_screen_cursor.x;
          translateY.value = position.init_screen_cursor.y;
          moved.value = false;
        }}
      />
    </GestureHandlerRootView>
  );
}

export const Pointer = ({ style }: { style?: ViewStyle }) => {
  return (
    <Animated.View style={[styles.cursor_container, style]}>
      <View style={styles.cursor} />
    </Animated.View>
  );
};

//Reset settings position pan
const ResetPress = ({
  style,
  onPress,
}: {
  style: ViewStyle;
  onPress(): void;
}) => {
  return (
    <Animated.View style={[style, styles.pressable]}>
      <Pressable style={{ padding: 16 }} onPress={onPress}>
        <Text style={[styles.text]}>Reset position</Text>
      </Pressable>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  text: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  pressable: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cursor_container: {
    width: cursor.size,
    height: cursor.size,
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: cursor.size,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  cursor: {
    width: cursor.size - 16,
    height: cursor.size - 16,
    backgroundColor: colors.primary,
    borderRadius: cursor.size - 16,
  },
});
