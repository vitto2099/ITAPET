import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleRecuperar = () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, digite seu e-mail.");
      return;
    }
    Alert.alert(
      "E-mail Enviado",
      "Se este e-mail estiver cadastrado, você receberá um link de recuperação em breve.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Senha 🔐</Text>
          <Text style={styles.subtitle}>
            Digite seu e-mail abaixo e enviaremos as instruções para você criar uma nova senha.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail de Cadastro</Text>
          <TextInput
            placeholder="seu@email.com"
            style={styles.input}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button} onPress={handleRecuperar}>
            <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar para o Login</Text>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
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
    marginBottom: 30,
    borderRadius: 14,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  backButton: {
    padding: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
});
