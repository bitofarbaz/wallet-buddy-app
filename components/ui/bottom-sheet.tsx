import { useTheme } from "@/hooks/use-theme";
import PrimitiveBottomSheet, {
  BottomSheetBackdrop as PrimitiveBottomSheetBackdrop,
  BottomSheetProps as PrimitiveBottomSheetProps,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { ComponentProps, FC, RefObject } from "react";
import { Keyboard, View, ViewProps } from "react-native";
import { Text, TextProps } from "./text";

export type BottomSheetRef = PrimitiveBottomSheet;

export const BottomSheetBackdrop: FC<
  ComponentProps<typeof PrimitiveBottomSheetBackdrop>
> = (props) => <PrimitiveBottomSheetBackdrop {...props} />;

export type BottomSheetProps = PrimitiveBottomSheetProps & {
  ref?: RefObject<PrimitiveBottomSheet>;
};
export const BottomSheet: FC<BottomSheetProps> = (props) => {
  const theme = useTheme();
  return (
    <Portal>
      <PrimitiveBottomSheet
        bottomInset={1}
        enableDynamicSizing
        enablePanDownToClose
        keyboardBlurBehavior="restore"
        keyboardBehavior="interactive"
        onClose={() => {
          Keyboard.dismiss();
        }}
        containerStyle={{ paddingBottom: 48 }}
        handleIndicatorStyle={{ backgroundColor: theme.mutedForeground }}
        handleStyle={{
          backgroundColor: theme.card,
          borderTopLeftRadius: theme.radius,
          borderTopRightRadius: theme.radius,
        }}
        backgroundStyle={{
          backgroundColor: theme.card,
          borderTopLeftRadius: theme.radius,
          borderTopRightRadius: theme.radius,
        }}
        index={-1}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
          />
        )}
        {...props}
      />
    </Portal>
  );
};

export const DetachedBottomSheet: FC<BottomSheetProps> = (props) => (
  <BottomSheet
    detached
    bottomInset={48}
    containerStyle={{ marginHorizontal: 16 }}
    {...props}
  />
);

export const BottomSheetHeader: FC<ViewProps> = (props) => (
  <View style={{ gap: 8, paddingHorizontal: 16 }} {...props} />
);

export const BottomSheetTitle: FC<TextProps> = (props) => (
  <Text size="lg" weight="semiBold" {...props} />
);

export const BottomSheetDescription: FC<TextProps> = (props) => (
  <Text color="mutedForeground" {...props} />
);
