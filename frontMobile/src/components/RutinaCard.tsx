// src/components/RutinaCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RutinaCard({ rutina }: { rutina: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{rutina.nombre}</Text>
      <Text>Descripción: {rutina.descripcion}</Text>
      <Text>Fecha inicio: {rutina.fecha_inicio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14, marginBottom: 12, borderRadius: 10, backgroundColor: '#fff', elevation: 2
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 }
});
