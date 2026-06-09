import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Custom navigation themes that match our design system
 */
const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A84FF',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1C1C1E',
    border: '#E5E5EA',
  },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#64D2FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#F5F5F7',
    border: '#38383A',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkNavTheme : LightNavTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#F2F2F7',
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="details/[id]"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'card',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
