import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Cadastro() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Cidadão</Text>
      <TextInput placeholder="Nome Completo" style={styles.input} />
      <TextInput placeholder="CPF" style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="E-mail" style={styles.input} />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Finalizar Cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#2E7D32' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 10 },
  button: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});