import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
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
              Este cadastro não possui bairro vinculado. O tutor deve procurar a Secretaria de Saúde para atualizar as informações, se necessário.
            </Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <View style={styles.petProfile}>
            <View style={styles.avatarPlaceholder}>
              {pet.fotoUrl ? (
                <Image source={{ uri: pet.fotoUrl }} style={{ width: '100%', height: '100%', borderRadius: 30 }} />
              ) : (
                <Text style={{ fontSize: 30 }}>{getEmoji(pet.especie)}</Text>
              )}
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
          <Text style={styles.sectionTitle}>Documentação e Fotos</Text>
          <View style={{ marginTop: 10 }}>
            {pet.fotosPet && pet.fotosPet.length > 0 ? (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.detailLabel}>Fotos do Pet</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
                  {pet.fotosPet.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={{ width: 150, height: 150, borderRadius: 10, marginRight: 10 }} />
                  ))}
                </ScrollView>
              </View>
            ) : pet.fotoUrl ? (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.detailLabel}>Foto do Pet</Text>
                <Image source={{ uri: pet.fotoUrl }} style={{ width: 150, height: 150, borderRadius: 10, marginTop: 5 }} />
              </View>
            ) : null}
            
            {pet.carteiraUrl && (
              <View>
                <Text style={styles.detailLabel}>Carteirinha</Text>
                <Image source={{ uri: pet.carteiraUrl }} style={{ width: 200, height: 150, borderRadius: 10, marginTop: 5, resizeMode: 'cover' }} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico / Vacinas</Text>
          {pet.vacinas && pet.vacinas.length > 0 ? (
            pet.vacinas.map((vacina, idx) => (
              <View key={idx} style={styles.vaccineItem}>
                <View style={styles.timeline}>
                  <View style={[styles.dot, styles.dotActive]} />
                </View>
                <View style={styles.vaccineContent}>
                  <Text style={styles.vaccineName}>{vacina.nome}</Text>
                  <Text style={styles.vaccineDate}>{vacina.data} • Concluído</Text>
                  {vacina.fotoUrl && (
                    <Image source={{ uri: vacina.fotoUrl }} style={{ width: 60, height: 60, borderRadius: 8, marginTop: 5 }} />
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.vaccineItem}>
              <View style={styles.timeline}>
                <View style={[styles.dot, { backgroundColor: '#ccc' }]} />
              </View>
              <View style={styles.vaccineContent}>
                <Text style={styles.vaccineName}>Nenhuma vacina registrada</Text>
                <Text style={styles.vaccineDate}>Aguardando lançamento oficial</Text>
              </View>
            </View>
          )}
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

