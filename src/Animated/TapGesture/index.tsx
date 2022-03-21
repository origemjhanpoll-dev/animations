import React, { useRef, useState } from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import { colors, cursor, pivot, position, screen } from "../../Config";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function TapGesture() {
  const translateX = useSharedValue(position.init_screen_cursor.x);
  const translateY = useSharedValue(position.init_screen_cursor.y);

  const followX = useDerivedValue(() => {
    return withSpring(translateX.value);
  });
  const followY = useDerivedValue(() => {
    return withSpring(translateY.value);
  });

  const styleAnimatedCursor = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: followX.value }, { translateY: followY.value }],
    };
  });

  const animatedPath = useAnimatedProps(() => {
    const path = `
    M ${position.init_screen.x} ${pivot.size * 4 + position.init_pivot} 
    L ${followX.value + position.init_cursor}
     ${followY.value + position.init_cursor}
    L ${position.init_screen.x} ${screen.height - pivot.size * 4}
    `;
    return { d: path };
  });

  //Gesture Settings Tap
  const singleTap = Gesture.Tap().onStart((event) => {
    translateX.value = event.x - cursor.size / 2;
    translateY.value = event.y - cursor.size / 2;
  });
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        translateX.value = position.init_screen_cursor.x;
        translateY.value = position.init_screen_cursor.y;
      }
    });

  const gesture = Gesture.Exclusive(doubleTap, singleTap);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Svg width={screen.width} height={screen.height}>
          <Pointer style={styleAnimatedCursor} />
          <AnimatedPath
            animatedProps={animatedPath}
            fill="transparent"
            strokeWidth={5}
            strokeMiterlimit="10"
            strokeDasharray={10}
            stroke={colors.black}
          />
        </Svg>
      </GestureDetector>
      <Pivot x={position.init_screen_pivot.x} y={pivot.size * 4} />
      <Pivot
        x={position.init_screen_pivot.x}
        y={screen.height - pivot.size * 4}
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

const Pivot = ({ x, y }: { x: number; y: number }) => {
  return (
    <View
      style={[
        styles.pivot,
        {
          transform: [{ translateX: x }, { translateY: y }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  pivot: {
    position: "absolute",
    backgroundColor: colors.red,
    width: pivot.size,
    height: pivot.size,
    borderRadius: cursor.size,
  },
  cursor_container: {
    width: cursor.size,
    height: cursor.size,
    borderWidth: 4,
    borderRadius: cursor.size,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  cursor: {
    width: cursor.size - 16,
    height: cursor.size - 16,
    backgroundColor: colors.black,
    borderRadius: cursor.size - 16,
  },
});
