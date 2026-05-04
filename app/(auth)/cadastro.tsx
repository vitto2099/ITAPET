import React from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Cadastro() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se à comunidade ItaPet</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput placeholder="Ex: João Silva" style={styles.input} />

          <Text style={styles.label}>CPF</Text>
          <TextInput placeholder="000.000.000-00" style={styles.input} keyboardType="numeric" />

          <Text style={styles.label}>E-mail</Text>
          <TextInput placeholder="seu@email.com" style={styles.input} keyboardType="email-address" />

          <Text style={styles.label}>Senha</Text>
          <TextInput placeholder="••••••••" style={styles.input} secureTextEntry />
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              alert('Cadastro realizado com sucesso!');
              router.back();
            }}
          >
            <Text style={styles.buttonText}>Finalizar Cadastro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, padding: 30, paddingTop: 60 },
  header: { marginBottom: 40 },
  backButton: { marginBottom: 20 },
  backButtonText: { color: '#2E7D32', fontWeight: '600', fontSize: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#2E7D32' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 4 },
  input: { 
    backgroundColor: '#F5F7F9', 
    padding: 16, 
    marginBottom: 20, 
    borderRadius: 14, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#E0E0E0' 
  },
  button: { 
    backgroundColor: '#2E7D32', 
    padding: 18, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }
});