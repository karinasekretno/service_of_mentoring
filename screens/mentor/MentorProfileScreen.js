import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const defaultData = {
  avatar: null,
  login: '',
  name: '',
  description: '',
  specialization: '',
  telegram: '',
  vk: '',
  workingDays: [],
  workingHours: { from: '', to: '' },
  bookings: []
};

export default function MentorProfileScreen({ navigation }) {
  const [mentorData, setMentorData] = useState(defaultData);
  const [days, setDays] = useState({
    monday: false, tuesday: false, wednesday: false,
    thursday: false, friday: false, saturday: false, sunday: false
  });

  // короткие названия дней
  const dayNamesShort = {
    monday: 'Пн', tuesday: 'Вт', wednesday: 'Ср',
    thursday: 'Чт', friday: 'Пт', saturday: 'Сб', sunday: 'Вс'
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const json = await AsyncStorage.getItem('mentorProfile');
        const stored = json ? JSON.parse(json) : null;
        if (!stored) {
          navigation.navigate('MentorForm');
          return;
        }
        setMentorData(stored);
        // инициализируем дни
        const init = {};
        Object.keys(dayNamesShort).forEach(d => {
          init[d] = stored.workingDays.includes(d);
        });
        setDays(init);
      } catch (e) {
        Alert.alert('Ошибка', 'Не удалось загрузить профиль.');
      }
    }
    loadProfile();
  }, []);

  const toggleDay = day => {
    setDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужны права для доступа к галерее');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality: 0.7,
      });
      if (!result.cancelled && result.assets?.length) {
        const uri = result.assets[0].uri;
        setMentorData(prev => ({ ...prev, avatar: uri }));
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const handleSave = async () => {
    const selectedDays = Object.keys(days).filter(d => days[d]);
    const hours = mentorData.workingHours;
    if (!mentorData.name || !mentorData.specialization) {
      Alert.alert('Ошибка', 'Заполните имя и специализацию.');
      return;
    }
    if (selectedDays.length === 0 || !hours.from || !hours.to) {
      Alert.alert('Ошибка', 'Укажите рабочие дни и часы.');
      return;
    }
    try {
      const updated = {
        ...mentorData,
        workingDays: selectedDays,
        workingHours: hours
      };
      await AsyncStorage.setItem('mentorProfile', JSON.stringify(updated));
      // обновляем общий список
      const allJson = await AsyncStorage.getItem('mentors');
      const arr = allJson ? JSON.parse(allJson) : [];
      const idx = arr.findIndex(m => m.login === updated.login);
      if (idx >= 0) arr[idx] = updated; else arr.push(updated);
      await AsyncStorage.setItem('mentors', JSON.stringify(arr));
      Alert.alert('Успех', 'Профиль сохранён');
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    }
  };

  // формат отображения дней
  const displayDays = mentorData.workingDays
    .map(d => dayNamesShort[d]).join(', ');

  return (
   <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
  {/* Аватарка с возможностью выбора */}
  <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
    <Image
      source={{
        uri: mentorData.avatar
          ? mentorData.avatar
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWBSSpBAK1Ti42EKdN4qttNVg2v8IPoq_ZY8LrTgls7qh-NB9E9C-3QmF8Gc-blkWi7dTjpAtCm0XB998M54vOA'
      }}
      style={styles.avatar}
    />
    <View style={styles.cameraIcon}>
      <Ionicons name="camera" size={20} color="#fff" />
    </View>
  </TouchableOpacity>





      {/* Имя и специализация */}
      <TextInput
        style={styles.nameInput}
        placeholder="Имя"
        value={mentorData.name}
        onChangeText={text => setMentorData(p => ({ ...p, name: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Специализация"
        value={mentorData.specialization}
        onChangeText={text => setMentorData(p => ({ ...p, specialization: text }))}
      />

      {/* Расписание */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Расписание</Text>
        <View style={styles.daysContainer}>
          {Object.entries(dayNamesShort).map(([d, label]) => (
            <TouchableOpacity
              key={d}
              style={[styles.dayPill, days[d] && styles.dayPillActive]}
              onPress={() => toggleDay(d)}
            >
              <Text style={[styles.dayText, days[d] && styles.dayTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.hoursRow}>
          <TextInput
            style={[styles.input, styles.hourInput]}
            placeholder="С (09:00)"
            value={mentorData.workingHours.from}
            onChangeText={text =>
              setMentorData(p => ({
                ...p,
                workingHours: { ...p.workingHours, from: text }
              }))
            }
          />
          <TextInput
            style={[styles.input, styles.hourInput]}
            placeholder="До (18:00)"
            value={mentorData.workingHours.to}
            onChangeText={text =>
              setMentorData(p => ({
                ...p,
                workingHours: { ...p.workingHours, to: text }
              }))
            }
          />
        </View>
      </View>

      {/* Контакты */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Контакты</Text>
        <TextInput
          style={styles.input}
          placeholder="Telegram"
          value={mentorData.telegram}
          onChangeText={t => setMentorData(p => ({ ...p, telegram: t }))}
        />
        <TextInput
          style={styles.input}
          placeholder="ВКонтакте"
          value={mentorData.vk}
          onChangeText={t => setMentorData(p => ({ ...p, vk: t }))}
        />
      </View>

      {/* Сохранить */}
      <View style={styles.buttonContainer}>
        <Button title="Сохранить изменения" onPress={handleSave} />
      </View>

      {/* Записи */}
      <Text style={styles.sectionTitle}>Записи учеников</Text>
      {mentorData.bookings?.length > 0 ? (
        <FlatList
          data={mentorData.bookings}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <Text style={styles.bookingTime}>{item.time}</Text>
              <Text style={styles.bookingStudent}>{item.studentName}</Text>
              <Text style={styles.bookingContact}>{item.studentContact}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <Text style={styles.empty}>Пока нет записей.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FA' },
  container: { padding: 20, alignItems: 'center' },

  avatarContainer: {
    position: 'relative',
    marginBottom: 15
  },
  avatar: {
    width: 100, height: 100, borderRadius: 50
  },
  cameraIcon: {
    position: 'absolute',
    right: 0, bottom: 0,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 4
  },

  nameInput: {
    fontSize: 22, fontWeight: '600', color: '#333',
    marginBottom: 10, width: '100%', textAlign: 'center'
  },
  input: {
    width: '100%',
    borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 10, marginBottom: 12,
    backgroundColor: '#fff'
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  cardTitle: {
    fontSize: 16, fontWeight: '500', marginBottom: 10, color: '#444'
  },

  daysContainer: {
    flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12
  },
  dayPill: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12,
    margin: 4
  },
  dayPillActive: {
    backgroundColor: '#6366F1', borderColor: '#6366F1'
  },
  dayText: {
    fontSize: 14, color: '#555'
  },
  dayTextActive: {
    color: '#fff'
  },

  hoursRow: {
    flexDirection: 'row', justifyContent: 'space-between'
  },
  hourInput: {
    flex: 1, marginRight: 10
  },

  buttonContainer: {
    width: '100%', marginBottom: 20
  },

  sectionTitle: {
    alignSelf: 'flex-start', fontSize: 18,
    fontWeight: '500', color: '#333', marginBottom: 10
  },

  bookingCard: {
    width: '100%', backgroundColor: '#fff',
    borderRadius: 8, padding: 12, marginBottom: 12,
    elevation: 1, shadowColor: '#000',
    shadowOpacity: 0.03, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }
  },
  bookingTime: {
    fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4
  },
  bookingStudent: {
    fontSize: 16, color: '#222'
  },
  bookingContact: {
    fontSize: 14, color: '#666'
  },

  empty: {
    color: '#888', marginTop: 20, fontSize: 15
  }
});
