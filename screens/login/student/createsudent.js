import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateStudentAccountScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');

  // Animation refs
  const titleAnim    = useRef(new Animated.Value(0)).current;
  const fieldsAnim   = useRef(new Animated.Value(0)).current;
  const buttonAnim   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Title bounce in
    Animated.spring(titleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true
    }).start();
    // Fields fade+slide
    Animated.timing(fieldsAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
  }, []);

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password || !confirm) {
      return Alert.alert('Ошибка', 'Заполните все поля.');
    }
    if (password !== confirm) {
      return Alert.alert('Ошибка', 'Пароли не совпадают.');
    }
    // Basic email/phone validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Alert.alert('Ошибка', 'Некорректный email.');
    }
    if (phone.length < 5) {
      return Alert.alert('Ошибка', 'Некорректный телефон.');
    }
    const profile = { fullName, email, phone, password };
    try {
      await AsyncStorage.setItem('studentProfile', JSON.stringify(profile));
      navigation.navigate('homestudent');
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить данные.');
    }
  };

  // Animated button press
  const onPressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.9,
      useNativeDriver: true
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  const fieldTranslate = fieldsAnim.interpolate({
    inputRange: [0,1],
    outputRange: [20,0]
  });
  const fieldOpacity = fieldsAnim;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <Animated.View style={[styles.header, {
        transform: [{ scale: titleAnim.interpolate({ inputRange: [0,1], outputRange: [0.5,1] }) }]
      }]}>
        <Text style={styles.headerTitle}>Новый ученик</Text>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {['fullName','email','phone','password','confirm'].map((_, idx) => (
            <Animated.View
              key={idx}
              style={{
                opacity: fieldOpacity,
                transform: [{ translateY: fieldTranslate }],
                marginBottom: 16
              }}
            >
              {idx === 0 && (
                <TextInput
                  style={styles.input}
                  placeholder="ФИО"
                  value={fullName}
                  onChangeText={setFullName}
                />
              )}
              {idx === 1 && (
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              )}
              {idx === 2 && (
                <TextInput
                  style={styles.input}
                  placeholder="Телефон"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              )}
              {idx === 3 && (
                <TextInput
                  style={styles.input}
                  placeholder="Пароль"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              )}
              {idx === 4 && (
                <TextInput
                  style={styles.input}
                  placeholder="Повторите пароль"
                  secureTextEntry
                  value={confirm}
                  onChangeText={setConfirm}
                />
              )}
            </Animated.View>
          ))}

          {/* Register button */}
          <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E5E7EB'
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    marginBottom: 10
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700'
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 10
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB'
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
