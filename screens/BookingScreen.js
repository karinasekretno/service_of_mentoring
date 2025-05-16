// screens/BookingIntegration.js

import React, { useCallback, useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const placeholder =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWBSSpBAK1Ti42EKd9E-N4qttNVg2v8IPoq_ZY8LrTgls7qh-NB9E9C-3QmF8Gc-blkWi7dTjpAtCm0XB998M54vOA';

// Список менторов и их свободных окошек
export default function AllMentorsSlotsScreen({ navigation }) {
  const [mentors, setMentors] = useState([]);
  const [slotsMap, setSlotsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const jm = await AsyncStorage.getItem('mentors');
      setMentors(jm ? JSON.parse(jm) : []);
      const js = await AsyncStorage.getItem('mentorSlots');
      setSlotsMap(js ? JSON.parse(js) : {});
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const bookSlotGlobal = async (mentor, slot, name, phone) => {
    try {
      // Удаляем из свободных
      const jsSlots = await AsyncStorage.getItem('mentorSlots');
      const allSlots = jsSlots ? JSON.parse(jsSlots) : {};
      allSlots[mentor.login] = (allSlots[mentor.login] || []).filter(
        (s) => s.id !== slot.id
      );
      await AsyncStorage.setItem('mentorSlots', JSON.stringify(allSlots));
      setSlotsMap(allSlots);

      // Добавляем в записи с контактами
      const jsB = await AsyncStorage.getItem('mentorBookings');
      const allB = jsB ? JSON.parse(jsB) : {};
      const booking = { ...slot, contactName: name, contactPhone: phone };
      allB[mentor.login] = [...(allB[mentor.login] || []), booking];
      await AsyncStorage.setItem('mentorBookings', JSON.stringify(allB));

      Alert.alert('Успешно', 'Вы записались');
    } catch {
      Alert.alert('Ошибка', 'Запись не удалась');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#6366F1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={mentors}
        keyExtractor={(m) => m.login}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Нет менторов</Text>}
        renderItem={({ item: m }) => {
          const slots = slotsMap[m.login] || [];
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('MentorSlots', { mentor: m })}
              style={styles.cardWrapper}
            >
              <View style={styles.card}>
                <Image source={{ uri: m.avatar || placeholder }} style={styles.avatar} />
                <View style={styles.info}>
                  <Text style={styles.name}>{m.name}</Text>
                  {slots.length === 0 ? (
                    <Text style={styles.noSlots}>Нет свободных окошек</Text>
                  ) : (
                    <ScrollView horizontal style={styles.slotsRow}>
                      {slots.map((s) => (
                        <TouchableOpacity
                          key={s.id}
                          style={styles.slot}
                          onPress={() => {
                            setSelectedMentor(m);
                            setSelectedSlot(s);
                            setContactModalVisible(true);
                          }}
                        >
                          <Text style={styles.slotText}>
                            {s.date} {s.time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Модалка для сбора контактов (глобальная) */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтвердите запись</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ваше имя"
              value={contactName}
              onChangeText={setContactName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Телефон"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <Button title="Отмена" onPress={() => setContactModalVisible(false)} />
              <Button
                title="Записаться"
                onPress={() => {
                  bookSlotGlobal(selectedMentor, selectedSlot, contactName, contactPhone);
                  setContactModalVisible(false);
                  setContactName('');
                  setContactPhone('');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Экран профиля ментора (свободные окошки + возможность записаться + записи)
export function MentorSlotsScreen({ route }) {
  const mentor = route.params?.mentor;
  const [freeSlots, setFreeSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  // состояния для модалки внутри профиля
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // загрузка данных
  const loadProfileData = async () => {
    const js = await AsyncStorage.getItem('mentorSlots');
    const allSlots = js ? JSON.parse(js) : {};
    setFreeSlots(allSlots[mentor.login] || []);

    const jb = await AsyncStorage.getItem('mentorBookings');
    const allB = jb ? JSON.parse(jb) : {};
    setBookings(allB[mentor.login] || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [mentor.login])
  );

  const bookSlotProfile = async (slot, name, phone) => {
    try {
      // удалить слот
      const jsSlots = await AsyncStorage.getItem('mentorSlots');
      const allSlots = jsSlots ? JSON.parse(jsSlots) : {};
      allSlots[mentor.login] = (allSlots[mentor.login] || []).filter(
        (s) => s.id !== slot.id
      );
      await AsyncStorage.setItem('mentorSlots', JSON.stringify(allSlots));
      setFreeSlots(allSlots[mentor.login] || []);

      // добавить запись
      const jsB = await AsyncStorage.getItem('mentorBookings');
      const allB = jsB ? JSON.parse(jsB) : {};
      const booking = { ...slot, contactName: name, contactPhone: phone };
      allB[mentor.login] = [...(allB[mentor.login] || []), booking];
      await AsyncStorage.setItem('mentorBookings', JSON.stringify(allB));
      setBookings(allB[mentor.login]);

      Alert.alert('Успешно', 'Вы записались');
    } catch {
      Alert.alert('Ошибка', 'Не удалось записаться');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Окошки {mentor.name}</Text>

      <FlatList
        data={freeSlots}
        keyExtractor={(s) => s.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Нет свободных окошек</Text>}
        renderItem={({ item: s }) => (
          <TouchableOpacity
            style={styles.slotItem}
            onPress={() => {
              setSelectedSlot(s);
              setContactModalVisible(true);
            }}
          >
            <Text>{s.date} {s.time}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={[styles.title, { marginTop: 20 }]}>Записи</Text>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Нет записей</Text>}
        renderItem={({ item: b }) => (
          <View style={styles.bookingItem}>
            <Text>{b.date} {b.time}</Text>
            <Text>{b.contactName}, {b.contactPhone}</Text>
          </View>
        )}
      />

      {/* Модалка внутри профиля */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтвердите запись</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ваше имя"
              value={contactName}
              onChangeText={setContactName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Телефон"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <Button title="Отмена" onPress={() => setContactModalVisible(false)} />
              <Button
                title="Записаться"
                onPress={() => {
                  bookSlotProfile(selectedSlot, contactName, contactPhone);
                  setContactModalVisible(false);
                  setContactName('');
                  setContactPhone('');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FA', padding: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 20 },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
  cardWrapper: { marginBottom: 12 },
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#fff' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  noSlots: { color: '#999' },
  slotsRow: { marginTop: 8 },
  slot: { backgroundColor: '#6366F1', padding: 6, borderRadius: 4, marginRight: 8 },
  slotText: { color: '#fff' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 4, padding: 8, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  slotItem: { padding: 10, backgroundColor: '#EDF2FF', borderRadius: 4, marginBottom: 8 },
  bookingItem: { padding: 10, backgroundColor: '#FFF5F5', borderRadius: 4, marginBottom: 8 }
});
