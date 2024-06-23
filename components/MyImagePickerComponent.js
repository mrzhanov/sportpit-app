import React, { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MyImagePickerComponent = ({setEditedTodo,uploadPhoto}) => {

  const pickImage = async () => {
    // Запрос разрешений на доступ к камере и библиотеке изображений
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    // Открыть библиотеку изображений
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
        uploadPhoto(result.assets[0].uri)
      // setEditedTodo((prev) => ({...prev,imageurl:result.assets[0].uri}))
    }
  };

  const takePhoto = async () => {
    // Запрос разрешений на доступ к камере
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }

    // Открыть камеру
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    if (!result.canceled) {
        
        uploadPhoto(result.assets[0].uri)
        // setEditedTodo((prev) => ({...prev,imageurl:result.assets[0].uri}))
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Выбрать из галереи" onPress={pickImage} />
      <Button title="снять на камеру " onPress={takePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap:2,
    marginTop:5,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius:10
  },
});

export default MyImagePickerComponent;
