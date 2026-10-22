import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { login, loginAsTest } = useAuth();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(identifier, password);
      // O useEffect cuidará do redirecionamento assim que o role for carregado
    } catch (error: any) {
      console.error(error);
      let message = "Ocorreu um erro ao entrar.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "E-mail, CPF ou senha incorretos.";
      }
      Alert.alert("Erro", message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>ItaPet</Text>
          <Text style={styles.tagline}>Cuidando dos animais de Itaiópolis</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail ou CPF</Text>
          <TextInput
            placeholder="seu@email.com ou 000.000.000-00"
            style={styles.input}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="••••••••"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={() => router.push("/(auth)/esqueci-senha")}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={() => router.push("/(auth)/cadastro")}
          >
            <Text style={styles.registerButtonText}>Criar Conta Cidadão</Text>
          </TouchableOpacity>

          <View style={styles.testSection}>
            <View style={styles.testHeaderRow}>
              <View style={styles.testDivider} />
              <Text style={styles.testBadgeText}>⚡ MODO DE TESTE</Text>
              <View style={styles.testDivider} />
            </View>

            <TouchableOpacity 
              style={styles.testCitizenButton} 
              onPress={() => loginAsTest('citizen')}
              activeOpacity={0.8}
            >
              <Text style={styles.testCitizenButtonText}>👤 Entrar como Teste Cidadão</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.testVetButton} 
              onPress={() => loginAsTest('admin')}
              activeOpacity={0.8}
            >
              <Text style={styles.testVetButtonText}>🩺 Entrar como TesteVet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
    borderRadius: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2E7D32",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F5F7F9",
    padding: 16,
    marginBottom: 20,
    borderRadius: 14,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#999",
    fontSize: 14,
  },
  registerButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  registerButtonText: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 16,
  },
  testSection: {
    marginTop: 30,
    paddingTop: 10,
  },
  testHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  testDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  testBadgeText: {
    marginHorizontal: 12,
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  testCitizenButton: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1.5,
    borderColor: "#A5D6A7",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  testCitizenButtonText: {
    color: "#1B5E20",
    fontWeight: "700",
    fontSize: 15,
  },
  testVetButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  testVetButtonText: {
    color: "#1E40AF",
    fontWeight: "700",
    fontSize: 15,
  },
});

