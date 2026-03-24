import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Registre as telas principais, não os grupos com parênteses */}
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/cadastro" />
      <Stack.Screen name="(user)/home" />
      <Stack.Screen name="(admin)/dashboard" />
    </Stack>
  );
}