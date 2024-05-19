import db from '@/utils/firebase/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export default async function deleteFirestoreDoc(path, id) {
  const docRef = doc(db, path, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(`刪除資料(${id})失敗，請稍後再試，或聯絡系統管理員😳。`);
  }
}
