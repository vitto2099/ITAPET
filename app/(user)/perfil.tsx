import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Perfil() {
  const router = useRouter();

  const handleSave = () => {
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JS</Text>
        </View>
        <Text style={styles.userName}>João Silva</Text>
        <Text style={styles.userRole}>Cidadão de Itaiópolis</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput value="João Silva" style={styles.input} />

        <Text style={styles.label}>CPF</Text>
        <TextInput value="123.456.789-00" style={styles.input} editable={false} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput value="joao.silva@email.com" style={styles.input} keyboardType="email-address" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput placeholder="(47) 99999-9999" style={styles.input} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Alterar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Excluir Minha Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 30, paddingTop: 60, backgroundColor: '#FFF' },
  backButton: { marginBottom: 15 },
  backButtonText: { color: '#2E7D32', fontWeight: '600', fontSize: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  profileSection: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#2E7D32' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  userRole: { fontSize: 14, color: '#666', marginTop: 4 },
  form: { padding: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#FFF', padding: 16, marginBottom: 20, borderRadius: 14, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  saveButton: { backgroundColor: '#2E7D32', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  dangerZone: { marginTop: 40, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 30 },
  outlineButton: { padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 15 },
  outlineButtonText: { color: '#666', fontWeight: 'bold' },
  deleteButton: { padding: 16, borderRadius: 14, alignItems: 'center' },
  deleteButtonText: { color: '#D32F2F', fontWeight: 'bold' }
});
