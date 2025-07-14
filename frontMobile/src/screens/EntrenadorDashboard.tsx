// src/screens/EntrenadorDashboard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EntrenadorDashboard'>;

export default function EntrenadorDashboard() {
  const navigation = useNavigation<NavigationProp>();
  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Bienvenido, Entrenador</Text>

      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>
          “La única forma de hacer un gran trabajo es amar lo que haces.” – Steve Jobs
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Calendario</Text>
      <Calendar
        current={today}
        markedDates={{
          [today]: { selected: true, selectedColor: '#3B82F6' },
        }}
        theme={{
          todayTextColor: '#3B82F6',
        }}
        style={styles.calendar}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CrearClaseScreen')}
        >
          <Text style={styles.buttonText}>Crear Clase</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CrearRutinaScreen')}
        >
          <Text style={styles.buttonText}>Crear Rutina</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClientesAsignadosScreen')}
        >
          <Text style={styles.buttonText}>Clientes Asignados</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
    textAlign: 'center',
  },
  quoteContainer: {
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  quote: {
    fontStyle: 'italic',
    color: '#4F46E5',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
