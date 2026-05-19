import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import { Registration } from '../../src/types/pet';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/styles/home.styles';

export default function HomeUser() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [meusPets, setMeusPets] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Cidadão');

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().nome || 'Cidadão');
        }
      }
    };
    fetchUserName();
  }, [user]);

  const fetchMeusPets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, "registrations"),
        where("userId", "==", user.uid),
        orderBy("criadoEm", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      
      setMeusPets(data);
    } catch (error) {
      console.error("Erro ao buscar meus pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeusPets();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.greeting}>Olá, {userName.split(' ')[0]}! 👋</Text>
            <Text style={styles.sub}>Itaiópolis - SC</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.push('/(user)/perfil')} style={{ marginRight: 15 }}>
              <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logout()}>
              <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <Text style={styles.sectionTitle}>Meus Animais</Text>
        <TouchableOpacity onPress={() => router.push('/(user)/ajuda')}>
          <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>❓ Ajuda</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={meusPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.petCard}>
              <View>
                <Text style={styles.petName}>{item.nomeAnimal}</Text>
                <Text style={item.status === 'aprovado' ? styles.statusOk : styles.statusWait}>
                  {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pendente'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity 
                  style={[styles.editBtn, { marginRight: 8, borderColor: '#1976D2' }]}
                  onPress={() => router.push({ pathname: '/(user)/editar-meu-pet' as any, params: { id: item.id } })}
                >
                  <Text style={{ color: '#1976D2' }}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.editBtn}
                  onPress={() => router.push({ pathname: '/(user)/detalhes-pet', params: { id: item.id } })}
                >
                  <Text style={{ color: '#2E7D32' }}>Ver</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Nenhum animal cadastrado.</Text>
          }
          onRefresh={fetchMeusPets}
          refreshing={loading}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(user)/cadastrar-pet')}
      >
        <Text style={styles.fabText}>+ Cadastrar Novo Pet</Text>
      </TouchableOpacity>
    </View>
  );
}
