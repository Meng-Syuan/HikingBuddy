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
import { useUserState } from '../zustand.js';

const useUsersDB = () => {
  const { isTestingAccount } = useUserState();
  const { userId } = useAuth();
  const userDocRef = isTestingAccount
    ? doc(db, 'users', 'testAccount')
    : userId
    ? doc(db, 'users', userId)
    : null;

  const setUsersDB = async (userId, display_name, userPhtoUrl) => {
    try {
      if (userDocRef) {
        await setDoc(
          userDocRef,
          {
            userId,
            username: display_name,
            userPhoto: userPhtoUrl,
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

  const getUserData = async () => {
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data;
      } else {
        console.log('No this user info.');
        return null;
      }
    } catch (error) {
      console.log('Error: ' + error);
    }
  };

  const updateUserDoc = async (property, content) => {
    try {
      await updateDoc(userDocRef, { [property]: content });
    } catch (error) {
      console.log('Failed to update userDoc info: ');
      console.log(error);
    }
  };

  const addUserInfo = async (property, id) => {
    try {
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const data = userSnapshot.data()[property];
        if (!data) {
          await updateDoc(userDocRef, {
            [property]: [id],
          });
        } else {
          data.push(id);
          await updateDoc(userDocRef, {
            [property]: data,
          });
        }
      }
    } catch (error) {
      console.log(`Failed to update user's ${property}:  `);
      console.log(error);
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
    setUsersDB,
    getUserData,
    updateUserDoc,
    addUserInfo,
    getActiveScheduleIdByPassword,
    deleteTargetData,
  };
};

export default useUsersDB;
