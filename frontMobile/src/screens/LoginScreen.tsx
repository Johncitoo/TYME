import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  DashboardInicioCliente: undefined;
  EntrenadorDashboard: undefined;
  Login: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const BACKEND_URL = 'http://192.168.1.140:3000';

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanAll = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    await cleanAll();

    try {
      console.log("===> Intentando login:", email, password);
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log("===> Response status:", response.status);

      if (!response.ok) {
        setError('Credenciales incorrectas');
        setLoading(false);
        console.log("===> Error: Credenciales incorrectas");
        return;
      }

      const usuario = await response.json();
      console.log("===> Usuario recibido:", usuario);

      const token = usuario.token || usuario.access_token;
      if (token) {
        await AsyncStorage.setItem('token', token);
      }
      await AsyncStorage.setItem('user', JSON.stringify(usuario));

      // Detección del tipo de usuario
      let tipo = '';
      if (typeof usuario.tipo_usuario === 'string') {
        tipo = usuario.tipo_usuario.toLowerCase();
      } else if (usuario.tipo_usuario?.nombre) {
        tipo = String(usuario.tipo_usuario.nombre).toLowerCase();
      } else if (usuario.rol) {
        tipo = String(usuario.rol).toLowerCase();
      } else if (usuario.role) {
        tipo = String(usuario.role).toLowerCase();
      }

      console.log("===> Tipo usuario detectado:", tipo);

      if (tipo === 'cliente') {
        navigation.replace('DashboardInicioCliente');
        console.log("===> Navegando a DashboardInicioCliente");
      } else if (tipo === 'entrenador') {
        navigation.replace('EntrenadorDashboard');
        console.log("===> Navegando a EntrenadorDashboard");
      } else {
        setError('Solo clientes o entrenadores pueden usar la app móvil');
        await cleanAll();
        console.log("===> Error: tipo de usuario no permitido");
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
      console.log("===> Error en fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Ingresando...' : 'Ingresar'}
        onPress={handleLogin}
        disabled={loading}
      />
      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf2fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#366ed4',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  error: {
    color: '#d32f2f',
    marginBottom: 12,
  },
});
