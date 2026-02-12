import { FC, PropsWithChildren, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const Spin: FC<PropsWithChildren> = ({ children }) => {
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = withRepeat(
      withTiming(360, { duration: 1_000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${value.value}deg` }],
  }));
  return <Animated.View style={animatedStyles}>{children}</Animated.View>;
};
