import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMisRutinas } from '../services/clienteService';
import RutinaCard from '../components/RutinaCard';
import MenuCliente from '../components/MenuCliente';

export default function MisRutinas({ navigation }: any) {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRutinas = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem('token');
        const idCliente = await AsyncStorage.getItem('id_usuario');
        if (!token || !idCliente) {
          setError('No autenticado');
          setLoading(false);
          return;
        }
        const data = await getMisRutinas(token, Number(idCliente));
        setRutinas(data);
      } catch (err) {
        setError('Error al cargar las rutinas');
      } finally {
        setLoading(false);
      }
    };
    fetchRutinas();
  }, []);

  // ✅ Identificar la rutina activa buscando en clientesRutinas[0].estado === "Activa"
  const rutinaActiva = rutinas.find(
    (r: any) => r.clientesRutinas?.[0]?.estado === 'Activa'
  );

  const idRutinaActual = rutinaActiva?.id_rutina || null;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <MenuCliente navigation={navigation} />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Mis Rutinas</Text>
      {loading && <ActivityIndicator />}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {idRutinaActual && (
        <Button
          title="Ver Rutina Actual ⭐"
          color="#366ed4"
          onPress={() => navigation.navigate('RutinaDetalle', { id: idRutinaActual })}
        />
      )}
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
