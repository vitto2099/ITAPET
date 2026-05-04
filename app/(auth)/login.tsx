import React, { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Simulação de login
    if (email.toLowerCase().includes("admin")) {
      router.replace("/(admin)/dashboard");
    } else {
      router.replace("/(user)/home");
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
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            placeholder="seu@email.com"
            style={styles.input}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
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
});

