import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function ProfileCreationScreen({ navigation }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = () => {
    if (!login || !password) {
      Alert.alert('Ошибка', 'Введите логин и придумайте пароль.');
      return;
    }
    // Сохраняем предварительные данные профиля (можно AsyncStorage или Context)
    console.log('Профиль:', { login, password });
    // Переходим к созданию анкеты ментора
    navigation.navigate('MentorForm');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создание профиля ментора123</Text>

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

      <Button title="Далее" onPress={handleNext} />
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
