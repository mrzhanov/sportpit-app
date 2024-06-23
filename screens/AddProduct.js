import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage,ref } from '../services/firebase.service';
import { CameraView } from 'expo-camera';
import { getDownloadURL, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { ScrollView } from 'react-native-gesture-handler';
import MyImagePickerComponent from '../components/MyImagePickerComponent';
const { width, height } = Dimensions.get('window');
export default function AddProduct() {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceWhole, setPriceWhole] = useState('');
  const [imageurl, setImageurl] = useState('');
  const [desc, setDesc] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const cameraRef = useRef(null);
  const [progressImage,setProgress] = useState()
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };




  const handleAddProduct = async () => {
    if (!name || !price || !priceWhole || !imageurl) {
      alert('Пожалуйста, заполните все поля и добавьте фотографию');
      return;
    }
    const product = {id:new Date().toISOString(),imageurl, name,deleted:false,deletedAt:null, price, priceWhole, desc,date:new Date(), photoUrl };
    const docRef = collection(db, 'products');
    await addDoc(docRef, product);
    setName('')
    setImageurl('')
    setPrice('');
    setPriceWhole('');
    setDesc('');
    setPhotoUrl(null);
  };

  const isFormValid = name && price && priceWhole && desc && imageurl ;

  const takePhoto = async () => {
    setCameraVisible(true);
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCameraVisible(false);
      uploadPhoto(photo.uri);
      setImage(photo.url)
    }
  };

  const uploadPhoto = async (uri) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // You can adjust the width as needed
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    try {
      const blob = await new Promise((resolve,reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => {
          resolve(xhr.response)
        }
        xhr.onerror = (e) =>{
          reject(new TypeError('NetWork request Failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET',manipulatedImage.uri,true)
        xhr.send(null)

        })
        const metadata = {
          contentType: 'image/jpeg'
        };
        const storageRef = ref(storage, 'images/' + Date.now());
const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
setProgress(progress)
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log(error.message);
        break;
      case 'storage/canceled':
        // User canceled the upload
        console.log(error);
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setImageurl(downloadURL)
      console.log('File available at', downloadURL);
      
      
    });
  }
);

    } catch (error) {
      console.error(error)

    }

  };

  return (
    <View style={styles.container}>
      <Text>Добавление товара</Text>
      <TextInput
        value={name}
        placeholder="Имя товара"
        style={styles.input}
        onChangeText={setName}
      />
      <TextInput
        value={price}
        placeholder="Цена в шт"
        style={styles.input}
        keyboardType='numeric'
        onChangeText={setPrice}
      />
      <TextInput
        value={priceWhole}
        placeholder="Цена оптом"
        style={styles.input}
        keyboardType='numeric'

        onChangeText={setPriceWhole}
      />
      <TextInput
        value={desc}
        placeholder="Описание"
        style={styles.textarea}
        onChangeText={setDesc}
        multiline={true}
      />
      <View style={{width:'100%'}}>
      <Button title="Добавить фото" onPress={takePhoto} /> 
      <MyImagePickerComponent 
      uploadPhoto={uploadPhoto}
      />
      <Button title="Добавить товар" onPress={handleAddProduct} disabled={!isFormValid} />
{imageurl && <Image style={{width:200,height:200}} src={imageurl}/>}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={cameraVisible}
        onRequestClose={() => setCameraVisible(false)}
      >
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          ref={cameraRef}
        >
          <View style={styles.cameraContainer}>
            <TouchableOpacity onPress={capturePhoto} style={styles.cameraButton}>
              <Text style={styles.cameraButtonText}>Сделать фото</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    
  },
  modalContent:{
    backgroundColor: 'white',

  },
  modalTitle:{
    width:'100%'
  },
  sectionButton:{
    borderColor:'red',
    padding:10,

  },
  modalContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  cameraButton:{

    alignItems:"center",
    padding:20,
    backgroundColor:'blue' 
  },
  cameraContainer:{
    flex:1,
    justifyContent:'flex-end'

  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: width * 0.01,
    borderRadius: 5,
    marginBottom: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,

    paddingVertical: 8,
    borderRadius: 5,
    width:'100%',
    height: height * 0.2, // Высота текстового поля
  },
});
