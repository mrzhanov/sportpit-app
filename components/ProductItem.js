import React from 'react';
import { View, Text, Image, Button, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const ProductItem = ({ item,setCart ,addToTrash,setModalVisibleView }) => {
  return (
    <TouchableOpacity onLongPress={() => {
      setCart(item);
      setModalVisibleView(true);
    }} style={styles.todoItem}>
      <Image source={{ uri: item.imageurl }} style={styles.image} />
      <Text style={styles.productName}>{`Название: ${item.name}`}</Text>
      <Text style={styles.productPrice}>{`Цена: ${item.price}`}</Text>
      <Text style={styles.productDate}>
        {`${new Date(item?.date?.seconds * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })} ${new Date(item?.date?.seconds * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })}`}
      </Text>
      <Button onPress={() => addToTrash(item)} title='Добавить в счет' />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: height * 0.02,
  },
  image: {
    width: "100%",
    borderRadius: 10,
    marginBottom: height * 0.01,
    height: height * 0.3,
  },
  productName: {
    fontWeight: 'bold',
  },
  productPrice: {
    color: 'gray',
    marginBottom: 5,
  },
  productDate: {
    color: 'gray',
  },
});

export default ProductItem;
