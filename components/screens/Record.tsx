import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/screens/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Asegúrate de importar esto

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
  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar registros
  const loadRecords = async () => {
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

  // Usar useFocusEffect para recargar registros cuando el componente está enfocado
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  // Añadir un método de refresco manual
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecords();
    setRefreshing(false);
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
      style={[styles.recordContainer, isDarkMode ? styles.darkRecordContainer : null]}
    >
      <Text style={[styles.recordName, isDarkMode ? styles.darkText : null]}>{item.name}</Text>
      <Text style={[styles.recordDate, isDarkMode ? styles.darkText : null]}>{item.date}</Text>
      <Text style={[styles.recordDuration, isDarkMode ? styles.darkText : null]}>
        Duración: {item.duration}
      </Text>
      <Text style={[styles.recordEndTime, isDarkMode ? styles.darkText : null]}>
        Hora de Fin: {item.endTime}
      </Text>
    </TouchableOpacity>
  );

  const totalPages = Math.ceil(allRecords.length / recordsPerPage);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : null]}>
      <Text style={[styles.headerText, isDarkMode ? styles.darkText : null]}>Historial de Registros</Text>

      {records.length === 0 ? (
        <Text style={[styles.noRecordsText, isDarkMode ? styles.darkText : null]}>No hay registros</Text>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item) => item.name}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#9Bd35A', '#689F38']}
              tintColor="#fff"
              title="Actualizando registros..."
              titleColor="#fff"
            />
          }
        />
      )}

      <View style={[styles.paginationContainer, isDarkMode ? styles.darkPaginationContainer : null]}>
        <TouchableOpacity
          onPress={() => loadPageRecords(page - 1)}
          disabled={page === 1}
          style={[styles.pageButton, page === 1 ? styles.disabledButton : null]}
        >
          <Ionicons 
            name="arrow-back" 
            size={30} 
            color={page === 1 ? '#aaa' : '#fff'} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.pageText, isDarkMode ? styles.darkText : null]}>Página {page} de {totalPages}</Text>

        <TouchableOpacity
          onPress={() => loadPageRecords(page + 1)}
          disabled={page === totalPages || (page * recordsPerPage >= allRecords.length)}
          style={[styles.pageButton, page === totalPages ? styles.disabledButton : null]}
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
    padding: 20,
    backgroundColor: '#fff',  // Fondo blanco por defecto para modo claro
  },
  darkContainer: {
    backgroundColor: '#333',  // Fondo oscuro para el modo oscuro
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333', // Gris oscuro para modo claro
    marginBottom: 20,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',  // Blanco para texto en modo oscuro
  },
  noRecordsText: {
    fontSize: 18,
    color: '#666',  // Gris claro para modo claro
    marginTop: 20,
    fontStyle: 'italic',
  },
  recordContainer: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',  // Bordes más suaves en modo claro
    backgroundColor: '#f9f9f9', // Fondo suave para los elementos en modo claro
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',  // Sombra suave en modo claro
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkRecordContainer: {
    backgroundColor: '#444',  // Fondo oscuro para elementos en modo oscuro
    borderBottomColor: '#666',  // Bordes más suaves en modo oscuro
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
    backgroundColor: '#f0f0f0',  // Fondo gris claro para la paginación
    borderRadius: 50,
  },
  darkPaginationContainer: {
    backgroundColor: '#555',  // Fondo gris oscuro para la paginación en modo oscuro
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#999',  // Fondo gris suave para los botones
  },
  disabledButton: {
    backgroundColor: '#ccc',  // Fondo gris claro para botones deshabilitados
  },
  pageText: {
    color: '#333',  // Gris oscuro para el texto de la paginación
    fontSize: 16,
  },
});


export default Record;
