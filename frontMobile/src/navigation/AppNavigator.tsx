import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardInicioCliente from '../screens/DashboardInicioCliente';
import ClasesDisponibles from '../screens/ClasesDisponibles';
import MisRutinas from '../screens/MisRutinas';
import RutinaActivaScreen from '../screens/RutinaActivaScreen';
import RutinaDetalleScreen from '../screens/RutinaDetalleScreen';
import EntrenadorDashboard from '../screens/EntrenadorDashboard';
import CrearClaseScreen from '../screens/CrearClaseScreen';
import CrearRutinaScreen from '../screens/CrearRutinaScreen';
import ClientesAsignadosScreen from '../screens/ClientesAsignadosScreen';

export type RootStackParamList = {
  Login: undefined;
  DashboardInicioCliente: undefined;
  ClasesDisponibles: undefined;
  MisRutinas: undefined;
  RutinaActiva: undefined;
  RutinaDetalle: { id: number };
  EntrenadorDashboard: undefined;
  CrearClaseScreen: undefined;
  CrearRutinaScreen: undefined;
  ClientesAsignadosScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DashboardInicioCliente" component={DashboardInicioCliente} options={{ title: 'Inicio' }} />
        <Stack.Screen name="ClasesDisponibles" component={ClasesDisponibles} options={{ title: 'Clases Disponibles' }} />
        <Stack.Screen name="MisRutinas" component={MisRutinas} options={{ title: 'Mis Rutinas' }} />
        <Stack.Screen name="RutinaActiva" component={RutinaActivaScreen} options={{ title: 'Rutina Activa' }} />
        <Stack.Screen name="RutinaDetalle" component={RutinaDetalleScreen} options={{ title: 'Detalle Rutina' }} />
        <Stack.Screen name="EntrenadorDashboard" component={EntrenadorDashboard} options={{ title: 'Dashboard Entrenador' }} />
        <Stack.Screen name="CrearClaseScreen" component={CrearClaseScreen} options={{ title: 'Crear Clase' }} />
        <Stack.Screen name="CrearRutinaScreen" component={CrearRutinaScreen} options={{ title: 'Crear Rutina' }} />
        <Stack.Screen name="ClientesAsignadosScreen" component={ClientesAsignadosScreen} options={{ title: 'Clientes Asignados' }} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}

