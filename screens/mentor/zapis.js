import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const placeholderUri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWBSSpBAK1Ti42EKdN4qttNVg2v8IPoq_ZY8LrTgls7qh-NB9E9C-3QmF8Gc-blkWi7dTjpAtCm0XB998M54vOA';

export default function MentorBookingsScreen() {
  const [mentor, setMentor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const jsonProfile = await AsyncStorage.getItem('mentorProfile');
        const data = jsonProfile ? JSON.parse(jsonProfile) : null;
        if (!data) {
          Alert.alert('Ошибка', 'Профиль ментора не найден.');
          return;
        }
        setMentor(data);
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      } catch (e) {
        console.error(e);
        Alert.alert('Ошибка', 'Не удалось загрузить данные профиля.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Image
            source={{ uri: mentor.avatar || placeholderUri }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{mentor.name}</Text>
          <Text style={styles.spec}>{mentor.specialization}</Text>
        </View>
      )}
      data={bookings}
      keyExtractor={(item, idx) => idx.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.time}>{item.time}</Text>
          <Text style={styles.student}>{item.studentName} ({item.studentContact})</Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={styles.empty}>Пока нет записей.</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  spec: {
    fontSize: 16,
    color: '#666'
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  time: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  student: {
    fontSize: 14
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20
  }
});
