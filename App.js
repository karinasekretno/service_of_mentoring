import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import BookingScreen from './screens/BookingScreen';
import AboutScreen from './screens/AboutScreen';
import ExtrasScreen from './screens/ExtrasScreen';
import Login from './screens/login/Login';
import LoginScreen from './screens/login/LoginScreen';
import MentorFormScreen from './screens/login/MentorFormScreen';
import MentorListScreen from './screens/MentorListScreen';
import creatementor from './screens/login/creatementor';
import MentorProfileScreen from './screens/mentor/MentorProfileScreen';
import zapis from './screens/mentor/zapis';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
 
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
	 
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Добро пожаловать' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Запись на менторство' }} />
			<Stack.Screen name="Login" component={Login} options={{ title: 'Авторизоваться' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'О нас' }} />
        <Stack.Screen name="Extras" component={ExtrasScreen} options={{ title: 'Плюшки' }} />    
  <Stack.Screen name="MentorForm" component={MentorFormScreen} options={{ title: 'Анкета ментора' }} />
  <Stack.Screen name="MentorList" component={MentorListScreen} options={{ title: 'Менторы' }} />
  <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Войти как ментор' }} />
  <Stack.Screen name="creatementor" component={creatementor} options={{ title: 'Создать аккаунт ментора' }} />
<Stack.Screen name="MentorProfile" component={MentorProfileScreen} options={{ title: 'Мой профиль' }} />
<Stack.Screen name="zapis" component={zapis} options={{ title: 'Записанные люди' }} />
      </Stack.Navigator>
    </NavigationContainer>


  );
  
}
