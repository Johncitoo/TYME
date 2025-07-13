// screens/RutinaActivaScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Button, StyleSheet, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.105:3000';

export default function RutinaActivaScreen({ navigation }: { navigation: any }) {
  const [rutina, setRutina] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }
        // Busca la rutina activa del cliente
        const res = await fetch(`${BACKEND_URL}/rutinas/mi-rutina`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRutina(data);
      } catch (err) {
        setError('No se pudo cargar la rutina');
      } finally {
        setLoading(false);
      }
    };
    fetchRutina();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" /><Text>Cargando rutina…</Text></View>
    );
  }

  if (error || !rutina) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error || 'Rutina no encontrada'}</Text>
      </View>
    );
  }

  // Agrupa ejercicios por día
  const ejerciciosPorDia: Record<string, any[]> = {};
  (rutina.rutinaEjercicios || []).forEach((ej: any) => {
    if (!ejerciciosPorDia[ej.dia]) ejerciciosPorDia[ej.dia] = [];
    ejerciciosPorDia[ej.dia].push(ej);
  });

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.rutinaNombre}>{rutina.nombre || 'Sin nombre'}</Text>
        <Text style={styles.rutinaDesc}>{rutina.descripcion || '—'}</Text>
        <Text style={styles.rutinaFecha}>Fecha inicio: {rutina.fecha_inicio ? (new Date(rutina.fecha_inicio)).toLocaleDateString() : '—'}</Text>

        {Object.entries(ejerciciosPorDia).map(([dia, lista]) => (
          <View key={dia} style={styles.diaBlock}>
            <Text style={styles.diaTitulo}>Día {dia}</Text>
            {lista.sort((a, b) => a.orden - b.orden).map((ej, idx) => (
              <View key={ej.id_rutina_ejercicio || idx} style={styles.ejercicioBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ejercicioNombre}>{ej.ejercicio?.nombre || 'Ejercicio sin nombre'}</Text>
                  <Text>
                    <Text style={styles.bold}>Series:</Text> {ej.series}   <Text style={styles.bold}>Peso:</Text> {ej.peso} kg   <Text style={styles.bold}>Descanso:</Text> {ej.descanso}s
                  </Text>
                  {ej.observacion ? <Text style={styles.ejercicioObs}>Obs: {ej.observacion}</Text> : null}
                  <Text style={styles.ejercicioMusculo}>
                    {(ej.ejercicio?.grupoMuscular?.nombre || '—')} · {(ej.ejercicio?.tipoEjercicio?.nombre || '—')}
                  </Text>
                </View>
                {ej.ejercicio?.video_url ?
                  <Button
                    title="Ver video ▶"
                    onPress={() => {
                      Linking.openURL(ej.ejercicio.video_url);
                    }}
                  />
                  : null
                }
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#f4f6fa' },
  container: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  rutinaNombre: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, color: '#254292' },
  rutinaDesc: { fontSize: 16, color: '#445', marginBottom: 4 },
  rutinaFecha: { fontSize: 13, color: '#888', marginBottom: 14 },
  diaBlock: { marginBottom: 18 },
  diaTitulo: { fontSize: 21, fontWeight: '600', marginVertical: 8, color: '#3250c6' },
  ejercicioBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, elevation: 2, shadowColor: '#0002', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, flexDirection: 'row', alignItems: 'center' },
  ejercicioNombre: { fontSize: 17, fontWeight: 'bold', color: '#183270', marginBottom: 1 },
  bold: { fontWeight: 'bold' },
  ejercicioObs: { marginTop: 1, color: '#666', fontStyle: 'italic' },
  ejercicioMusculo: { marginTop: 3, color: '#555', fontSize: 13 },
});
