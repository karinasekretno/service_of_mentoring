import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function MentorFormScreen({ navigation }) {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [telegram, setTelegram] = useState('');
  const [vk, setVk] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const dayNames = {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
  };

  const toggleDay = day => setDays(prev => ({ ...prev, [day]: !prev[day] }));

  const pickImage = async () => {
    try {
      console.log('pickImage invoked');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Разрешите доступ к галерее');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      console.log('ImagePicker result:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('pickImage error:', error);
      Alert.alert('Ошибка', 'Не удалось открыть галерею');
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !specialization) {
      Alert.alert('Ошибка', 'Заполните обязательные поля: имя, описание, специализацию.');
      return;
    }
    const selectedDays = Object.keys(days).filter(d => days[d]);
    if (selectedDays.length === 0) {
      Alert.alert('Ошибка', 'Укажите хотя бы один рабочий день.');
      return;
    }
    if (!startTime || !endTime) {
      Alert.alert('Ошибка', 'Укажите часы работы.');
      return;
    }

    const mentorData = { avatar, name, description, specialization, telegram, vk, workingDays: selectedDays, workingHours: { from: startTime, to: endTime } };

    try {
      const json = await AsyncStorage.getItem('mentors');
      const mentors = json ? JSON.parse(json) : [];
      mentors.push(mentorData);
      await AsyncStorage.setItem('mentors', JSON.stringify(mentors));
	  // Сохраняем текущий профиль для экрана редактирования
await AsyncStorage.setItem('mentorProfile', JSON.stringify(mentorData));

      Alert.alert('Успех', 'Анкета ментора сохранена!');
      // очистка полей
      setAvatar(null);
      setName('');
      setDescription('');
      setSpecialization('');
      setTelegram('');
      setVk('');
      setStartTime('');
      setEndTime('');
      setDays({ monday:false,tuesday:false,wednesday:false,thursday:false,friday:false,saturday:false,sunday:false });
      navigation.navigate('Welcome');
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка', 'Не удалось сохранить анкету.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Создание анкеты ментора</Text>
      <Button title={avatar ? 'Изменить фото' : 'Добавить фото'} onPress={pickImage} />
      {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <TextInput style={styles.input} placeholder="Имя *" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="О себе *" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Специализация *" value={specialization} onChangeText={setSpecialization} />
      <Text style={styles.sectionTitle}>Рабочие дни *</Text>
      {Object.entries(days).map(([day, sel]) => (
        <View style={styles.dayRow} key={day}>
          <Text style={styles.dayLabel}>{dayNames[day]}</Text>
          <Switch value={sel} onValueChange={() => toggleDay(day)} />
        </View>
      ))}
      <Text style={styles.sectionTitle}>Часы работы *</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.timeInput]} placeholder="С (09:00)" value={startTime} onChangeText={setStartTime} />
        <TextInput style={[styles.input, styles.timeInput]} placeholder="До (18:00)" value={endTime} onChangeText={setEndTime} />
      </View>
      <TextInput style={styles.input} placeholder="Telegram" value={telegram} onChangeText={setTelegram} />
      <TextInput style={styles.input} placeholder="ВКонтакте" value={vk} onChangeText={setVk} />
      <Button title="Создать анкету" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  sectionTitle: { fontSize: 18, marginTop: 15, marginBottom: 5 },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dayLabel: { fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  timeInput: { flex: 1, marginRight: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginVertical: 15, alignSelf: 'center', borderWidth: 2, borderColor: '#007AFF' },
});
