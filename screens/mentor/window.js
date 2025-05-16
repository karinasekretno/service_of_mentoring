import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MentorSlotsScreen({ navigation }) {
  const [mentor, setMentor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Загрузим данные ментора и его слоты
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('mentorProfile');
        const prof = json ? JSON.parse(json) : null;
        if (!prof) {
          Alert.alert('Ошибка', 'Профиль ментора не найден!');
          navigation.goBack();
          return;
        }
        setMentor(prof);

        // Попробуем загрузить сохранённые слоты для этого ментора
        const allSlotsJson = await AsyncStorage.getItem('mentorSlots');
        const allSlots = allSlotsJson ? JSON.parse(allSlotsJson) : {};
        const mySlots = allSlots[prof.login] || [];
        setSlots(mySlots);
      } catch (e) {
        Alert.alert('Ошибка', 'Не удалось загрузить слоты');
      }
    })();
  }, []);

  // Добавление нового слота
  const addSlot = async () => {
    if (!date || !time) {
      Alert.alert('Ошибка', 'Укажите дату и время');
      return;
    }
    const newSlot = { date, time, id: Date.now().toString() };
    const newSlots = [...slots, newSlot];

    // Сохраняем в AsyncStorage
    try {
      const allSlotsJson = await AsyncStorage.getItem('mentorSlots');
      const allSlots = allSlotsJson ? JSON.parse(allSlotsJson) : {};
      allSlots[mentor.login] = newSlots;
      await AsyncStorage.setItem('mentorSlots', JSON.stringify(allSlots));
      setSlots(newSlots);
      setDate('');
      setTime('');
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить слот');
    }
  };

  // Удаление слота (по желанию)
  const removeSlot = async (id) => {
    const newSlots = slots.filter(s => s.id !== id);
    try {
      const allSlotsJson = await AsyncStorage.getItem('mentorSlots');
      const allSlots = allSlotsJson ? JSON.parse(allSlotsJson) : {};
      allSlots[mentor.login] = newSlots;
      await AsyncStorage.setItem('mentorSlots', JSON.stringify(allSlots));
      setSlots(newSlots);
    } catch {
      Alert.alert('Ошибка', 'Не удалось удалить слот');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Свободные окошки</Text>

      {/* Добавление нового слота */}
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Дата (например, 2025-06-01)"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Время (например, 15:00)"
          value={time}
          onChangeText={setTime}
        />
        <Button title="Добавить слот" onPress={addSlot} />
      </View>

      {/* Список слотов */}
      <FlatList
        data={slots}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Пока нет опубликованных слотов.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.slotItem}>
            <Text style={styles.slotText}>{item.date} — {item.time}</Text>
            <TouchableOpacity onPress={() => removeSlot(item.id)}>
              <Text style={styles.remove}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  addContainer: { marginBottom: 24 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    elevation: 1
  },
  slotText: { fontSize: 16, color: '#333' },
  remove: { color: '#EF4444', fontWeight: 'bold', marginLeft: 20 },
  empty: { color: '#999', textAlign: 'center', marginTop: 24, fontSize: 15 }
});
