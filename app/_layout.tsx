import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutNav() {
  const { user, role, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const atRoot = (segments as any).length === 0 || (segments[0] as any) === '(index)' || (segments[0] as any) === 'index';

    if (!user && !inAuthGroup) {
      // Se não está logado e não está na pasta de auth, vai para o login
      router.replace('/(auth)/login');
    } else if (user && (inAuthGroup || atRoot)) {
      // Se está logado e tenta acessar login ou raiz, redireciona pelo papel
      if (role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(user)/home');
      }
    }
  }, [user, role, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/cadastro" />
      <Stack.Screen name="(auth)/esqueci-senha" />
      <Stack.Screen name="(user)/home" />
      <Stack.Screen name="(user)/detalhes-pet" />
      <Stack.Screen name="(admin)/dashboard" />
      <Stack.Screen name="(admin)/editar-pet" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}