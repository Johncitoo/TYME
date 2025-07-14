import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMisAsistencias } from '../services/clienteService';
import MenuCliente from '../components/MenuCliente';
import ClaseCard from '../components/ClaseCard';

export default function DashboardInicioCliente({ navigation }: any) {
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = (await AsyncStorage.getItem('token')) || '';
      if (!token) throw new Error('No autenticado');
      const asistenciasData = await getMisAsistencias(token);
      setAsistencias(asistenciasData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const ahora = new Date();
  const clasesFuturas = asistencias.filter(a => {
    if (!a.clase) return false;
    const fechaHora = new Date(`${a.clase.fecha_clase}T${a.clase.hora_inicio}`);
    return fechaHora > ahora;
  });

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
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Tus clases próximas</Text>
      <FlatList
        data={clasesFuturas}
        keyExtractor={item => String(item.id_asistencia)}
        renderItem={({ item }) => item.clase ? (
          <ClaseCard
            clase={item.clase}
            inscrito={true}
            cuposOcupados={item.clase.cupos_ocupados || 0}
            // Puedes agregar onCancelar aquí si lo deseas
          />
        ) : null}
      />
    </View>
  );
}
