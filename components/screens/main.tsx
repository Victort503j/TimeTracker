import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, StatusBar, TouchableOpacity } from 'react-native';

const Main = () => {
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');

  useEffect(() => {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedHours = hours.toString().padStart(2, '0');

    setStartTime(`${formattedHours}:${minutes} ${period}`);
  }, []);

  const calculateEndTime = () => {
    const [startHour, startMinute] = startTime.split(':');
    const [hours, minutes] = duration.split(':').map(num => parseInt(num, 10));

    let startHours = parseInt(startHour, 10);
    if (startTime.includes('PM') && startHours !== 12) startHours += 12;
    if (startTime.includes('AM') && startHours === 12) startHours = 0;

    const start = new Date();
    start.setHours(startHours);
    start.setMinutes(parseInt(startMinute, 10));

    const end = new Date(start.getTime() + (hours * 60 + minutes) * 60000);

    let endHours = end.getHours();
    const endMinutes = end.getMinutes().toString().padStart(2, '0');
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    endHours = endHours % 12 || 12;

    setEndTime(`${endHours}:${endMinutes} ${endPeriod}`);
    setHoursWorked(duration);
  };

  const setAlarm = () => {
    const [hours, minutes] = duration.split(':').map(num => parseInt(num, 10));
    const currentTime = new Date();
    const end = new Date(currentTime.getTime() + (hours * 60 + minutes) * 60000);

    let alarmHours = end.getHours();
    const alarmMinutes = end.getMinutes().toString().padStart(2, '0');
    const alarmPeriod = alarmHours >= 12 ? 'PM' : 'AM';
    alarmHours = alarmHours % 12 || 12;

    Alert.alert('Alarma', `Alarma en ${alarmHours}:${alarmMinutes} ${alarmPeriod}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <Text style={styles.headerText}>Registro de Horas</Text>

      <TextInput
        style={styles.input}
        placeholder="Hora de inicio (HH:MM AM/PM)"
        placeholderTextColor="#aaa"
        value={startTime}
        editable={false}
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
    backgroundColor: '#222', 
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'Arial', 
  },
  input: {
    height: 50,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#333',
    color: '#fff',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: 'Arial', 
  },
  button: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  alarmButton: {
    backgroundColor: '#FF6347', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Arial', 
  },
});

export default Main;
