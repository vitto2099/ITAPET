import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function DetalhesPet() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Dados mockados para demonstração
  const pet = {
    id: id || '1',
    nome: 'Rex',
    especie: 'Cão - Labrador',
    bairro: 'Centro',
    status: 'Aprovado',
    dataCadastro: '12/03/2026',
    microchip: '900123456789',
    vacinas: [
      { id: '1', nome: 'Antirrábica', data: '15/03/2026', status: 'Aplicada' },
      { id: '2', nome: 'V10', data: '01/04/2026', status: 'Pendente' },
    ]
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

        <View style={styles.cardInfo}>
          <View style={styles.petProfile}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{pet.nome.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.petName}>{pet.nome}</Text>
              <View style={[styles.badge, pet.status === 'Aprovado' ? styles.badgeSuccess : styles.badgeWait]}>
                <Text style={styles.badgeText}>{pet.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Espécie</Text>
              <Text style={styles.detailValue}>{pet.especie}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bairro</Text>
              <Text style={styles.detailValue}>{pet.bairro}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cadastrado em</Text>
              <Text style={styles.detailValue}>{pet.dataCadastro}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Microchip</Text>
              <Text style={styles.detailValue}>{pet.microchip}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Vacinação</Text>
          {pet.vacinas.map((v, index) => (
            <View key={v.id} style={styles.vaccineItem}>
              <View style={styles.timeline}>
                <View style={[styles.dot, v.status === 'Aplicada' ? styles.dotActive : styles.dotInactive]} />
                {index !== pet.vacinas.length - 1 && <View style={styles.line} />}
              </View>
              <View style={styles.vaccineContent}>
                <Text style={styles.vaccineName}>{v.nome}</Text>
                <Text style={styles.vaccineDate}>{v.data} • {v.status}</Text>
              </View>
            </View>
          ))}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF' },
  backBtn: { marginRight: 15 },
  backBtnText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  cardInfo: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 20, elevation: 2 },
  petProfile: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  petName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginTop: 5 },
  badgeSuccess: { backgroundColor: '#E8F5E9' },
  badgeWait: { backgroundColor: '#FFF3E0' },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#2E7D32' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  detailItem: { width: '45%', marginBottom: 15 },
  detailLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
  vaccineItem: { flexDirection: 'row', marginBottom: 0 },
  timeline: { alignItems: 'center', marginRight: 15, width: 20 },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 1 },
  dotActive: { backgroundColor: '#2E7D32' },
  dotInactive: { backgroundColor: '#CCC' },
  line: { width: 2, flex: 1, backgroundColor: '#E0E0E0', marginVertical: 2 },
  vaccineContent: { flex: 1, paddingBottom: 25 },
  vaccineName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  vaccineDate: { fontSize: 14, color: '#666', marginTop: 2 },
  helpBtn: { margin: 20, padding: 15, alignItems: 'center' },
  helpBtnText: { color: '#2E7D32', fontWeight: '600' }
});
