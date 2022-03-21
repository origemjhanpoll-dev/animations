import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const screen = {
  width: width,
  height: height,
};

export const cursor = {
  size: 80,
};
export const pivot = {
  size: cursor.size / 4,
};

export const position = {
  init_cursor: cursor.size / 2,
  init_pivot: pivot.size / 2,
  init_screen: {
    x: screen.width / 2,
    y: screen.height / 2,
  },
  init_screen_cursor: {
    x: screen.width / 2 - cursor.size / 2,
    y: screen.height / 2 - cursor.size / 2,
  },
  init_screen_pivot: {
    x: screen.width / 2 - pivot.size / 2,
    y: screen.height / 2 - pivot.size / 2,
  },
};

export const colors = { black: "#1F1F1F", yellow: "#fff232", red: "#FF3232" };
