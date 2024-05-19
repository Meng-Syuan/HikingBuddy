import db from '../firebase/firebaseConfig.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function updateFirestoreTargetData(
  path,
  target,
  targetItem
) {
  const docRef = doc(db, path);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const targetData = docSnap.data()[target];
      const updatedItems = targetData.filter((value) => value !== targetItem);
      await updateDoc(docRef, {
        [target]: updatedItems,
      });
    }
  } catch (error) {
    throw new Error('刪除失敗，請稍後再試，或聯絡系統管理員😳。');
  }
}
