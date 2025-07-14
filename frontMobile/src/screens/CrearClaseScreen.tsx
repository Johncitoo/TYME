// src/screens/CrearClaseScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RootStackParamList } from '../navigation/AppNavigator';

const BACKEND_URL = 'http://192.168.1.140:3000';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CrearClaseScreen'>;

type Entrenador = {
  id_entrenador: number;
  usuario: {
    primer_nombre: string;
    primer_apellido: string;
  };
};

const CrearClaseScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [idEntrenador, setIdEntrenador] = useState<number>(0);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [horaFin, setHoraFin] = useState<Date | null>(null);
  const [cupoMaximo, setCupoMaximo] = useState('1');

  const [visibleFecha, setVisibleFecha] = useState(false);
  const [visibleHoraInicio, setVisibleHoraInicio] = useState(false);
  const [visibleHoraFin, setVisibleHoraFin] = useState(false);

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/entrenador/activos`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setEntrenadores(data);
      } catch (err) {
        Alert.alert('Error', 'No se pudieron cargar los entrenadores.');
      }
    };
    fetchEntrenadores();
  }, []);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    if (idEntrenador < 1 || !fecha || !horaInicio || !horaFin) {
      Alert.alert('Error', 'Debe completar todos los campos.');
      return;
    }
    if (horaInicio >= horaFin) {
      Alert.alert('Error', 'La hora de inicio debe ser menor que la de término.');
      return;
    }

    const payload = {
      nombre,
      descripcion,
      fecha_clase: fecha.toISOString().split('T')[0],
      hora_inicio: horaInicio.toTimeString().split(' ')[0],
      hora_fin: horaFin.toTimeString().split(' ')[0],
      cupo_maximo: Number(cupoMaximo),
      id_entrenador: idEntrenador,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/clase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log('Código HTTP:', res.status);
        console.log('Respuesta del servidor:', errorText);
        throw new Error('Error al crear la clase');
      }

      Alert.alert('Éxito', 'Clase creada correctamente');
      navigation.navigate('EntrenadorDashboard');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Nueva Clase</Text>

      <Text style={styles.label}>Entrenador a cargo *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idEntrenador}
          onValueChange={(value) => setIdEntrenador(Number(value))}
        >
          <Picker.Item label="Seleccione un entrenador" value={0} />
          {entrenadores.map((e) => (
            <Picker.Item
              key={e.id_entrenador}
              label={`${e.usuario.primer_nombre} ${e.usuario.primer_apellido}`}
              value={e.id_entrenador}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nombre de la clase *</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese nombre"
      />

      <Text style={styles.label}>Descripción *</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción de la clase"
        multiline
      />

      <Text style={styles.label}>Fecha *</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={fecha ? fecha.toISOString().split('T')[0] : ''}
          onChange={(e) => setFecha(new Date(e.target.value))}
          style={styles.input as any}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.input} onPress={() => setVisibleFecha(true)}>
            <Text>{fecha ? fecha.toLocaleDateString() : 'Seleccionar fecha'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={visibleFecha}
            mode="date"
            date={fecha || new Date()}
            onConfirm={(date) => {
              setVisibleFecha(false);
              setFecha(date);
            }}
            onCancel={() => setVisibleFecha(false)}
          />
        </>
      )}

      <Text style={styles.label}>Hora de inicio *</Text>
      {Platform.OS === 'web' ? (
        <input
          type="time"
          value={horaInicio ? horaInicio.toTimeString().slice(0, 5) : ''}
          onChange={(e) => {
            const [h, m] = e.target.value.split(':');
            const date = new Date();
            date.setHours(parseInt(h));
            date.setMinutes(parseInt(m));
            setHoraInicio(date);
          }}
          style={styles.input as any}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.input} onPress={() => setVisibleHoraInicio(true)}>
            <Text>
              {horaInicio
                ? horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Seleccionar hora'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={visibleHoraInicio}
            mode="time"
            is24Hour
            date={horaInicio || new Date()}
            onConfirm={(time) => {
              setVisibleHoraInicio(false);
              setHoraInicio(time);
            }}
            onCancel={() => setVisibleHoraInicio(false)}
          />
        </>
      )}

      <Text style={styles.label}>Hora de término *</Text>
      {Platform.OS === 'web' ? (
        <input
          type="time"
          value={horaFin ? horaFin.toTimeString().slice(0, 5) : ''}
          onChange={(e) => {
            const [h, m] = e.target.value.split(':');
            const date = new Date();
            date.setHours(parseInt(h));
            date.setMinutes(parseInt(m));
            setHoraFin(date);
          }}
          style={styles.input as any}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.input} onPress={() => setVisibleHoraFin(true)}>
            <Text>
              {horaFin
                ? horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Seleccionar hora'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={visibleHoraFin}
            mode="time"
            is24Hour
            date={horaFin || new Date()}
            onConfirm={(time) => {
              setVisibleHoraFin(false);
              setHoraFin(time);
            }}
            onCancel={() => setVisibleHoraFin(false)}
          />
        </>
      )}

      <Text style={styles.label}>Cupo máximo *</Text>
      <TextInput
        style={styles.input}
        value={cupoMaximo}
        onChangeText={setCupoMaximo}
        keyboardType="numeric"
      />

      <Button title="Guardar Clase" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default CrearClaseScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0a2f5c',
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});
