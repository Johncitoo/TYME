import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClasesDisponibles, inscribirAClase, cancelarAsistencia, getMisAsistencias } from '../services/clienteService';
import ClaseCard from '../components/ClaseCard';
import MenuCliente from '../components/MenuCliente';

export default function ClasesDisponibles({ navigation }: any) {
  const [clases, setClases] = useState<any[]>([]);
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = (await AsyncStorage.getItem('token')) || '';
      if (!token) throw new Error('No autenticado');
      const clasesData = await getClasesDisponibles(token);
      const asistenciasData = await getMisAsistencias(token);
      setClases(clasesData);
      setAsistencias(asistenciasData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const ahora = new Date();

  const clasesFiltradas = clases.filter(clase => {
    const fechaHoraFin = new Date(`${clase.fecha_clase}T${clase.hora_fin}`);
    return fechaHoraFin > ahora;
  });

  const handleInscribir = async (claseId: number) => {
    try {
      const token = (await AsyncStorage.getItem('token')) || '';
      await inscribirAClase(token, claseId);
      Alert.alert('¡Listo!', 'Te inscribiste a la clase');
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo inscribir');
    }
  };

  const handleCancelar = async (idAsistencia: number) => {
    try {
      const token = (await AsyncStorage.getItem('token')) || '';
      await cancelarAsistencia(token, idAsistencia);
      Alert.alert('¡Listo!', 'Cancelaste tu inscripción');
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cancelar');
    }
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#366ed4" /></View>;
  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#c00' }}>{error}</Text>
      <TouchableOpacity onPress={fetchData} style={{ backgroundColor: '#366ed4', padding: 10, borderRadius: 6, marginTop: 12 }}>
        <Text style={{ color: '#fff' }}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <MenuCliente navigation={navigation} />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Clases Disponibles</Text>
      <FlatList
        data={clasesFiltradas}
        keyExtractor={item => String(item.id_clase)}
        renderItem={({ item: clase }) => {
          const cuposOcupados = clase.cupos_ocupados || 0;
          const miAsistencia = asistencias.find((a: any) => a.clase?.id_clase === clase.id_clase);
          return (
            <ClaseCard
              clase={clase}
              inscrito={!!miAsistencia}
              cuposOcupados={cuposOcupados}
              onInscribir={() => handleInscribir(clase.id_clase)}
              onCancelar={miAsistencia ? () => handleCancelar(miAsistencia.id_asistencia) : undefined}
            />
          );
        }}
      />
    </View>
  );
}
