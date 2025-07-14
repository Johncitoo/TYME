import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RutinaCard from '../components/RutinaCard';
import MenuCliente from '../components/MenuCliente';
import { getMisRutinas } from '../services/clienteService';

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

  // Rutina actual: la de fecha_inicio más reciente
  let idRutinaActual: number | null = null;
  if (rutinas.length > 0) {
    idRutinaActual = rutinas.reduce((maxId, r) =>
      new Date(r.fecha_inicio) > new Date(rutinas.find(x => x.id_rutina === maxId)?.fecha_inicio)
        ? r.id_rutina
        : maxId, rutinas[0].id_rutina);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <MenuCliente navigation={navigation} />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Mis Rutinas</Text>
      {loading && <ActivityIndicator />}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {idRutinaActual &&
        <Button
          title="Ver Rutina Actual ⭐"
          color="#366ed4"
          onPress={() => navigation.navigate('RutinaDetalle', { id: idRutinaActual })}
        />
      }
      <FlatList
        style={{ marginTop: 10 }}
        data={rutinas}
        keyExtractor={item => String(item.id_rutina)}
        renderItem={({ item }) => (
          <RutinaCard
            rutina={item}
            esActual={item.id_rutina === idRutinaActual}
            onPress={() => navigation.navigate('RutinaDetalle', { id: item.id_rutina })}
          />
        )}
      />
    </View>
  );
}
