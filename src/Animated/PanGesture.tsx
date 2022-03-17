import React from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, Dimensions } from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { width, height } = Dimensions.get("screen");

//Initial variables of element colors and sizes
const guide_size = width / 1.2;
const curso_size = guide_size / 4;
const guide_color = "#E4E5F0";
const color = "#5965D4";
const pivot_size = 10;

export function PanGesture() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const inBorder = useSharedValue(false);
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
  const styleAnimatedGuide = useAnimatedStyle(() => {
    return {
      borderWidth: inBorder.value ? withTiming(4) : withTiming(0),
    };
  });
  const styleAnimatedText = useAnimatedStyle(() => ({
    opacity: inBorder.value ? withDelay(800, withTiming(1)) : withTiming(0),
  }));

  //Creating the svg path
  const animatedProps = useAnimatedProps(() => {
    const path = `
    M ${width / 2} ${height / 2} 
    L ${followX.value + width / 2} ${followY.value + height / 2}
    `;
    return { d: path };
  });

  //Gesture Settings Pan and Tap
  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = translationX + context.value.x;
      translateY.value = translationY + context.value.y;

      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      if (distance > guide_size / 2 - curso_size / 2) {
        inBorder.value = true;
      } else {
        inBorder.value = false;
      }
    })
    .onEnd(() => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      if (distance < guide_size / 2 + curso_size / 2) {
        translateX.value = 0;
        translateY.value = 0;
        inBorder.value = false;
      }
    });
  const tap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      translateX.value = 0;
      translateY.value = 0;
      inBorder.value = false;
    });
  const gesture = Gesture.Race(pan, tap);

  return (
    <GestureHandlerRootView style={{ flex: 1, alignItems: "center" }}>
      <Animated.Text style={[styles.text, styleAnimatedText]}>
        Press double click for reset position
      </Animated.Text>
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.container}>
          <Animated.View style={[styles.guide, styleAnimatedGuide]} />
          <Svg width={width} height={height} style={styles.svg}>
            <AnimatedPath
              animatedProps={animatedProps}
              fill="transparent"
              strokeWidth={5}
              strokeMiterlimit="10"
              strokeDasharray={10}
              stroke={color}
            />
            <Circle
              x={width / 2 - pivot_size}
              y={height / 2 - pivot_size}
              cx={pivot_size}
              cy={pivot_size}
              r={pivot_size}
              fill={color}
            />
          </Svg>
          <Animated.View style={[styles.cursor, styleAnimatedCursor]} />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  guide: {
    position: "absolute",
    width: guide_size,
    height: guide_size,
    borderColor: color,
    backgroundColor: guide_color,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cursor: {
    width: curso_size,
    height: curso_size,
    backgroundColor: color,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  text: {
    position: "absolute",
    marginTop: 58,
    color: color,
    fontSize: 18,
    fontWeight: "700",
  },
});
