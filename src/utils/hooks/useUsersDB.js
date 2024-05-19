import db from '../firebase/firebaseConfig.js';
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '@clerk/clerk-react';
import { useUserState } from '@/zustand';

const useUsersDB = () => {
  const { isTestingAccount } = useUserState();
  const { userId } = useAuth();
  const userDocRef = isTestingAccount
    ? doc(db, 'users', 'testAccount')
    : userId
    ? doc(db, 'users', userId)
    : null;

  const getActiveScheduleIdByPassword = async (password) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('hashedPassword', '==', password));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log('This password is invalid.');
        return null;
      } else {
        const userDoc = querySnapshot.docs[0];
        const activeScheduleId = userDoc.data().activeSchedule;
        return activeScheduleId;
      }
    } catch (error) {
      console.log('Failed to check protector validation.');
      console.log(error);
      return null;
    }
  };

  const deleteTargetData = async (property, item) => {
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const targetData = docSnap.data()[property];
        const updatedItems = targetData.filter((value) => value !== item);
        await updateDoc(userDocRef, {
          [property]: updatedItems,
        });
        console.log(`Successfully delete ${item} from ${property}.`);
      } else {
        console.log('No this user info.');
      }
    } catch (error) {
      console.log(`Failed to delete the user ${item} in ${property}`);
      console.log(error);
    }
  };

  return {
    getActiveScheduleIdByPassword,
    deleteTargetData,
  };
};

export default useUsersDB;
