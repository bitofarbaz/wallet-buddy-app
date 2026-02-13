import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { Profile } from "@/types/api";
import { FC, ReactNode } from "react";
import { Image, View } from "react-native";

export const ListItemProfile: FC<{
  profile: Profile;
  selected?: boolean;
  end?: ReactNode;
  secondaryText?: string;
}> = ({ profile, selected, secondaryText, end }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingBlock: 8,
        flexDirection: "row",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius,
          ...(selected
            ? { backgroundColor: theme.primary }
            : {
                backgroundColor: theme.secondary,
              }),
        }}
      >
        {selected ? (
          <Icon name="check" size={32} />
        ) : (
          <Image
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            source={{
              uri: `https://api.dicebear.com/9.x/initials/png?seed=${profile.name}`,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text weight="semiBold">{profile.name}</Text>
        <Text color="mutedForeground">
          {secondaryText ? secondaryText : `#${profile.id.slice(-4)}`}
        </Text>
      </View>
      {end}
    </View>
  );
};
