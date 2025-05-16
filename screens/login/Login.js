import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginChoiceScreen({ navigation }) {
	const [mentorName, setMentorName] = useState('Mentor');  // ⚡ Стейт в правильном месте
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
        <Text style={styles.greeting}>Доброе утро, {mentorName}!</Text>

        <TouchableOpacity onPress={() => console.log('Refresh')}>  
          <Ionicons name="sync" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Options cards grid */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#8C6FF7' }]}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.cardTitle}>Ученик</Text>
          <Text style={styles.cardSub}>Войти как ученик</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#F6D186' }]}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.cardTitleDark}>Ментор</Text>
          <Text style={styles.cardSubDark}>Войти как ментор</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cardFull, { backgroundColor: '#6EE7B7' }]}
          onPress={() => navigation.navigate('creatementor')}
        >
          <Text style={styles.cardTitleDark}>Регистрация</Text>
          <Text style={styles.cardSubDark}>Создать аккаунт ментора</Text>
        </TouchableOpacity>
      </View>

    

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Welcome')}>
          <Ionicons name="home-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MentorList')}>
          <Ionicons name="people-outline" size={24} color="#999" />
        </TouchableOpacity>
        <View style={styles.navSpacer} />
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Booking')}>
          <Ionicons name="calendar-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MentorProfile')}>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center'
  },
  cardFull: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center'
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  cardTitleDark: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  cardSubDark: { color: '#555', marginTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#6366F1',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
	marginTop: 460
  },
  navItem: { flex: 1, alignItems: 'center' },
  navSpacer: { width: 60 }
});
