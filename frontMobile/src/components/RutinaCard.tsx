import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RutinaCard({
  rutina,
  esActual,
  onPress
}: {
  rutina: any,
  esActual?: boolean,
  onPress?: () => void
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.card, esActual && styles.cardActual]}>
        <Text style={[styles.title, esActual && styles.titleActual]}>
          {rutina.nombre}
          {esActual ? "  ⭐" : ""}
        </Text>
        <Text>Descripción: {rutina.descripcion}</Text>
        <Text>Fecha inicio: {rutina.fecha_inicio}</Text>
        {esActual && <Text style={styles.actualTag}>Rutina Actual</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2
  },
  cardActual: {
    backgroundColor: '#e6f7ff',
    borderColor: '#366ed4',
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  titleActual: {
    color: '#366ed4'
  },
  actualTag: {
    marginTop: 5,
    color: '#fff',
    backgroundColor: '#366ed4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    fontWeight: 'bold'
  }
});
