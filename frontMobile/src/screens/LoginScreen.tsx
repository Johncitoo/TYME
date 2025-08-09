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


const BACKEND_URL = 'http://localhost:3000';


export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanAll = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    await AsyncStorage.removeItem('id_usuario');
    await AsyncStorage.removeItem('id_entrenador');
    await AsyncStorage.removeItem('tipo_usuario');

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

      const tipo = usuario.tipo_usuario?.toLowerCase?.() || '';

      if (token) await AsyncStorage.setItem('token', token);
      if (usuario.id_usuario) await AsyncStorage.setItem('id_usuario', String(usuario.id_usuario));
      if (tipo) await AsyncStorage.setItem('tipo_usuario', tipo);
      if (tipo === 'entrenador' && usuario.id_entrenador) {
        await AsyncStorage.setItem('id_entrenador', String(usuario.id_entrenador));
        console.log("===> ID de entrenador guardado:", usuario.id_entrenador);
      }

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
