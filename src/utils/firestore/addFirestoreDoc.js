import db from '@/utils/firebase/firebaseConfig';
import { addDoc, updateDoc, collection } from 'firebase/firestore';

export default async function addFirestoreDoc(path, content, idKey) {
  const collectionRef = collection(db, path);
  try {
    const docRef = await addDoc(collectionRef, content);
    const docId = docRef.id;
    await updateDoc(docRef, { [idKey]: docId });
    return docId;
  } catch (error) {
    throw new Error('寫入資料失敗😵。請稍後再試，或洽系統管理員。');
  }
}
