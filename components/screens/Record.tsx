import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/screens/themeContext';
import { Ionicons } from '@expo/vector-icons';

interface RecordItem {
  name: string;
  date: string;
  duration: string;
  endTime: string;
}

const Record = () => {
  const { isDarkMode } = useTheme();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [allRecords, setAllRecords] = useState<RecordItem[]>([]); 
  const [page, setPage] = useState(1); 
  const [recordsPerPage] = useState(7);

  useEffect(() => {
    const getRecords = async () => {
      try {
        const savedRecords = await AsyncStorage.getItem('records');
        if (savedRecords) {
          const parsedRecords = JSON.parse(savedRecords);
          parsedRecords.reverse(); 
          setAllRecords(parsedRecords); 
          setRecords(parsedRecords.slice(0, recordsPerPage)); 
        }
      } catch (error) {
        console.error('Error al obtener los registros de AsyncStorage:', error);
      }
    };
    getRecords();
  }, []);

  const loadPageRecords = (newPage: number) => {
    const startIndex = (newPage - 1) * recordsPerPage;
    const endIndex = newPage * recordsPerPage;
    const recordsForPage = allRecords.slice(startIndex, endIndex);

    if (recordsForPage.length > 0) {
      setRecords(recordsForPage);
      setPage(newPage); 
    }
  };

  const deleteRecord = (name: string) => {
    const updatedRecords = allRecords.filter(record => record.name !== name);
    setAllRecords(updatedRecords);
    setRecords(updatedRecords.slice(0, recordsPerPage)); 

    // Actualiza AsyncStorage después de eliminar el registro
    AsyncStorage.setItem('records', JSON.stringify(updatedRecords))
      .then(() => {
        Alert.alert('Registro eliminado', 'El registro se ha eliminado correctamente.');
      })
      .catch((error) => {
        console.error('Error eliminando el registro:', error);
        Alert.alert('Error', 'No se pudo eliminar el registro.');
      });
  };

  const handleLongPress = (item: RecordItem) => {
    Alert.alert(
      'Eliminar Registro',
      `¿Estás seguro de que deseas eliminar el registro "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteRecord(item.name) },
      ]
    );
  };

  const renderRecord = ({ item }: { item: RecordItem }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      style={[styles.recordContainer, isDarkMode && styles.darkRecordContainer]}
    >
      <Text style={[styles.recordName, isDarkMode && styles.darkText]}>{item.name}</Text>
      <Text style={[styles.recordDate, isDarkMode && styles.darkText]}>{item.date}</Text>
      <Text style={[styles.recordDuration, isDarkMode && styles.darkText]}>
        Duración: {item.duration}
      </Text>
      <Text style={[styles.recordEndTime, isDarkMode && styles.darkText]}>
        Hora de Fin: {item.endTime}
      </Text>
    </TouchableOpacity>
  );

  const totalPages = Math.ceil(allRecords.length / recordsPerPage);

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

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => loadPageRecords(page - 1)}
          disabled={page === 1}
          style={[styles.pageButton, page === 1 && styles.disabledButton]}
        >
          <Ionicons 
            name="arrow-back" 
            size={30} 
            color={page === 1 ? '#aaa' : '#fff'} 
          />
        </TouchableOpacity>
        
        <Text style={styles.pageText}>Página {page} de {totalPages}</Text>

        <TouchableOpacity
          onPress={() => loadPageRecords(page + 1)}
          disabled={page === totalPages || (page * recordsPerPage >= allRecords.length)}
          style={[styles.pageButton, page === totalPages && styles.disabledButton]}
        >
          <Ionicons 
            name="arrow-forward" 
            size={30} 
            color={page === totalPages ? '#aaa' : '#fff'} 
          />
        </TouchableOpacity>
      </View>
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 15,
    width: '100%',
    backgroundColor: '#444',
    borderRadius: 50,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#007BFF',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  pageText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Record;
