import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  card: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#FFA000'
  },
  petName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 13, color: '#666', marginTop: 2 },
  actions: { flexDirection: 'row', marginLeft: 10 },
  btn: { width: 45, height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  btnCheck: { backgroundColor: '#E8F5E9' },
  btnReject: { backgroundColor: '#FFEBEE' },
  btnText: { fontSize: 18 }
});
