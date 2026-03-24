import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (email.toLowerCase().includes("admin")) {
      router.replace("/(admin)/dashboard");
    } else {
      router.replace("/(user)/home");
    }
  };

  return (
    <View style={styles.container}>
      {
        <Image
          source={require("../assets/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      }
      <Text style={styles.welcome}>ItaPet Itaiópolis</Text>

      <TextInput
        placeholder="E-mail"
        style={styles.input}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/cadastro")}>
        <Text style={styles.link}>Criar Conta Cidadão</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  logo: { width: 180, height: 180, alignSelf: "center", marginBottom: 10 },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2E7D32",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 25, textAlign: "center", color: "#666" },
});
