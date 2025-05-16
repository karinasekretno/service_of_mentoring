// screens/LoginStudentScreen.js

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

export default function LoginStudentScreen({ navigation }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Ошибка', 'Введите email и пароль');
    }
    try {
      const json = await AsyncStorage.getItem('studentProfile');
      const prof = json ? JSON.parse(json) : null;
      if (prof && prof.email === email && prof.password === password) {
        navigation.navigate('homestudent'); // ваш главный экран ученика
      } else {
        Alert.alert('Ошибка', 'Неверный email или пароль');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка', 'Не удалось проверить данные');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войти как ученик</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('CreateStudent')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Ещё нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    padding: 20, 
    backgroundColor: '#F7F8FA'
  },
  title: {
    fontSize: 24, 
    fontWeight: '600',
    marginBottom: 30, 
    textAlign: 'center'
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
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  link: {
    marginTop: 20,
    alignItems: 'center'
  },
  linkText: {
    color: '#6366F1',
    textDecorationLine: 'underline'
  }
});
