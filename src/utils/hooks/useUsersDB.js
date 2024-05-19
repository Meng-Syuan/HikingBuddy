import db from '../firebase/firebaseConfig.js';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
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

  return {
    getActiveScheduleIdByPassword,
  };
};

export default useUsersDB;
