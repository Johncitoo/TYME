import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.140:3000';

type Usuario = {
  primer_nombre: string;
  primer_apellido: string;
  correo?: string;
};

type Cliente = {
  id_cliente: number;
  usuario: Usuario;
};

export default function ClientesAsignadosScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [idEntrenador, setIdEntrenador] = useState<number | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const idEntrenadorString = await AsyncStorage.getItem('id_entrenador');
        const id = idEntrenadorString ? Number(idEntrenadorString) : null;
        setIdEntrenador(id);

        if (!token || !id) {
          Alert.alert('Error', 'No se encontró el token o ID del entrenador');
          return;
        }

        console.log('📌 Token:', token);
        console.log('🎯 ID del entrenador (usado en la consulta):', id);

        const res = await fetch(`${BACKEND_URL}/clientes/entrenador/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Error de respuesta:', res.status, errorText);
          throw new Error('Error al obtener clientes');
        }

        const data = await res.json();
        console.log('📥 Clientes recibidos:', data);
        setClientes(data);
      } catch (error) {
        console.error('🛑 Error al cargar clientes:', error);
        Alert.alert('Error', 'No se pudieron cargar los clientes asignados');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes Asignados</Text>
      {idEntrenador && (
        <Text style={styles.subtitle}>
          Mostrando clientes para ID de entrenador: {idEntrenador}
        </Text>
      )}
      {clientes.length === 0 ? (
        <Text style={styles.empty}>No hay clientes asignados</Text>
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id_cliente.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.usuario.primer_nombre} {item.usuario.primer_apellido}
              </Text>
              {item.usuario.correo && (
                <Text style={styles.email}>{item.usuario.correo}</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    color: '#374151',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    color: '#6b7280',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
});
