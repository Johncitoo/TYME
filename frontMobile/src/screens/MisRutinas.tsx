import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMisRutinas } from '../services/clienteService';
import RutinaCard from '../components/RutinaCard';
import MenuCliente from '../components/MenuCliente';

export default function MisRutinas({ navigation }: any) {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
        const token = await AsyncStorage.getItem('token');
        if (!user.id_usuario || !token) throw new Error('No autenticado');
        const rutinasData = await getMisRutinas(token, user.id_usuario);
        setRutinas(rutinasData);
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
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Mis Rutinas</Text>
      {loading && <ActivityIndicator />}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <FlatList
        data={rutinas}
        keyExtractor={item => String(item.id_rutina)}
        renderItem={({ item }) => <RutinaCard rutina={item} />}
      />
    </View>
  );
}
