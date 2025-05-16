// screens/Login.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [login, setLogin]       = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!login || !password) {
      return Alert.alert('Ошибка', 'Введите логин и пароль.');
    }
    try {
      const jsonCreds = await AsyncStorage.getItem('mentorCredentials');
      const creds = jsonCreds ? JSON.parse(jsonCreds) : null;
      if (creds && creds.login === login && creds.password === password) {
        // Успешный вход
        navigation.navigate('Welcome');
      } else {
        Alert.alert('Ошибка', 'Неверный логин или пароль.');
      }
    } catch (e) {
      console.error('Ошибка при проверке профиля:', e);
      Alert.alert('Ошибка', 'Не удалось проверить данные.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войти как ментор</Text>

      <TextInput
        style={styles.input}
        placeholder="Логин"
        autoCapitalize="none"
        value={login}
        onChangeText={setLogin}
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center',
    padding: 20, backgroundColor: '#F7F8FA'
  },
  title: {
    fontSize: 24, fontWeight: '600',
    marginBottom: 20, textAlign: 'center'
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  }
});
