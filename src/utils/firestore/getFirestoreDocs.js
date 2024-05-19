import db from '../firebase/firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

export default async function getFirestoreDocs(path) {
  const collectionRef = collection(db, path);
  try {
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
      return null;
    } else {
      const result = [];
      snapshot.forEach((doc) => {
        result.push(doc.data());
      });
      return result;
    }
  } catch (error) {
    throw new Error('讀取資料失敗，請稍後再試，或聯絡系統管理員😵');
  }
}
