import db from '../firebase/firebaseConfig.js';
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUserData } from '../zustand.js';

const useProtectorsDB = () => {
  //   const { userId } = useAuth();
  const hashKey = 'HIKING_BUDDY_protector';
  const protectorsRef = collection(db, 'protectors');

  const setProtectorsData = async (scheduleId) => {
    try {
      const docRef = doc(protectorsRef, scheduleId);
      await setDoc(docRef, {
        //測試一開始不寫入的話會怎麼樣
        backpack_color: '',
        clothe_color: '',
        hiker_photo: '',
        message: '',
      });
    } catch (error) {
      console.log('Failed to set protectors data');
      console.log(error);
    }
  };

  const getProtectorDoc = async (scheduleId) => {
    try {
      const docRef = doc(protectorsRef, scheduleId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    } catch (error) {
      console.log('Failed to get hiker info.');
      console.log(error);
    }
  };

  return { hashKey, setProtectorsData, getProtectorDoc };
};

export default useProtectorsDB;
