import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/screens/themeContext'; // Usar el hook del tema

interface RecordItem {
  name: string;
  date: string;
  duration: string;
  endTime: string;
}

const Record = () => {
  const { isDarkMode } = useTheme();
  const [records, setRecords] = useState<RecordItem[]>([]);

  useEffect(() => {
    const getRecords = async () => {
      try {
        const savedRecords = await AsyncStorage.getItem('records');
        if (savedRecords) {
          setRecords(JSON.parse(savedRecords));
        }
      } catch (error) {
        console.error('Error al obtener los registros de AsyncStorage:', error);
      }
    };
    getRecords();
  }, []);

  const renderRecord = ({ item }: { item: RecordItem }) => (
    <View style={[styles.recordContainer, isDarkMode && styles.darkRecordContainer]}>
      <Text style={[styles.recordName, isDarkMode && styles.darkText]}>{item.name}</Text>
      <Text style={[styles.recordDate, isDarkMode && styles.darkText]}>{item.date}</Text>
      <Text style={[styles.recordDuration, isDarkMode && styles.darkText]}>
        Duración: {item.duration}
      </Text>
      <Text style={[styles.recordEndTime, isDarkMode && styles.darkText]}>
        Hora de Fin: {item.endTime}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.headerText, isDarkMode && styles.darkText]}>Historial de Registros</Text>

      {records.length === 0 ? (
        <Text style={[styles.noRecordsText, isDarkMode && styles.darkText]}>No hay registros</Text>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item) => item.name}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  noRecordsText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    fontStyle: 'italic',
  },
  recordContainer: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  darkRecordContainer: {
    borderBottomColor: '#666',
  },
  recordName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordDate: {
    fontSize: 16,
    marginTop: 5,
  },
  recordDuration: {
    fontSize: 16,
    marginTop: 5,
  },
  recordEndTime: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default Record;
