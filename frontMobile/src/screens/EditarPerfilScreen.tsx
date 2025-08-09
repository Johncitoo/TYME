// src/screens/EditarPerfilScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:3000';

export default function EditarPerfilScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState('');
  const [perfil, setPerfil] = useState<any>({
    primer_nombre: '',
    correo: '',
    // agrega más campos según tu modelo
  });

  // 1. Cargar perfil actual
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPerfil(data);
      } catch (e) {
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2. Manejar cambios en los inputs
  const handleChange = (campo: string, valor: string) => {
    setPerfil({ ...perfil, [campo]: valor });
  };

  // 3. Guardar cambios: pedir contraseña y actualizar
  const handleGuardar = () => {
    Alert.prompt(
      "Confirma tu contraseña",
      "Para guardar cambios, ingresa tu contraseña actual:",
      async (password) => {
        if (!password) return;
        try {
          setEditando(true);
          setError('');
          const token = await AsyncStorage.getItem('token');

          // Validar contraseña (crea este endpoint si no existe)
          const resValida = await fetch(`${BACKEND_URL}/auth/validate-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ password })
          });
          if (!resValida.ok) throw new Error('Contraseña incorrecta');

          // Guardar perfil
          const res = await fetch(`${BACKEND_URL}/users/me`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(perfil)
          });
          if (!res.ok) throw new Error('Error al guardar');

          Alert.alert('¡Listo!', 'Perfil actualizado');
          navigation.goBack();
        } catch (e: any) {
          setError(e.message || 'Error al guardar');
        } finally {
          setEditando(false);
        }
      },
      'secure-text'
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        value={perfil.primer_nombre}
        placeholder="Nombre"
        onChangeText={v => handleChange('primer_nombre', v)}
      />
      <TextInput
        style={styles.input}
        value={perfil.correo}
        placeholder="Correo"
        onChangeText={v => handleChange('correo', v)}
        autoCapitalize="none"
      />
      {/* Puedes agregar aquí más campos (apellidos, etc) */}
      <Button
        title={editando ? 'Guardando...' : 'Guardar'}
        onPress={handleGuardar}
        disabled={editando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#f7f8fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#366ed4' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  error: { color: '#c00', marginBottom: 8, textAlign: 'center' }
});
