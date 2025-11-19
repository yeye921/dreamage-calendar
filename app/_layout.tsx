import { Stack } from "expo-router";
import { Provider as JotaiProvider } from "jotai";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <JotaiProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </JotaiProvider>
  );
}
