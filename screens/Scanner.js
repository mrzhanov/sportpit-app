import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, Modal, Pressable, TouchableOpacity, Alert, RefreshControl, Dimensions } from 'react-native';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import TrashModal from './TrashModal';
import { db, storage,ref } from '../services/firebase.service';
import { CameraView } from 'expo-camera';
import { deleteObject, getDownloadURL, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import defaultImage, { playSound } from '../constants/constants';
import MyImagePickerComponent from '../components/MyImagePickerComponent';
import {parse} from 'date-fns'
const { width, height } = Dimensions.get('window');

export default function Scanner() {
  
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  
  const [cameraVisible, setCameraVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [image, setimage] = useState('');
  const [photo,setPhoto] = useState(false)
  const [editedTodo, setEditedTodo] = useState({})
  const [trashModalVisible, setTrashModalVisible] = useState(false);
  // Добавьте функцию для открытия и закрытия модального окна корзины
  const openTrashModal = () => {
    setTrashModalVisible(true);
  };
  const closeTrashModal = () => {
    setTrashModalVisible(false);
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    checkForExpiredDeletes();
    setIsLoading(true);
  }, [todos]);



;
  const refreshData = async () => {
    setRefreshing(true);
    checkForExpiredDeletes()
    await fetchTodos(); // Перезагрузка данных
    setRefreshing(false);
  };


  const fetchTodos = async () => {
    const todosCollection = await getDocs(collection(db, 'products'));
    const todosData = todosCollection.docs.map(doc => ({ id: doc.id, docId: doc.id, ...doc.data() }));
    
    setTodos(todosData);
  };

  const closeScanner = () => {
    setScanning(false);
    setScannedData('');
  };
  const takePhoto = async () => {
    setCameraVisible(true);
  };
  const handleBarCodeScanned = async ({ data }) => {
    setIsLoading(false)
    setScanning(false);
    setScannedData(data)
    ;
    const existingTodo = todos.find(todo => todo.id === data);
    if (existingTodo) {
      setEditedTodo(existingTodo);
      setEditModalVisible(true);
      setIsLoading(false);
    playSound()
      setIsLoading(true)
    } else {
      const newTodo = {
        id: data,
        name: '',
        price: '',
        imageurl:'',
        priceWhole: '',
        desc: '',
        date: new Date(),
        deleted: false,
        deletedAt: null,
        docId:''
      };
      
      const docRef = await addDoc(collection(db, 'products'), newTodo);
      setEditedTodo({ ...newTodo, docId: docRef.id });
      // setTodos({...newTodo,docId:docRef.id})
      fetchTodos()
    playSound()
      


    ;
    }
  };
  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCameraVisible(false);
      uploadPhoto(photo.uri);
      setimage(photo.uri)
    }
  };
