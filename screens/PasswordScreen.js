import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../services/firebase.service';

const PasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [correctPassword,setcorrectPassword] = useState('')
  useEffect(() => {
    const getPass = async() => {
        const docRef = doc(db,'password','XryvZluJ6st4Y3vAuukj')
        const docSnap = await getDoc(docRef)
        setcorrectPassword(docSnap.data())
        console.log(correctPassword);
    }
    getPass()
  
  }, [])
  
  const handleLogin = () => {
    if (password === correctPassword.password) {
      navigation.replace('MainTabs');
    } else {
      alert('Неправильный Пароль Ака!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Введите пароль</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={{width:'100%'}}>
      <Button title="Вход" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default PasswordScreen;
