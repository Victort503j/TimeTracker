import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, StatusBar, TouchableOpacity } from 'react-native';

const Main = () => {
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');

  const calculateEndTime = () => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const [hours, minutes] = duration.split(':').map(num => parseInt(num, 10));
    const end = new Date(start.getTime() + (hours * 60 + minutes) * 60000);

    setEndTime(`${end.getHours()}:${end.getMinutes() < 10 ? '0' : ''}${end.getMinutes()}`);
    setHoursWorked(duration);
  };

  const setAlarm = () => {
    const [hours, minutes] = duration.split(':').map(num => parseInt(num, 10));
    const currentTime = new Date();
    const end = new Date(currentTime.getTime() + (hours * 60 + minutes) * 60000);

    Alert.alert('Alarma', `Alarma en ${end.getHours()}:${end.getMinutes()}`);
  };

  return (
    <View style={styles.container}>
      {/* Barra de Estado Oscura */}
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <Text style={styles.headerText}>Registro de Horas</Text>

      <TextInput
        style={styles.input}
        placeholder="Hora de inicio (HH:MM)"
        placeholderTextColor="#aaa"
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Duración (HH:MM)"
        placeholderTextColor="#aaa"
        value={duration}
        onChangeText={setDuration}
      />

      <TouchableOpacity style={styles.button} onPress={calculateEndTime}>
        <Text style={styles.buttonText}>Calcular Hora de Fin</Text>
      </TouchableOpacity>

      <Text style={styles.resultText}>Hora de Fin: {endTime}</Text>
      <Text style={styles.resultText}>Horas Trabajadas: {hoursWorked}</Text>

      <TouchableOpacity style={[styles.button, styles.alarmButton]} onPress={setAlarm}>
        <Text style={styles.buttonText}>Establecer Alarma</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222', // Fondo oscuro
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f5f5f5', // Texto claro
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#333',
    color: '#fff',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50', // Verde moderno
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  alarmButton: {
    backgroundColor: '#FF6347', // Rojo tomate
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultText: {
    color: '#f5f5f5',
    fontSize: 18,
    marginTop: 10,
  },
});

export default Main;
