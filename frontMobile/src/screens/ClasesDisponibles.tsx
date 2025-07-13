import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClasesDisponibles } from '../services/clienteService';
import ClaseCard from '../components/ClaseCard';
import MenuCliente from '../components/MenuCliente';

export default function ClasesDisponibles({ navigation }: any) {
  const [clases, setClases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const clasesData = await getClasesDisponibles(token || '');
        setClases(clasesData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <MenuCliente navigation={navigation} />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Clases Disponibles</Text>
      {loading && <ActivityIndicator />}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <FlatList
        data={clases}
        keyExtractor={item => String(item.id_clase)}
        renderItem={({ item }) => <ClaseCard clase={item} />}
      />
    </View>
  );
}
