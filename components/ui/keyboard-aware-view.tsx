import { FC, useEffect, useState } from "react";
import { Keyboard, View } from "react-native";

export const KeyboardAwareView: FC = () => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const evt1 = Keyboard.addListener("keyboardDidShow", (evt) =>
      setHeight(evt.endCoordinates.height),
    );
    const evt2 = Keyboard.addListener("keyboardDidHide", (evt) =>
      setHeight(evt.endCoordinates.height),
    );
    return () => {
      evt1.remove();
      evt2.remove();
    };
  }, []);
  return <View style={{ height: height + 24, flexShrink: 0 }} />;
};
