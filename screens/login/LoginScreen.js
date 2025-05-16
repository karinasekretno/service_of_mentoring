import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!login || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, введите логин и пароль.');
      return;
    }
    try {
      const jsonValue = await AsyncStorage.getItem('mentorProfile');
      const profile = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (profile && profile.login === login && profile.password === password) {
        Alert.alert('Успех', 'Вход выполнен!');
        navigation.navigate('MentorProfile');
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
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Войти" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