X``
  const uploadPhoto = async (uri) => {
  setPhoto(true)
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
      setEditedTodo((prev) => ({...prev,imageurl:downloadURL}))
      console.log('File available at', downloadURL);
      Alert.alert('фото загрузилось')
      console.log(editedTodo);
      setPhoto(true)
      
    });
  }
);

    } catch (error) {
      console.error(error)

    }

  };

  const restartScanner = () => {
    setScanning(true);
    setScannedData('');
  };

  const openEditModal = (todo) => {
    setEditedTodo(todo);
    setEditModalVisible(true);
      
    if (todo.imageurl || todo.name) {
      setPhoto(true)
    }else if(editedTodo.price && editedTodo.name && editedTodo.priceWhole && editedTodo.imageurl && editedTodo.desc)
      setPhoto(true)
    };

  const saveEditedTodo = async () => {

    const updatedTodos = todos.map(todo => (todo.id === editedTodo.id ? editedTodo : todo));
    
    setTodos(updatedTodos);
    setEditModalVisible(false);

    const todoRef = doc(db, 'products', editedTodo.docId);
    
    await updateDoc(todoRef, editedTodo);
    fetchTodos();

  };

  const deleteTodo = async (id) => {
    const todoRef = doc(db, 'products', id);
    await updateDoc(todoRef, { deleted: true, deletedAt: new Date().toISOString() });
    fetchTodos();
  };
  
  const filteredTodos = todos.filter(todo => 
    todo.name.toLowerCase().includes(search.toLowerCase()) ||
    todo.id.toLowerCase().includes(search.toLowerCase())
);

 const deleteFull = async (id,imageurl) => {
  if (imageurl) {
    const storageRef = ref(storage, imageurl);
    await deleteObject(storageRef);
    console.log('Photo deleted successfully');
  }
  const todoRef = doc(db, 'products', id);
await deleteDoc(todoRef).then(()=>Alert.alert('Успешно удален'))
fetchTodos()
 }

  const restoreTodo = async (id) => {
    const todoRef = doc(db, 'products', id);
    await updateDoc(todoRef, { deleted: false, deletedAt: null });
    fetchTodos();
  };

  const checkForExpiredDeletes = async () => {
    const now = new Date()
    const expiredTodos = todos.filter(todo => todo.deleted && (now - new Date(todo.deletedAt)) > 3 * 30 * 24 *60 * 60 * 1000);
    for (let todo of expiredTodos) {
      const todoRef = doc(db, 'products', todo.docId);
      await deleteDoc(todoRef)
      Alert.alert('из корзины удален по истечении 30 дней')
    }
  };

  const renderDeleteButtons = (item) => {
    if (item.deleted) {
      return (
        <>
          <Button title="Восстановить" onPress={() => restoreTodo(item.id)} />

        </>
      );
    } else {
      return (
        <Button title="Удалить" onPress={() => deleteTodo(item.docId)} />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginBottom:10}}>
      <TextInput 
    style={styles.searchInput}
    placeholder="Поиск..."
    value={search}
    onChangeText={setSearch}
/>

     
        <Button title="Открыть корзину" onPress={openTrashModal} />
      </View>
  <TrashModal
  closeTrashModal={closeTrashModal}
    visible={trashModalVisible}
    todos={todos.filter(todo => todo.deleted)}
    deleteFull={deleteFull}
    restoreTodo={restoreTodo} // Передайте функцию для восстановления товара
  />

      <Button title="Открыть камеру" disabled={!isLoading} onPress={restartScanner} />
    
      <FlatList
        style={{ marginTop: 15 }}
        data={filteredTodos.filter(product => product.deleted == false)}
        renderItem={({ item }) => (
          
          <TouchableOpacity key={item.id} onPress={() => openEditModal(item)} style={styles.todoItem}>
               <Image
        src={item.imageurl}
        style={{ width:'auto', height: 300 ,borderRadius:10}}
        />

            <Text style={{fontSize:20,fontWeight:'bold',marginTop:10,}}>{`${item.name}`}</Text>
            <Text style={styles.productDate}>{`${new Date(item.date.seconds * 1000).toLocaleString()}`}</Text>

            {renderDeleteButtons(item)}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={['green']} // Цвет индикатора обновления (опционально)
          />
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={scanning}
        onRequestClose={() => setScanning(false)}
      >
        <View style={styles.modalContainer}>
            {scanning && (
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
                facing="back"
              />
            )}
            <Pressable style={styles.button} onPress={closeScanner}>
              <Text style={styles.buttonText}>Закрыть сканер</Text>
            </Pressable>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Редактировать задачу</Text>
            <TextInput
              style={styles.input}
              placeholder="название товара"
              value={editedTodo.name}
              onChangeText={(text) => setEditedTodo(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="цена"
              value={editedTodo.price}
        keyboardType='numeric'

              onChangeText={(text) => {
                const formattedPrice = text.replace(/,/g, '.');
                setEditedTodo(prev => ({ ...prev, price: formattedPrice }));
            }}
            />
            <TextInput
              style={styles.input}
              placeholder="Цена оптом"
        keyboardType='numeric'

              value={editedTodo.priceWhole}
              onChangeText={(text) => {
                const formattedPrice = text.replace(/,/g, '.');
                setEditedTodo(prev => ({ ...prev, priceWhole: formattedPrice  }))
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Описание"
              value={editedTodo.desc}
              onChangeText={(text) => {
                setEditedTodo(prev => ({ ...prev, desc: text }))}}
            />
            
      
      <View style={{width:'100%'}}>
{editedTodo?.imageurl && <Image style={{width:'100%',height:300}} src={editedTodo.imageurl}/>}
      </View>
             <Modal
        animationType="slide"
        transparent={true}
        visible={cameraVisible}
        onRequestClose={() => setCameraVisible(false)}
      >
        <CameraView
          style={{flex:1}}
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
              <View style={{paddingBottom:10}}>
            <Button title="Снять фото" onPress={takePhoto} />
              <MyImagePickerComponent
              uploadPhoto={uploadPhoto}
              setEditedTodo={setEditedTodo}
      />
              </View>
            <Button title="Сохранить" onPress={saveEditedTodo}  disabled={!photo} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  productDate:{
    color:'gray',
  }
  , searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
     shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
},
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraContainer:{
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-end',
    height:'100%',
  },cameraButton:{
backgroundColor:'blue',
  height:50,
  justifyContent:'center',
width:'100%'
  },
  cameraButtonText:{
  textAlign:'center',
    fontSize:30
},
  title: {
    
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent:{
    flex:1,
    width:'100%',
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'white',
  },
  sectionButton:{
    marginBottom:5,
    borderColor:'black',
    borderRadius:10,
    borderWidth:1,
    padding:10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  todoItem: {
    borderBottomColor:'gray',
    borderRadius: 5,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth:1,

  },
  modalContainer: {
    flex: 1,
    paddingTop: width * 0.1 ,
    paddingBottom: width * 0.1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  camera: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'blue',
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});
