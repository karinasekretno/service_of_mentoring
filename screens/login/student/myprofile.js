import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const placeholderAvatar =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWBSSpBAK1Ti42EKdN4qttNVg2v8IPoq_ZY8LrTgls7qh-NB9E9C-3QmF8Gc-blkWi7dTjpAtCm0XB998M54vOA';

export default function StudentProfileScreen({ navigation }) {
  const [student, setStudent] = useState({
    avatar: null,
    fullName: '',
    email: '',
    phone: ''
  });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // load profile
        const profJson = await AsyncStorage.getItem('studentProfile');
        const prof = profJson ? JSON.parse(profJson) : null;
        if (!prof) {
          navigation.navigate('CreateStudent');
          return;
        }
        setStudent(prof);
        // load all bookings, filter by this student's contact
        const allBJson = await AsyncStorage.getItem('bookings');
        const allB = allBJson ? JSON.parse(allBJson) : [];
        const myB = allB.filter(b => b.studentContact === prof.phone);
        // load mentors to get names
        const mJson = await AsyncStorage.getItem('mentors');
        const mentors = mJson ? JSON.parse(mJson) : [];
        const enriched = myB.map(b => {
          const m = mentors.find(m => m.login === b.mentorLogin);
          return {
            ...b,
            mentorName: m ? m.name : b.mentorLogin
          };
        });
        setBookings(enriched);
      } catch (e) {
        console.error(e);
        Alert.alert('Ошибка', 'Не удалось загрузить данные.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Нужны права для фото');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality: 0.7
      });
      if (!res.cancelled && res.assets?.length) {
        setStudent(s => ({ ...s, avatar: res.assets[0].uri }));
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const saveProfile = async () => {
    if (!student.fullName || !student.email || !student.phone) {
      return Alert.alert('Ошибка', 'Заполните все поля');
    }
    try {
      await AsyncStorage.setItem(
        'studentProfile',
        JSON.stringify(student)
      );
      Alert.alert('Успех', 'Профиль сохранён');
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить профиль');
    }
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingTime}>{item.time}</Text>
      <Text style={styles.bookingMentor}>{item.mentorName}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль ученика</Text>
        <TouchableOpacity onPress={saveProfile}>
          <Ionicons name="save-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={pickImage}
        >
          <Image
            source={{
              uri: student.avatar || placeholderAvatar
            }}
            style={styles.avatar}
          />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Info */}
        <TextInput
          style={styles.input}
          placeholder="ФИО"
          value={student.fullName}
          onChangeText={t =>
            setStudent(s => ({ ...s, fullName: t }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={student.email}
          onChangeText={t =>
            setStudent(s => ({ ...s, email: t }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Телефон"
          keyboardType="phone-pad"
          value={student.phone}
          onChangeText={t =>
            setStudent(s => ({ ...s, phone: t }))
          }
        />

        {/* Bookings */}
        <Text style={styles.sectionTitle}>Мои записи</Text>
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderBooking}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        ) : (
          <Text style={styles.empty}>Еще нет записей</Text>
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
        <View style={styles.navSpacer} />
        <TouchableOpacity onPress={() => navigation.navigate('Booking')}>
          <Ionicons name="calendar-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StudentProfile')}>
          <Ionicons name="person-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },

  container: {
    padding: 20,
    alignItems: 'center'
  },

  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 4
  },

  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD'
  },

  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginVertical: 12
  },

  bookingCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }
  },
  bookingTime: { fontSize: 14, fontWeight: '600', color: '#555' },
  bookingMentor: { fontSize: 14, color: '#333' },

  empty: { color: '#888', marginTop: 20 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  navSpacer: { width: 60 }
});
