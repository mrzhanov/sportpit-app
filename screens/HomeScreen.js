import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Go to Scanner"
      />
      <Button
        title="Go to Search"
      />
      <Button
        title="Go to AddProduct"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
});
