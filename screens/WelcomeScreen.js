import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  const [mentorName, setMentorName] = useState('Mentor');

  useEffect(() => {
    async function loadMentorName() {
      try {
        const json = await AsyncStorage.getItem('mentorProfile');
        if (json) {
          const data = JSON.parse(json);
          setMentorName(data.name || 'Mentor');
        }
      } catch (e) {
        console.error('Ошибка загрузки имени ментора', e);
      }
    }
    loadMentorName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Добро пожаловать, {mentorName}!</Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginChoice')}>
          <Ionicons name="sync" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Action Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, styles.cardProfile]}
          onPress={() => navigation.navigate('MentorProfile')}
        >
          <Ionicons name="person-circle-outline" size={28} color="#fff" />
          <Text style={styles.cardTitle}>Мой профиль</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardBookings]}
          onPress={() => navigation.navigate('MentorProfile')}
        >
          <Ionicons name="calendar-outline" size={28} color="#fff" />
          <Text style={styles.cardTitle}>Мои записи</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardList]}
          onPress={() => navigation.navigate('MentorList')}
        >
          <Ionicons name="people-outline" size={28} color="#fff" />
          <Text style={styles.cardTitle}>Менторы</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardtime]}
          onPress={() => navigation.navigate('windows', { mentor: mentorName })}
        >
          <Ionicons name="time" size={28} color="#fff" />
          <Text style={styles.cardTitle}>Мои окошки</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardFull, styles.cardAbout]}
          onPress={() => navigation.navigate('About')}
        >
          <Ionicons name="information-circle-outline" size={28} color="#333" />
          <Text style={styles.cardTitleDark}>О нас</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardFull, styles.cardExtras]}
          onPress={() => navigation.navigate('Extras')}
        >
          <Ionicons name="gift-outline" size={28} color="#333" />
          <Text style={styles.cardTitleDark}>Плюшки</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
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
        <TouchableOpacity onPress={() => navigation.navigate('MentorProfile')}>
          <Ionicons name="person-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F3F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    padding: 16
  },
  greeting: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  searchInput: { flex: 1, marginLeft: 8, color: '#333' },

  cardsContainer: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  card: {
    width: '48%',
    backgroundColor: '#8C6FF7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  cardFull: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardProfile: { backgroundColor: '#10B981' },
  cardBookings: { backgroundColor: '#F59E0B' },
  cardList: { backgroundColor: '#6366F1' },
  cardBook: { backgroundColor: '#3B82F6' },
  cardtime: { backgroundColor: '#d27960' },
  cardAbout: {},
  cardExtras: {},

  cardTitle: { color: '#fff', fontSize: 16, marginTop: 8, fontWeight: '600' },
  cardTitleDark: { color: '#333', fontSize: 16, fontWeight: '600', marginLeft: 12 },

  bottomNav: {
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