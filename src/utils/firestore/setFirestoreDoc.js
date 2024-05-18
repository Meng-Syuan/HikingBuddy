import db from '@/utils/firebase/firebaseConfig.js';
import { doc, setDoc } from 'firebase/firestore';

export default async function setFirestoreDoc(path, id, content) {
  const docRef = doc(db, path, id);
  try {
    await setDoc(docRef, content, { merge: true });
  } catch (error) {
    throw new Error('無法寫入資料，請稍後再試，或聯絡系統管理員😳');
  }
}
