import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardInicioCliente from '../screens/DashboardInicioCliente';
import RutinaActivaScreen from '../screens/RutinaActivaScreen';
import ClasesDisponibles from '../screens/ClasesDisponibles';
import MisRutinas from '../screens/MisRutinas';

export type RootStackParamList = {
  Login: undefined;
  DashboardInicioCliente: undefined;
  RutinaActivaScreen: undefined;
  ClasesDisponibles: undefined;
  MisRutinas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DashboardInicioCliente"
          component={DashboardInicioCliente}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="RutinaActivaScreen"
          component={RutinaActivaScreen}
          options={{ title: 'Mi Rutina Activa' }}
        />
        <Stack.Screen
          name="ClasesDisponibles"
          component={ClasesDisponibles}
          options={{ title: 'Clases Disponibles' }}
        />
        <Stack.Screen
          name="MisRutinas"
          component={MisRutinas}
          options={{ title: 'Mis Rutinas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
