import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { theme } from '../src/config/theme';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="item/[id]" options={{ title: 'Détails', headerBackTitle: 'Retour' }} />
        <Stack.Screen name="auth" options={{ title: 'Connexion', presentation: 'modal' }} />
        <Stack.Screen name="publish" options={{ title: 'Nouvelle Annonce', presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
