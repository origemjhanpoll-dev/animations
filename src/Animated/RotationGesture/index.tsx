import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  StyleSheet,
  Text,
  Pressable,
  ImageStyle,
  ImageSourcePropType,
} from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Svg, { Circle } from "react-native-svg";
import { colors, position, screen } from "../../Config";
import { Pivot } from "../../Components/Pivot";

const circle_length = 1000;
const r = circle_length / (2 * Math.PI);
const illustrationCount = [0, 1, 2, 3, 4, 5, 6];

export function RotationGesture() {
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = (rotation.value / Math.PI) * 180;
    return {
      transform: [{ rotateZ: `${rotate}deg` }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <Svg width={screen.width} height={screen.height}>
        <GestureDetector gesture={rotationGesture}>
          <Circle
            cx={screen.width / 2}
            cy={screen.height / 2}
            r={r}
            stroke="#2C2408"
            strokeWidth={30}
          />
        </GestureDetector>
        <Pivot
          x={position.init_screen_pivot.x}
          y={position.init_screen_pivot.y}
        />
      </Svg>
      <Animated.View style={[styles.container_image, animatedStyle]}>
        {illustrationCount.map((_, index) => {
          return <Illustration count={index} key={index} />;
        })}
      </Animated.View>
      <ResetPress
        onPress={() => {
          rotation.value = withSpring(0);
          savedRotation.value = withSpring(0);
        }}
      />
    </GestureHandlerRootView>
  );
}

const Illustration = ({
  style,
  count,
  source,
}: {
  style?: ImageStyle;
  count: number;
  source?: ImageSourcePropType;
}) => {
  return (
    <Animated.Image
      style={[
        style,
        styles.image,
        {
          transform: [
            { rotateZ: `${count * Math.PI * 180}deg` },
            { translateX: 5 },
            { translateY: -95 },
          ],
        },
      ]}
      source={source || require("../../Image/illustration1.png")}
    />
  );
};

//Reset settings position pan
const ResetPress = ({ onPress }: { onPress?(): void }) => {
  return (
    <Pressable style={styles.pressable} onPress={onPress}>
      <Text style={[styles.text]}>Reset rotation </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  container_image: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -10,
  },
  image: {
    width: 163,
    height: 304,
    position: "absolute",
  },
});
