import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

// 1) Ваши креды из Firebase console → Project settings → SDK setup
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: '…',
  appId: '…'
};

// 2) Инициализация
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3) Экспорт функций

/**
 * Добавляет нового ментора в коллекцию "mentors"
 */
export async function addMentor({ login, name, avatar, specialization, workingHours, workingDays }) {
  return await addDoc(collection(db, 'mentors'), {
    login,
    name,
    avatar,
    specialization,
    workingHours,
    workingDays
  });
}

/**
 * Возвращает массив всех менторов
 */
export async function fetchMentors() {
  const snap = await getDocs(collection(db, 'mentors'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Получить одного ментора по полю login
 */
export async function getMentorByLogin(login) {
  const q = query(collection(db, 'mentors'), where('login', '==', login));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))[0] || null;
}