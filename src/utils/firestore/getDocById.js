//firebase
import db from '@/utils/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function getDocById(path, id) {
  const docRef = doc(db, path, id);
  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    } else {
      const data = snapshot.data();
      return data;
    }
  } catch (error) {
    throw new Error('讀取資料錯誤，請稍後再試😵');
  }
}
