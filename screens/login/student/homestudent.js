import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const placeholderAvatar =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWBSSpBAK1Ti42EKdN4qttNVg2v8IPoq_ZY8LrTgls7qh-NB9E9C-3QmF8Gc-blkWi7dTjpAtCm0XB998M54vOA';

export default function StudentProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const greetAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('studentProfile');
        const data = json ? JSON.parse(json) : null;
        setProfile(data);
      } catch (e) {
        console.error(e);
      }
    })();

    Animated.sequence([
      Animated.timing(greetAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true
      }),
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start();
  }, []);

  if (!profile) return null;

  const cardActions = [
    { title: 'Мои данные', icon: 'person-circle-outline', screen: 'myprofile', color: '#10B981' },
    { title: 'Мои записи', icon: 'calendar-outline', screen: 'zapis',  color: '#F59E0B' },
    { title: 'Менторы',   icon: 'people-outline',      screen: 'MentorList',       color: '#6366F1' },
     {
      title: 'Записаться',
      icon: 'book-outline',
      screen: 'Booking',
      color: '#3B82F6',
      // Шаг 3: передаём profile (или нужный mentor) в params
      onPress: () => navigation.navigate('Booking', { mentor: profile })
    }
  ];
  const footerActions = [
    { title: 'О нас', icon: 'information-circle-outline', screen: 'About' },
    { title: 'Плюшки', icon: 'gift-outline', screen: 'Extras' }
  ];

  const scaleGreet = greetAnim.interpolate({ inputRange: [0,1], outputRange: [0.8,1] });
  const fadeCards  = cardsAnim;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Animated.Text style={[styles.greeting, { transform: [{ scale: scaleGreet }] }]}>
          Добро пожаловать, {profile.fullName.split(' ')[0]}!
        </Animated.Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginChoice')}>
          <Ionicons name="sync" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск..."
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <Animated.View style={{ opacity: fadeCards, alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={{ uri: profile.avatar || placeholderAvatar }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.phone}>{profile.phone}</Text>
        </Animated.View>

        {/* Action Cards */}
        <Animated.View style={{ opacity: fadeCards }}>
          <View style={styles.cardsContainer}>
            {cardActions.map((a, i) => (
              <TouchableOpacity
                key={a.title}
                style={[styles.card, { backgroundColor: a.color }]}
                onPress={() => navigation.navigate(a.screen)}
              >
                <Ionicons name={a.icon} size={28} color="#fff" />
                <Text style={styles.cardTitle}>{a.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {footerActions.map(a => (
        
			<TouchableOpacity
     key={a.title}
     style={[styles.card, { backgroundColor: a.color }]}
      onPress={() => {
        if (a.onPress) {
          a.onPress()
       } else {
          navigation.navigate(a.screen)
        }
      }}
    >
              <Ionicons name={a.icon} size={28} color="#333" />
              <Text style={styles.cardTitleDark}>{a.title}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

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
        <TouchableOpacity onPress={() => navigation.navigate('StudentProfile')}>
          <Ionicons name="person-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5' },
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

  container: { paddingHorizontal: 16 },

  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name:   { fontSize: 20, fontWeight: '600', color: '#333' },
  email:  { fontSize: 14, color: '#666', marginTop: 4 },
  phone:  { fontSize: 14, color: '#666', marginTop: 2 },

  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center'
  },
  cardFull: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center'
  },
  cardTitle: { color: '#fff', fontSize: 16, marginTop: 8, fontWeight: '600' },
  cardTitleDark: { color: '#333', fontSize: 16, marginLeft: 12, fontWeight: '600' },

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
