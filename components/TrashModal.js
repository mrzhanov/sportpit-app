import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

const TrashModal = ({
  modalVisible,
  setCart,
  setModalVisibleView,
  trash,
  setModalVisible,
  deleteItemFromTrash,
  updateQuantity,
  totalPrice,
  totalPriceWhole,
  deleteFull
}) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <FlatList
              style={{ marginTop: 15 }}
              data={trash}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.todoItemModal}
                  onLongPress={() => {
                    setCart(item);
                    setModalVisibleView(true);
                  }}
                >
                  <Image source={{ uri: item.imageurl }} style={styles.modalImage} />
                  <View>
                    <Text style={styles.productName}>{`Название: ${item.name}`}</Text>
                    <Text style={styles.productPrice}>{`Цена: ${item.price}`}</Text>
                    <Text style={styles.productPrice}>{`Цена в оптом: ${item.priceWhole}`}</Text>
                    <TouchableOpacity
                      style={styles.deleteButtonFromTrash}
                      onPress={() => deleteItemFromTrash(item.id)}
                    >
                      <Text style={styles.deleteButtonFromTrashText}>Удалить</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      keyboardType="numeric"
                      value={String(item.quantity)}
                      onChangeText={(text) => updateQuantity(item.id, Number(text))}
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </ScrollView>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>{`Общая цена в штук: ${totalPrice} Сом`}</Text>
            <Text style={styles.totalText}>{`Общая цена в оптом: ${totalPriceWhole} Сом`}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFull()}>
              <Text style={styles.deleteButtonText}>Удалить все</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.01,
    backgroundColor: '#fff',
  },
  todoItemModal: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    paddingVertical: height * 0.01,
  },
  modalImage: {
    width: width * 0.45,
    borderRadius: 10,
    height: height * 0.2,
    marginRight: width * 0.05,
  },
  quantityInput: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: width * 0.03,
    borderColor: 'gray',
    padding: height * 0.01,
    width: width * 0.2,
    textAlign: 'center',
  },
  totalContainer: {
    marginTop: height * 0.01,
    alignItems: 'center',
  },
  totalText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: height * 0.02,
    marginTop: height * 0.02,
    alignItems: 'center',
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButtonFromTrash: {
    marginTop: 10,
    backgroundColor: '#000000',
    width:width * 0.3,
    borderRadius: 10,
  },
  deleteButtonFromTrashText: {
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
    width: width * 0.3,
    color: 'white',
  },
  productName: {
    fontWeight: 'bold',
  },
  productPrice: {
    color: 'gray',
  },
});

export default TrashModal;
