import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function CreateAccountScreen({ navigation }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = async () => {
    if (!login || !password || !confirmPassword) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают.');
      return;
    }
    const profile = { login, password };
    try {
      await AsyncStorage.setItem('mentorProfile', JSON.stringify(profile));
      // Переход к заполнению анкеты ментора
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
        placeholder="Логин *"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Повторите пароль *"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Далее" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
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
