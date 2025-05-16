// screens/MyBookingsScreen.js

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        // Получаем все брони из AsyncStorage
        const jsB = await AsyncStorage.getItem('mentorBookings');
        const allB = jsB ? JSON.parse(jsB) : {};

        // Подгружаем список менторов, чтобы получить их имена
        const jsM = await AsyncStorage.getItem('mentors');
        const mentorsList = jsM ? JSON.parse(jsM) : [];
        const nameMap = {};
        mentorsList.forEach(m => {
          nameMap[m.login] = m.name;
        });

        // Формируем плоский массив всех бронирований
        const arr = [];
        Object.entries(allB).forEach(([login, list]) => {
          list.forEach(item => {
            arr.push({
              mentorLogin: login,
              mentorName: nameMap[login] || login,
              date: item.date,
              time: item.time
            });
          });
        });

        setBookings(arr);
      })();
    }, [])
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Мои записи</Text>
	  
	  
      <FlatList
        data={bookings}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Записей нет</Text>}
        renderItem={({ item }) => (
        

		<View style={styles.bookingItem}>
		
            <Text style={styles.bookingText}>
              {item.mentorName}: {item.date} {item.time}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 20
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  },
  bookingItem: {
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 6,
    marginBottom: 10
  },
  bookingText: {
    fontSize: 16
  }
});
