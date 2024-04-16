import { update } from 'firebase/database';
import db from './firebaseConfig.js';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  GeoPoint,
} from 'firebase/firestore';

export const usersDB = {
  async setUsersDB(userId, display_name) {
    const usersRef = doc(db, 'users', userId);
    try {
      await setDoc(
        usersRef,
        {
          userId,
          username: display_name,
        },
        { merge: true }
      );
      console.log('users data stores in the DB.');
    } catch (error) {
      console.log('Error: ' + error);
    }
  },
};

export const schedulesDB = {
  schedulesRef: collection(db, 'schedules'),
  async addLocation(userId, geopoint, location) {
    // const schedulesRef = collection(db, 'schedules');
    try {
      const q = query(
        this.schedulesRef,
        where('userId', '==', userId),
        where('isTemporary', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const newItinerary = {
        geopoint: new GeoPoint(geopoint.lat, geopoint.lng),
        location,
      };
      if (querySnapshot.empty) {
        const newDocRef = await addDoc(this.schedulesRef, {
          isActive: false,
          isTemporary: true,
          userId,
        });
        const itinerariesRef = collection(newDocRef, 'itineraries');
        const itinerariesDocRef = await addDoc(itinerariesRef, newItinerary);
        const itineraryId = itinerariesDocRef.id;
        await updateDoc(itinerariesDocRef, { itineraryId });
      } else {
        const doc = querySnapshot.docs[0];
        const itinerariesRef = collection(doc.ref, 'itineraries');
        const itinerariesDocRef = await addDoc(itinerariesRef, newItinerary);
        const itineraryId = itinerariesDocRef.id;
        await updateDoc(itinerariesDocRef, { itineraryId });
      }

      console.log(
        'Created a new document with itineraries collection successfully'
      );
    } catch (error) {
      console.log('Error: ' + error);
    }
  },

  async saveSchedules(
    method,
    userId,
    isActive,
    isTemporary,
    latlng,
    location,
    datetime
  ) {},

  async addDateTime(
    method,
    userId,
    isActive,
    isTemporary,
    latlng,
    location,
    datetime
  ) {},
  async addNote() {},

  async getLocations(userId) {
    try {
      const q = query(
        this.schedulesRef,
        where('userId', '==', userId),
        where('isTemporary', '==', true)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return;
      const doc = querySnapshot.docs[0];
      const itinerariesRef = collection(doc.ref, 'itineraries');
      const itinerariesSnapshot = await getDocs(itinerariesRef);
      const locations = itinerariesSnapshot.docs.map((itineraryDoc) =>
        itineraryDoc.data()
      );
      return locations;
    } catch (error) {
      console.log('Failed to get schedules data: ' + error);
    }
  },
};

//single
export const getFirestoreData = async () => {
  const docRef = doc(db, 'example', 'example-document');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!');
  }
};
