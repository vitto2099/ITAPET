import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../src/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';

export default function Perfil() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para edição
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setNome(data.nome || '');
          setTelefone(data.telefone || '');
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!nome) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user?.uid || ''), {
        nome: nome,
        telefone: telefone
      });
      Alert.alert("Sucesso", "Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

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
          <Text style={styles.avatarText}>{getInitials(nome)}</Text>
        </View>
        <Text style={styles.userName}>{nome || 'Usuário'}</Text>
        <Text style={styles.userRole}>
          {userData?.role === 'admin' ? 'Veterinário(a) Autorizado(a)' : 'Cidadão de Itaiópolis'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput 
          value={nome} 
          onChangeText={setNome}
          style={styles.input} 
          placeholder="Seu nome completo"
        />

        <Text style={styles.label}>CPF</Text>
        <TextInput 
          value={userData?.cpf || 'Não informado'} 
          style={[styles.input, { backgroundColor: '#F0F0F0', color: '#888' }]} 
          editable={false} 
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput 
          value={user?.email || ''} 
          style={[styles.input, { backgroundColor: '#F0F0F0', color: '#888' }]} 
          editable={false}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput 
          placeholder="(47) 99999-9999" 
          value={telefone}
          onChangeText={setTelefone}
          style={styles.input} 
          keyboardType="phone-pad" 
        />

        <TouchableOpacity 
          style={[styles.saveButton, isUpdating && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.outlineButton} onPress={() => logout()}>
            <Text style={[styles.outlineButtonText, { color: '#D32F2F' }]}>Sair da Conta</Text>
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
