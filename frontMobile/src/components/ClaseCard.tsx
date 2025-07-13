// src/components/ClaseCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ClaseCard({ clase }: { clase: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{clase.nombre}</Text>
      <Text>Fecha: {clase.fecha_clase}</Text>
      <Text>Hora: {clase.hora_inicio} - {clase.hora_fin}</Text>
      <Text>Entrenador: {clase.entrenador_nombre || 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14, marginBottom: 12, borderRadius: 10, backgroundColor: '#fff', elevation: 2
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 }
});
