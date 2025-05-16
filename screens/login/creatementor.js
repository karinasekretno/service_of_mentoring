// screens/CreateAccountScreen.js

import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

export default function CreateAccountScreen({ navigation }) {
  const [login, setLogin]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');

  const handleNext = async () => {
    if (!login || !password || !confirmPassword) {
      return Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Ошибка', 'Пароли не совпадают.');
    }
    const creds = { login, password };
    try {
      // Сохраняем учётные данные
      await AsyncStorage.setItem(
        'mentorCredentials',
        JSON.stringify(creds)
      );
      // Создаём минимальный профиль (проще потом дополнять в MentorForm)
      await AsyncStorage.setItem(
        'mentorProfile',
        JSON.stringify({ login, bookings: [] })
      );
      // Переходим к анкете ментора
      navigation.navigate('MentorForm');
    } catch (e) {
      console.error('Ошибка сохранения профиля:', e);
      Alert.alert('Ошибка', 'Не удалось сохранить профиль.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создать аккаунт ментора</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Повторите пароль"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Далее</Text>
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
