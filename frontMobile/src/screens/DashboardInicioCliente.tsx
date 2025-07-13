import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DashboardInicioCliente'>;
};

export default function DashboardInicioCliente({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido/a</Text>
      {/* ...otros contenidos de dashboard... */}

      <Button
        title="Ver mi rutina activa"
        onPress={() => navigation.navigate('RutinaActiva')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f8fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
});
