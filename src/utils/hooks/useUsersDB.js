import db from '../firebase/firebaseConfig.js';
import {
  doc,
  collection,
  query,
  where,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '@clerk/clerk-react';

const useUsersDB = () => {
  const { userId } = useAuth();
  const userDocRef = userId ? doc(db, 'users', userId) : null;

  const setUsersDB = async (userId, display_name) => {
    try {
      if (userDocRef) {
        await setDoc(
          userDocRef,
          {
            userId,
            username: display_name,
          },
          { merge: true }
        );
        console.log('users data has been stored.');
      } else {
        console.log('User ID is null');
      }
    } catch (error) {
      console.log('Error: ' + error);
    }
  };

  const useSaveScheduleToUsersDB = async (scheduleId) => {
    try {
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const schedulesIDs = userSnapshot.data().schedulesIDs;
        if (!schedulesIDs) {
          await updateDoc(userDocRef, {
            schedulesIDs: [scheduleId],
          });
        } else {
          schedulesIDs.push(scheduleId);
          await updateDoc(userDocRef, {
            schedulesIDs,
          });
        }
      }
    } catch (error) {
      console.log('Error with save current schedule to users DB: ');
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data;
      } else {
        console.log('No this user info.');
      }
    } catch (error) {
      console.log('Error: ' + error);
    }
  };

  const updateActiveSchedule = async (scheduleId) => {
    try {
      await updateDoc(userDocRef, {
        activeSchedule: scheduleId,
      });
    } catch (error) {
      console.log('Failed to update the active schedule.');
      console.log(error);
    }
  };

  const updateHashedPassword = async (hashedPassword) => {
    try {
      await updateDoc(userDocRef, {
        hashedPassword,
      });
    } catch (error) {
      console.log('Error :' + error);
    }
  };

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
    setUsersDB,
    useSaveScheduleToUsersDB,
    getUserData,
    updateActiveSchedule,
    updateHashedPassword,
    getActiveScheduleIdByPassword,
  };
};

export default useUsersDB;
