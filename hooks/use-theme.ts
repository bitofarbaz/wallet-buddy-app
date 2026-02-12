import { Theme, themes } from "@/config/theme";
import { useColorScheme } from "react-native";

export const useTheme = (): Theme => themes[useColorScheme() || "dark"];
