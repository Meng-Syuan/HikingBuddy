import db from '../firebase/firebaseConfig.js';
import { doc, setDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUserData } from '../zustand.js';

const useUsersDB = () => {
  const { userId } = useAuth();
  const userDocRef = userId ? doc(db, 'users', userId) : null;
  const { userData, setUserData } = useUserData();

  const setUsersDB = async (_userId_, _display_name_) => {
    try {
      if (userDocRef) {
        await setDoc(
          userDocRef,
          {
            userId,
            username: _display_name_,
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

  const useUsersData = async () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
          } else {
            console.log('No this user info.');
          }
        } catch (error) {
          console.log('Error: ' + error);
        }
      };
      fetchData();
    }, []);
  };

  return {
    setUsersDB,
    useSaveScheduleToUsersDB,
    useUsersData,
  };
};

export default useUsersDB;
