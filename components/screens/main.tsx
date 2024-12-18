import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/screens/themeContext';

const Main = () => {
  const { isDarkMode } = useTheme(); 
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');

  useEffect(() => {
    const updateStartTime = () => {
      const currentTime = new Date();
      let hours = currentTime.getHours();
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedHours = hours.toString().padStart(2, '0');
      setStartTime(`${formattedHours}:${minutes} ${period}`);
    };

    updateStartTime();
    const intervalId = setInterval(updateStartTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const calculateEndTime = () => {
    if (!duration.trim()) {
      Alert.alert('Error', 'Por favor, ingrese la duración');
      return;
    }

    const durationParts = duration.split(':');
    if (durationParts.length !== 2 || 
        isNaN(parseInt(durationParts[0], 10)) || 
        isNaN(parseInt(durationParts[1], 10))) {
      Alert.alert('Error', 'Formato de duración inválido. Use HH:MM');
      return;
    }

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

  const saveRecord = async () => {
    if (!duration.trim()) {
      Alert.alert('Error', 'Por favor, ingrese la duración');
      return;
    }

    if (!endTime) {
      Alert.alert('Error', 'Primero calcule la hora de fin');
      return;
    }

    const name = `Registro ${new Date().toLocaleString()}`;
    const newRecord = {
      name,
      date: new Date().toLocaleString(),
      duration,
      endTime,
    };

    try {
      const storedRecords = await AsyncStorage.getItem('records');
      const records = storedRecords ? JSON.parse(storedRecords) : [];
      records.push(newRecord);
      await AsyncStorage.setItem('records', JSON.stringify(records));

      setEndTime('');
      setHoursWorked('');
      setDuration('');

      Alert.alert('Registro guardado', 'El registro se ha guardado correctamente');
    } catch (error) {
      console.error('Error guardando el registro:', error);
      Alert.alert('Error', 'No se pudo guardar el registro');
    }
  };

  const setAlarm = () => {
    if (!duration.trim()) {
      Alert.alert('Error', 'Por favor, ingrese la duración');
      return;
    }

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
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#333' : '#f0f0f0'} />
      <Text style={[styles.headerText, isDarkMode && styles.darkText]}>Registro de Horas</Text>

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Hora de inicio (HH:MM AM/PM)"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={startTime}
        editable={false}
      />
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Duración (HH:MM)"
        placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
        value={duration}
        onChangeText={setDuration}
      />

      <TouchableOpacity 
        style={[styles.button, isDarkMode && styles.darkButton]} 
        onPress={calculateEndTime}
        disabled={!duration.trim()}
      >
        <Text style={styles.buttonText}>Calcular Hora de Fin</Text>
      </TouchableOpacity>

      <Text style={[styles.resultText, isDarkMode && styles.darkText]}>Hora de Fin: {endTime}</Text>
      <Text style={[styles.resultText, isDarkMode && styles.darkText]}>Horas Trabajadas: {hoursWorked}</Text>

      <TouchableOpacity 
        style={[styles.button, styles.alarmButton]} 
        onPress={setAlarm}
        disabled={!duration.trim()}
      >
        <Text style={styles.buttonText}>Establecer Alarma</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.saveButton]} 
        onPress={saveRecord}
        disabled={!duration.trim() || !endTime}
      >
        <Text style={styles.buttonText}>Guardar Registro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
    fontSize: 18,
  },
  darkInput: {
    backgroundColor: '#444',
    color: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  darkButton: {
    backgroundColor: '#2e8b57',
  },
  alarmButton: {
    backgroundColor: '#FF6347',
  },
  saveButton: {
    backgroundColor: '#8A2BE2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Main;
