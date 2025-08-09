import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function MenuCliente({ navigation }: { navigation: any }) {
  return (
    <View style={styles.menu}>
      <Button title="Inicio" onPress={() => navigation.navigate('DashboardInicioCliente')} />
      <Button title="Clases Disponibles" onPress={() => navigation.navigate('ClasesDisponibles')} />
      <Button title="Mis Rutinas" onPress={() => navigation.navigate('MisRutinas')} />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, backgroundColor: '#eee', paddingVertical: 8
  }
});
