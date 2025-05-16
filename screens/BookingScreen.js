import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const placeholderUri =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWBSSpBAK1Ti42EKdN4qttNVg2v8IPoq_ZY8LrTgls7qh-NB9E9C-3QmF8Gc-blkWi7dTjpAtCm0XB998M54vOA';

export default function BookingScreen({ navigation }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState('');
  const [studentName, setStudentName] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('mentors');
        setMentors(json ? JSON.parse(json) : []);
      } catch {
        Alert.alert('Ошибка', 'Не удалось загрузить менторов');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBooking = async () => {
    if (!selected) return Alert.alert('Ошибка', 'Выберите ментора');
    if (!time || !studentName || !contact)
      return Alert.alert('Ошибка', 'Заполните все поля');
    const { workingHours, login } = selected;
    if (time < workingHours.from || time > workingHours.to)
      return Alert.alert('Ошибка', `Выберите время ${workingHours.from}–${workingHours.to}`);

    const booking = { mentorLogin: login, time, studentName, studentContact: contact };

    try {
      // общий список
      const jsb = await AsyncStorage.getItem('bookings');
      const bs = jsb ? JSON.parse(jsb) : [];
      bs.push(booking);
      await AsyncStorage.setItem('bookings', JSON.stringify(bs));

      // профиль
      const jsp = await AsyncStorage.getItem('mentorProfile');
      let prof = jsp ? JSON.parse(jsp) : null;
      if (prof && prof.login === login) {
        prof.bookings = prof.bookings ? [...prof.bookings, booking] : [booking];
        await AsyncStorage.setItem('mentorProfile', JSON.stringify(prof));
      }

      // обновляем mentors
      const jsm = await AsyncStorage.getItem('mentors');
      const ms = jsm ? JSON.parse(jsm) : [];
      const upd = ms.map(m =>
        m.login === login ? { ...m, bookings: prof.bookings } : m
      );
      await AsyncStorage.setItem('mentors', JSON.stringify(upd));

      Alert.alert('Успех', 'Вы записаны!');
      setSelected(null);
      setTime('');
      setStudentName('');
      setContact('');
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить запись');
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Запись</Text>
        <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
          <Ionicons name="sync" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {!selected ? (
          <FlatList
            data={mentors}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <FadeIn delay={index * 80}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => setSelected(item)}
                >
                  <Image
                    source={{ uri: item.avatar || placeholderUri }}
                    style={styles.avatar}
                  />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.spec}>{item.specialization}</Text>
                    <Text style={styles.hours}>
                      {item.workingHours.from} – {item.workingHours.to}
                    </Text>
                  </View>
                </TouchableOpacity>
              </FadeIn>
            )}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.details}>
            <FadeIn>
              <Image
                source={{ uri: selected.avatar || placeholderUri }}
                style={styles.selectedAvatar}
              />
            </FadeIn>
            <Text style={styles.detailName}>{selected.name}</Text>
            <Text style={styles.detailSpec}>{selected.specialization}</Text>
            <Text style={styles.detailHours}>
              Часы: {selected.workingHours.from}–{selected.workingHours.to}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Время (HH:MM)"
              value={time}
              onChangeText={setTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Ваше имя"
              value={studentName}
              onChangeText={setStudentName}
            />
            <TextInput
              style={styles.input}
              placeholder="Контакт"
              value={contact}
              onChangeText={setContact}
            />

            <AnimatedButton title="Записаться" onPress={handleBooking} />
            <AnimatedButton
              title="Отмена"
              onPress={() => setSelected(null)}
              style={styles.cancelButton}
              textStyle={styles.cancelText}
            />
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Ionicons name="home-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MentorList')}>
          <Ionicons name="people-outline" size={24} color="#999" />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity onPress={() => navigation.navigate('MentorProfile')}>
          <Ionicons name="person-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Booking')}>
          <Ionicons name="calendar-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Fade-in helper
function FadeIn({ children, delay = 0 }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true
    }).start();
  }, []);
  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }
        ]
      }}
    >
      {children}
    </Animated.View>
  );
}

// Animated button
function AnimatedButton({ title, onPress, style, textStyle }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.button, style]}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },

  container: { padding: 20 },

  list: { paddingBottom: 120 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  spec: { fontSize: 14, color: '#666', marginTop: 2 },
  hours: { fontSize: 12, color: '#999', marginTop: 4 },

  details: { alignItems: 'center', paddingHorizontal: 20 },
  selectedAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12
  },
  detailName: { fontSize: 20, fontWeight: '600', color: '#333' },
  detailSpec: { fontSize: 16, color: '#666', marginTop: 4 },
  detailHours: { fontSize: 14, color: '#555', marginBottom: 12 },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff'
  },

  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
	paddingLeft: 15,
	paddingRight: 15
  },
  cancelButton: {
    backgroundColor: '#eee',
	paddingLeft: 15,
	paddingRight: 15,
    borderRadius: 8,
  },
  cancelText: {
    color: '#555'
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  spacer: { width: 60 },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA'
  }
});
