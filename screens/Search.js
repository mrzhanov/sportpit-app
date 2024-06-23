import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList,Text, TextInput, TouchableOpacity, View, Dimensions, RefreshControl, StyleSheet } from 'react-native';
import { db } from '../services/firebase.service';
import { collection, getDocs } from 'firebase/firestore';
import { playSound, playSoundError } from '../constants/constants';
import ProductItem from '../components/ProductItem';
import TrashModal from '../components/TrashModal';
import BarcodeScanner from '../components/BarcodeScanner';
import Modall from '../components/Modall';

const { width, height } = Dimensions.get('window');

export default function Search() {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [trash, setTrash] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceWhole, setTotalPriceWhole] = useState(0);
  const [modalVisibleView,setModalVisibleView] = useState(false)
  useEffect(() => {
    calculateTotal();
  }, [trash]);

  useEffect(() => {
    fetchAllProducts();
  }, []);
  
  const refreshData = async () => {
    setRefreshing(true);
    await fetchAllProducts();
    setRefreshing(false);
  };
  
  useEffect(() => {
    searchTodos();
  }, [search, allProducts]);

  const fetchAllProducts = async () => {
    const todosCollection = await getDocs(collection(db, 'products'));
    const todosData = todosCollection.docs.map(doc => ({ id: doc.id, docId: doc.id, ...doc.data() }));
    setAllProducts(todosData);
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanning(false);
    const existingTodo = todos.find((todo) => todo.id === data);
    const existingItem = trash.find((existingItem) => existingItem.id === data);

    if (existingItem) {
      playSound();
      const updatedTrash = trash.map((trashItem) =>
        trashItem.id === data ? { ...trashItem, quantity: trashItem.quantity + 1 } : trashItem
      );
      setTrash(updatedTrash);
    } else if (existingTodo) {
      playSound();
      setTrash((prev) => [...prev, { ...existingTodo, quantity: 1 }]);
    } else {
      Alert.alert('Товар не найден');
      playSoundError();
    }
  };

  const deleteItemFromTrash = (id) => {
    const updatedTrash = trash.filter(item => item.id !== id);
    setTrash(updatedTrash);
  };

  const addToTrash = (item) => {
    const existingItem = trash.find((existingItem) => existingItem.id === item.id);
    if (existingItem) {
      playSound();
      const updatedTrash = trash.map((trashItem) =>
        trashItem.id === item.id ? { ...trashItem, quantity: trashItem.quantity + 1 } : trashItem
      );
      setTrash(updatedTrash);
    } else {
      playSound();
      setTrash([...trash, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    setTrash((prevTrash) =>
      prevTrash.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity ? parseInt(newQuantity) : 0 } : item
      )
    );
  };

  const searchTodos = () => {
    let filteredTodos = allProducts.filter(product => !product.deleted);

    if (search) {
      filteredTodos = filteredTodos.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTodos(filteredTodos);
  };

  const deleteFull = () => {
    setTrash([]);
  };

  const calculateTotal = () => {
    let price = 0;
    let priceWhole = 0;
    trash.forEach(item => {
      price += parseFloat(Number(item.price)) * item.quantity;
      priceWhole += parseFloat(Number(item.priceWhole)) * item.quantity;
    });
    setTotalPrice(price);
    setTotalPriceWhole(priceWhole);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        placeholder="Название товара"
        style={styles.input}
        onChangeText={text => setSearch(text)}
      />
      <TouchableOpacity onPress={() => {
        setScannerVisible(true);
        setScanning(true);
      }} style={styles.scanButton}>
        <Text style={styles.buttonText}>Сканировать QR-код</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.trashInput}>
        <Text style={styles.buttonText}>Открыть счет</Text>
      </TouchableOpacity>  
      <FlatList
        style={{ marginTop: 0 }}
        data={todos}
        renderItem={({ item }) => (
          <ProductItem item={item} setModalVisibleView={setModalVisibleView} setCart={setCart} addToTrash={addToTrash} />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={['green']} 
          />
        }
      />
    
      <TrashModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        trash={trash}
        setCart={setCart}
        setModalVisibleView={setModalVisibleView}
        deleteItemFromTrash={deleteItemFromTrash}
        updateQuantity={updateQuantity}
        totalPrice={totalPrice}
        totalPriceWhole={totalPriceWhole}
        deleteFull={deleteFull}
      />
      <BarcodeScanner
        scanning={scanning}
        setScanning={setScanning}
        handleBarCodeScanned={handleBarCodeScanned}
      />
        <Modall
        cart={cart}
        setModalVisibleView={setModalVisibleView}
        modalVisibleView={modalVisibleView}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.03,
    paddingTop: height * 0.01,
  },
  input: {
    height: height * 0.06,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
  },
  scanButton: {
    backgroundColor: 'green',
    borderRadius:9,
    padding: height * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  trashInput: {
    backgroundColor: 'blue',
    padding: height * 0.02,
    borderRadius:9,
    alignItems: 'center',
    marginBottom:height * 0.01,
  },
  buttonText: {
    color: 'white',
  },
});
