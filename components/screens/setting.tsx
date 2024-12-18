import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/components/screens/themeContext';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const resetSettings = () => {
    toggleDarkMode(false);
    Alert.alert('Ajustes restablecidos', 'Todos los ajustes se han restablecido a sus valores predeterminados');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.headerText, isDarkMode && styles.darkText]}>Ajustes</Text>

      {/* Modo Oscuro */}
      <View style={styles.settingItem}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Modo Oscuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      {/* Botón para restablecer */}
      <TouchableOpacity
        style={[styles.resetButton, isDarkMode && styles.darkResetButton]}
        onPress={resetSettings}
      >
        <Text style={[styles.resetButtonText, isDarkMode && styles.darkResetButtonText]}>
          Restablecer Ajustes
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  darkText: {
    color: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  resetButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  darkResetButton: {
    backgroundColor: '#A52A2A',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkResetButtonText: {
    color: '#ddd',
  },
});

export default Settings;
