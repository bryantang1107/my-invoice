import { tamaguiConfig } from '@/tamagui.config';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}
