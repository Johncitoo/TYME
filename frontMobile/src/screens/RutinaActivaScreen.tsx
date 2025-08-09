// src/screens/RutinaActivaScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView,
  TouchableOpacity, Image, useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';
import * as Linking from 'expo-linking';

const BACKEND_URL = 'http://localhost:3000';

export default function RutinaActivaScreen() {
  const [rutina, setRutina] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDia, setSelectedDia] = useState<number | null>(null);
  const [completados, setCompletados] = useState<{ [key: number]: boolean }>({});
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const fetchRutina = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/rutinas/mi-rutina`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('No se pudo cargar la rutina');
      const data = await res.json();
      setRutina(data);
      if (data && data.rutinaEjercicios && data.rutinaEjercicios.length > 0) {
        const primerDia = Math.min(...data.rutinaEjercicios.map((ej: any) => ej.dia));
        setSelectedDia(primerDia);
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo cargar la rutina');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRutina(); }, []);

  if (loading)
    return <View style={styles.center}><ActivityIndicator size="large" color="#366ed4" /></View>;
  if (error || !rutina)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Sin rutina activa'}</Text>
        <TouchableOpacity style={styles.btnRecargar} onPress={fetchRutina}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );

  const ejerciciosPorDia: { [dia: number]: any[] } = {};
  rutina.rutinaEjercicios.forEach((ej: any) => {
    if (!ejerciciosPorDia[ej.dia]) ejerciciosPorDia[ej.dia] = [];
    ejerciciosPorDia[ej.dia].push(ej);
  });
  const dias = Object.keys(ejerciciosPorDia).map(Number).sort((a, b) => a - b);
  const ejerciciosDelDia = (selectedDia && ejerciciosPorDia[selectedDia]) || [];

  const toggleCompletado = (id: number) =>
    setCompletados(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <ScrollView style={[styles.container, isDark && { backgroundColor: '#191A1F' }]}>
      <Text style={[styles.titulo, isDark && { color: '#b8cefc' }]}>{rutina.nombre}</Text>
      <Text style={[styles.descripcion, isDark && { color: '#aaa' }]}>{rutina.descripcion || '—'}</Text>
      <Text style={[styles.fecha, isDark && { color: '#7ca8ee' }]}>Fecha inicio: {new Date(rutina.fecha_inicio).toLocaleDateString()}</Text>
      <View style={styles.selectorDias}>
        {dias.map(dia => (
          <TouchableOpacity
            key={dia}
            style={[styles.diaBtn, selectedDia === dia && styles.diaBtnSelected]}
            onPress={() => setSelectedDia(dia)}
          >
            <Text style={selectedDia === dia ? styles.diaBtnTextSelected : styles.diaBtnText}>
              Día {dia}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {ejerciciosDelDia.length === 0 ? (
        <Text style={styles.error}>No hay ejercicios para este día</Text>
      ) : (
        ejerciciosDelDia
          .sort((a, b) => a.orden - b.orden)
          .map((ej: any, idx: number) => (
            <View key={ej.id_rutina_ejercicio || idx} style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text style={styles.ejercicioNombre}>{ej.ejercicio.nombre}</Text>
                <CheckBox
                  checked={!!completados[ej.id_rutina_ejercicio]}
                  onPress={() => toggleCompletado(ej.id_rutina_ejercicio)}
                  containerStyle={{ marginLeft: 10, marginRight: 0, padding: 0 }}
                  checkedColor="#49C96D"
                  uncheckedColor="#bbb"
                />
              </View>
              <Text>
                <Text style={styles.bold}>Series:</Text> {ej.series}{'   '}
                <Text style={styles.bold}>Reps:</Text> {ej.repeticiones || '-'}{'   '}
                <Text style={styles.bold}>Peso:</Text> {ej.peso} kg{'   '}
                <Text style={styles.bold}>Descanso:</Text> {ej.descanso}s
              </Text>
              <Text>
                <Text style={styles.bold}>Grupo muscular:</Text> {ej.ejercicio.grupoMuscular?.nombre || '-'}
                {'  '}·{'  '}
                <Text style={styles.bold}>Tipo:</Text> {ej.ejercicio.tipoEjercicio?.nombre || '-'}
              </Text>
              {ej.ejercicio.video_url ? (
                <TouchableOpacity
                  style={styles.videoBtn}
                  onPress={() => Linking.openURL(ej.ejercicio.video_url)}
                >
                  <Text style={{ color: '#fff' }}>Ver video ▶️</Text>
                </TouchableOpacity>
              ) : null}
              {ej.ejercicio.imagen_url ? (
                <Image
                  source={{ uri: ej.ejercicio.imagen_url }}
                  style={styles.imgEjercicio}
                  resizeMode="cover"
                />
              ) : null}
              {ej.observacion ? (
                <Text style={styles.obs}><Text style={styles.bold}>Obs.:</Text> {ej.observacion}</Text>
              ) : null}
            </View>
          ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#f8f9fb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 2, color: '#275DAD' },
  descripcion: { fontSize: 15, color: '#555', marginBottom: 3 },
  fecha: { fontSize: 13, color: '#999', marginBottom: 14 },
  selectorDias: { flexDirection: 'row', marginBottom: 14, flexWrap: 'wrap' },
  diaBtn: { backgroundColor: '#e5e9f2', padding: 8, marginRight: 8, borderRadius: 7, marginBottom: 6 },
  diaBtnSelected: { backgroundColor: '#366ed4' },
  diaBtnText: { color: '#366ed4', fontWeight: 'bold' },
  diaBtnTextSelected: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  ejercicioNombre: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  bold: { fontWeight: 'bold' },
  obs: { marginTop: 2, fontStyle: 'italic', color: '#396' },
  error: { color: '#c00', textAlign: 'center', marginTop: 20, fontWeight: 'bold' },
  btnRecargar: {
    marginTop: 16,
    backgroundColor: '#366ed4',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  videoBtn: {
    backgroundColor: '#49C96D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  imgEjercicio: {
    width: 160,
    height: 110,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e5e9f2',
    alignSelf: 'center'
  },
});
