import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import REGISTROS_HISTORICOS from '../../src/constants/registros_historicos.json';
import { Registration } from '../../src/types/pet';
import { styles } from '../../src/styles/detalhes-pet.styles';

export default function DetalhesPet() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPetDetails = async () => {
    setLoading(true);
    try {
      if (id && id.toString().length > 10) {
        const docRef = doc(db, "registrations", id.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPet({ id: docSnap.id, ...docSnap.data() } as Registration);
          setLoading(false);
          return;
        }
      }

      const localPet = REGISTROS_HISTORICOS.find(p => p.id === id);
      if (localPet) {
        setPet({ ...localPet, status: 'concluido' } as any);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#2E7D32" style={{marginTop: 100}} /></View>;
  if (!pet) return <View style={styles.container}><Text style={{textAlign: 'center', marginTop: 50}}>Animal não encontrado.</Text></View>;

  const getEmoji = (especie?: string) => {
    const e = especie?.toLowerCase();
    if (e?.includes('canino') || e?.includes('cachorro') || e?.includes('cão')) return '🐶';
    if (e?.includes('felino') || e?.includes('gato')) return '🐱';
    return '🐾';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Ficha do Animal</Text>
        </View>

        {(!pet.bairro || pet.id.length < 5) && (
          <View style={styles.migrationAlert}>
            <Text style={styles.migrationAlertTitle}>⚠️ Registro Migrado do Sistema Antigo</Text>
            <Text style={styles.migrationAlertText}>
              Este cadastro não possui bairro ou CPF vinculado. O tutor deve procurar a Secretaria de Saúde para atualizar as informações.
            </Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <View style={styles.petProfile}>
            <View style={styles.avatarPlaceholder}>
              <Text style={{ fontSize: 30 }}>{getEmoji(pet.especie)}</Text>
            </View>
            <View>
              <Text style={styles.petName}>{pet.nomeAnimal}</Text>

              <View style={[styles.badge, (pet.status === 'aprovado' || pet.status === 'concluido') ? styles.badgeSuccess : styles.badgeWait]}>
                <Text style={styles.badgeText}>
                  {pet.status ? pet.status.charAt(0).toUpperCase() + pet.status.slice(1) : 'Histórico'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Espécie</Text>
              <Text style={styles.detailValue}>{pet.especie || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Raça</Text>
              <Text style={styles.detailValue}>{pet.raca || 'SRD'}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bairro</Text>
              <Text style={styles.detailValue}>{pet.bairro || 'Itaiópolis'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Data do Registro</Text>
              <Text style={styles.detailValue}>{pet.dataProc || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Microchip</Text>
              <Text style={styles.detailValue}>{pet.microchip || 'Pendente'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tutor</Text>
              <Text style={styles.detailValue}>{pet.nomeTutor || 'Não informado'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico / Vacinas</Text>
          <View style={styles.vaccineItem}>
            <View style={styles.timeline}>
              <View style={[styles.dot, styles.dotActive]} />
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineName}>Procedimento Inicial</Text>
              <Text style={styles.vaccineDate}>{pet.dataProc || 'Data não disponível'} • Concluído</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.helpBtn}
          onPress={() => router.push('/(user)/ajuda')}
        >
          <Text style={styles.helpBtnText}>Precisa de ajuda com este pet?</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

