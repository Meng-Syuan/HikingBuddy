import db from '../firebase/firebaseConfig.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function getFirestoreDocs(path, queryKey, queryValue) {
  const collectionRef = collection(db, path);
  try {
    const snapshot =
      queryKey && queryValue
        ? await getDocs(query(collectionRef, where(queryKey, '==', queryValue)))
        : await getDocs(collectionRef);

    if (snapshot.empty) {
      console.log('沒找到');
      return null;
    }
    const result = [];
    snapshot.forEach((doc) => {
      result.push(doc.data());
    });
    console.log(result);
    return result;
  } catch (error) {
    throw new Error('讀取資料失敗，請稍後再試，或聯絡系統管理員😵');
  }
}
