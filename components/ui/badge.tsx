import { Theme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { createContext, FC, useContext } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";
import { sv, VariantProps } from "style-variants";
import { Icon, IconProps } from "./icon";
import { Text, TextProps } from "./text";

const badgeVariants = (theme: Theme) =>
  sv({
    base: {
      borderRadius: 40,
      paddingHorizontal: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    variants: {
      variant: {
        default: {
          backgroundColor: theme.primary,
        },
        secondary: {
          backgroundColor: theme.secondary,
        },
      },
    },
  });

type BadgeVariantsProps = VariantProps<ReturnType<typeof badgeVariants>>;

const BadgeVariantsPropsContext = createContext<BadgeVariantsProps>(null!);
const useBadgeVariantsPropsContext = () =>
  useContext(BadgeVariantsPropsContext)!;

export const Badge: FC<TouchableOpacityProps & BadgeVariantsProps> = ({
  style,
  variant = "default",
  ...props
}) => {
  const theme = useTheme();
  return (
    <BadgeVariantsPropsContext.Provider value={{ style, variant }}>
      <TouchableOpacity
        style={badgeVariants(theme)({ style, variant })}
        {...props}
      />
    </BadgeVariantsPropsContext.Provider>
  );
};

const badgeTextVariants = (theme: Theme) =>
  sv({
    base: {
      paddingHorizontal: 4,
    },
    variants: {
      variant: {
        default: {
          color: theme.primaryForeground,
        },
        secondary: {
          color: theme.secondaryForeground,
        },
      },
    },
  });

export const BadgeText: FC<
  TextProps & VariantProps<ReturnType<typeof badgeTextVariants>>
> = ({ style, ...props }) => {
  const theme = useTheme();
  const { variant } = useBadgeVariantsPropsContext();
  return (
    <Text
      size="sm"
      weight="semiBold"
      style={badgeTextVariants(theme)({ style, variant })}
      {...props}
    />
  );
};

export const BadgeIcon: FC<IconProps> = (props) => (
  <Icon size={16} {...props} />
);

export const BadgeGroup: FC<ViewProps> = (props) => (
  <View
    style={{
      gap: 8,
      flex: 1,
      flexWrap: "wrap",
      flexDirection: "row",
    }}
    {...props}
  />
);
