// src/screens/CrearRutinaScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const BACKEND_URL = 'http://192.168.1.140:3000';

type Usuario = {
  primer_nombre: string;
  primer_apellido: string;
};

type Cliente = {
  id_cliente: number;
  usuario: Usuario;
};

type Entrenador = {
  id_entrenador: number;
  usuario: Usuario;
};

type Ejercicio = {
  id_ejercicio: number;
  nombre: string;
};

type LineaEjercicio = {
  id_ejercicio: number | undefined;
  dia: number;
  orden: number;
  series: number;
  peso: number;
  descanso: number;
  observacion: string;
};

export default function CrearRutinaScreen() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);

  const [idEntrenador, setIdEntrenador] = useState<number | undefined>();
  const [idCliente, setIdCliente] = useState<number | undefined>();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);

  const [lineas, setLineas] = useState<LineaEjercicio[]>([
    { id_ejercicio: undefined, dia: 1, orden: 1, series: 3, peso: 0, descanso: 60, observacion: '' },
  ]);

  const [visibleFecha, setVisibleFecha] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const [eRes, cRes, jRes] = await Promise.all([
          fetch(`${BACKEND_URL}/entrenador/activos`, { headers }),
          fetch(`${BACKEND_URL}/clientes`, { headers }),
          fetch(`${BACKEND_URL}/ejercicios`, { headers }),
        ]);

        if (!eRes.ok || !cRes.ok || !jRes.ok) throw new Error();

        setEntrenadores(await eRes.json());
        setClientes(await cRes.json());
        setEjercicios(await jRes.json());
      } catch (error) {
        Alert.alert('Error al cargar datos del servidor');
      }
    };

    fetchData();
  }, []);

  const agregarLinea = () => {
    setLineas([...lineas, {
      id_ejercicio: undefined,
      dia: 1,
      orden: lineas.length + 1,
      series: 3,
      peso: 0,
      descanso: 60,
      observacion: '',
    }]);
  };

  const eliminarLinea = (index: number) => {
    if (lineas.length === 1) {
      Alert.alert('Debe haber al menos un ejercicio en la rutina');
      return;
    }
    const nuevasLineas = [...lineas];
    nuevasLineas.splice(index, 1);
    setLineas(nuevasLineas);
  };

  const actualizarLinea = <K extends keyof LineaEjercicio>(
    index: number,
    campo: K,
    valor: LineaEjercicio[K]
  ) => {
    const nuevasLineas = [...lineas];
    nuevasLineas[index][campo] = valor;
    setLineas(nuevasLineas);
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!idEntrenador || !idCliente || !fechaInicio || !nombre.trim()) {
      Alert.alert('Todos los campos generales son obligatorios');
      return;
    }

    for (let i = 0; i < lineas.length; i++) {
      const l = lineas[i];

      if (
        l.id_ejercicio === undefined ||
        isNaN(Number(l.id_ejercicio)) ||
        isNaN(Number(l.dia)) ||
        isNaN(Number(l.orden)) ||
        isNaN(Number(l.series)) ||
        isNaN(Number(l.peso)) ||
        isNaN(Number(l.descanso))
      ) {
        Alert.alert(`Completa correctamente todos los campos numéricos del ejercicio en la línea ${i + 1}`);
        return;
      }

      if (
        Number(l.dia) < 1 || Number(l.orden) < 1 || Number(l.series) < 1 ||
        Number(l.peso) < 0 || Number(l.descanso) < 0
      ) {
        Alert.alert(`Los valores deben ser positivos en la línea ${i + 1}`);
        return;
      }
    }

    const payload = {
      id_entrenador: idEntrenador,
      id_cliente: idCliente,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      ejercicios: lineas.map(l => ({
        id_ejercicio: Number(l.id_ejercicio),
        dia: Number(l.dia),
        orden: Number(l.orden),
        series: Number(l.series),
        peso: Number(l.peso),
        descanso: Number(l.descanso),
        observacion: l.observacion.trim() || undefined,
      })),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/rutinas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      Alert.alert('Rutina creada con éxito');
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la rutina');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sección de Crear Rutina</Text>

      <Text style={styles.label}>Cliente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idCliente}
          onValueChange={(value) => setIdCliente(value ? Number(value) : undefined)}
        >
          <Picker.Item label="Selecciona un cliente…" value={undefined} />
          {clientes.map(cli => (
            <Picker.Item
              key={cli.id_cliente}
              label={`${cli.usuario.primer_nombre} ${cli.usuario.primer_apellido}`}
              value={cli.id_cliente}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Entrenador</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idEntrenador}
          onValueChange={(value) => setIdEntrenador(value ? Number(value) : undefined)}
        >
          <Picker.Item label="Selecciona un entrenador…" value={undefined} />
          {entrenadores.map(ent => (
            <Picker.Item
              key={ent.id_entrenador}
              label={`${ent.usuario.primer_nombre} ${ent.usuario.primer_apellido}`}
              value={ent.id_entrenador}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />
      <Text style={styles.label}>Fecha *</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={fechaInicio ? fechaInicio.toISOString().split('T')[0] : ''}
          onChange={(e) => setFechaInicio(new Date(e.target.value))}
          style={styles.input as any}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.input} onPress={() => setVisibleFecha(true)}>
            <Text>{fechaInicio ? fechaInicio.toLocaleDateString() : 'Seleccionar fecha'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={visibleFecha}
            mode="date"
            date={fechaInicio || new Date()}
            onConfirm={(date) => {
              setVisibleFecha(false);
              setFechaInicio(date);
            }}
            onCancel={() => setVisibleFecha(false)}
          />
        </>
      )}

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.label}>Ejercicios</Text>
      <TouchableOpacity onPress={agregarLinea} style={styles.addButton}>
        <Text style={{ color: 'white', textAlign: 'center' }}>+ Añadir ejercicio</Text>
      </TouchableOpacity>

      {lineas.map((l, index) => (
        <View key={index} style={styles.lineaContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.subTitle}>Ejercicio #{index + 1}</Text>
            {lineas.length > 1 && (
              <TouchableOpacity onPress={() => eliminarLinea(index)} style={styles.removeButton}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Nombre del ejercicio</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={l.id_ejercicio}
              onValueChange={(value) => actualizarLinea(index, 'id_ejercicio', value)}
            >
              <Picker.Item label="Selecciona ejercicio…" value={undefined} />
              {ejercicios.map(ex => (
                <Picker.Item key={ex.id_ejercicio} label={ex.nombre} value={ex.id_ejercicio} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Día</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(l.dia)}
            onChangeText={text => actualizarLinea(index, 'dia', Number(text))}
          />

          <Text style={styles.label}>Orden</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(l.orden)}
            onChangeText={text => actualizarLinea(index, 'orden', Number(text))}
          />

          <Text style={styles.label}>Series</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(l.series)}
            onChangeText={text => actualizarLinea(index, 'series', Number(text))}
          />

          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(l.peso)}
            onChangeText={text => actualizarLinea(index, 'peso', Number(text))}
          />

          <Text style={styles.label}>Descanso (segundos)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(l.descanso)}
            onChangeText={text => actualizarLinea(index, 'descanso', Number(text))}
          />

          <Text style={styles.label}>Observación</Text>
          <TextInput
            style={styles.input}
            value={l.observacion}
            onChangeText={text => actualizarLinea(index, 'observacion', text)}
          />
        </View>
      ))}

      <Button title="Guardar rutina" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    color: '#1f2937',
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  removeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lineaContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
});
