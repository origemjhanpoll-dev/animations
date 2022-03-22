import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, pivot } from "../../Config";

export const Pivot = ({
  x,
  y,
  style,
}: {
  x: number;
  y: number;
  style?: ViewStyle;
}) => {
  return (
    <View
      style={[
        styles.pivot,
        style,
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
    backgroundColor: colors.tertiary,
    width: pivot.size,
    height: pivot.size,
    borderRadius: pivot.size,
  },
});
