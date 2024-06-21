import React from 'react';
import { View, Modal, Button, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';

const BarcodeScanner = ({ scanning, setScanning, handleBarCodeScanned }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={scanning}
      onRequestClose={() => setScanning(false)}
    >
      {scanning && (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          facing="back"
        />
      )}
      <Button onPress={() => setScanning(false)} title='Закрыть' />
    </Modal>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});

export default BarcodeScanner;
