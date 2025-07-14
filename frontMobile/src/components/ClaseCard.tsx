import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

type Props = {
  clase: any;
  inscrito?: boolean;
  cuposOcupados: number;
  onInscribir?: () => void;
  onCancelar?: () => void;
};

export default function ClaseCard({ clase, inscrito, cuposOcupados, onInscribir, onCancelar }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.card, isDark && { backgroundColor: '#222', borderColor: '#2a446c' }]}>
      <Text style={[styles.title, isDark && { color: '#b8cefc' }]}>{clase.nombre}</Text>
      <Text style={{ color: isDark ? '#aaa' : '#333' }}>Fecha: {clase.fecha_clase}</Text>
      <Text style={{ color: isDark ? '#aaa' : '#333' }}>Hora: {clase.hora_inicio} - {clase.hora_fin}</Text>
      <Text style={{ color: isDark ? '#aaa' : '#333' }}>Entrenador: {clase.entrenador?.usuario?.nombre || clase.entrenador?.nombre || 'N/A'}</Text>
      <Text style={{ color: isDark ? '#aaa' : '#333' }}>Cupos: {cuposOcupados} / {clase.cupo_maximo}</Text>

      {inscrito ? (
        <TouchableOpacity style={styles.btnCancelar} onPress={onCancelar}>
          <Text style={styles.btnCancelarText}>CANCELAR INSCRIPCIÓN</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.btnInscribir, cuposOcupados >= clase.cupo_maximo ? styles.btnDeshabilitado : null]}
          onPress={onInscribir}
          disabled={cuposOcupados >= clase.cupo_maximo}
        >
          <Text style={styles.btnInscribirText}>
            {cuposOcupados >= clase.cupo_maximo ? 'CLASE LLENA' : 'INSCRIBIRSE'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14, marginBottom: 12, borderRadius: 10, backgroundColor: '#fff', elevation: 2, borderWidth: 1, borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  btnInscribir: { backgroundColor: '#366ed4', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  btnInscribirText: { color: '#fff', fontWeight: 'bold' },
  btnCancelar: { backgroundColor: '#d32f2f', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  btnCancelarText: { color: '#fff', fontWeight: 'bold' },
  btnDeshabilitado: { backgroundColor: '#ccc' },
});
