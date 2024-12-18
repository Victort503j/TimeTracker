import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Record = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Este es el historial</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Record;