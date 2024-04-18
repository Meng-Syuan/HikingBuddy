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
  onSnapshot,
} from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { useScheduleArrangement } from './zustand.js';

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
          isFinished: false,
          userId,
        });
        await updateDoc(newDocRef, { scheduleId: newDocRef.id });
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

  async addNote() {},

  async getTemporaryLocations(userId) {
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

  newItineraryListener(userId) {
    const unsubscribersRef = useRef([]);
    const { setNewItinerary } = useScheduleArrangement();

    useEffect(() => {
      const q = query(
        this.schedulesRef,
        where('userId', '==', userId),
        where('isTemporary', '==', true)
      );

      const checkQuery = async () => {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          const unsubscribeSchedules = onSnapshot(
            this.schedulesRef,
            (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                  const doc = change.doc;
                  const data = doc.data();
                  if (data.userId === userId && data.isTemporary === true) {
                    const itinerariesRef = collection(doc.ref, 'itineraries');
                    const unsubscribeItineraries = onSnapshot(
                      itinerariesRef,
                      (itinerariesSnapshot) => {
                        itinerariesSnapshot.docChanges().forEach((change) => {
                          if (change.type === 'modified') {
                            console.log('modified itineraries');
                            console.log('setNewItinerary...');
                            setNewItinerary(change.doc.data());
                          }
                        });
                      }
                    );
                    unsubscribersRef.current.push(unsubscribeItineraries);
                  }
                }
              });
            }
          );
          unsubscribersRef.current.push(unsubscribeSchedules);
        } else {
          querySnapshot.forEach((documentSnapshot) => {
            const itinerariesRef = collection(
              documentSnapshot.ref,
              'itineraries'
            );
            const unsubscribeItineraries = onSnapshot(
              itinerariesRef,
              (itinerariesSnapshot) => {
                itinerariesSnapshot.docChanges().forEach((change) => {
                  if (change.type === 'modified') {
                    console.log('modified itineraries');
                    console.log('setNewItinerary...');
                    setNewItinerary(change.doc.data());
                  }
                });
              }
            );
            unsubscribersRef.current.push(unsubscribeItineraries);
          });
        }
      };
      checkQuery();

      return () => {
        unsubscribersRef.current.forEach((unsubscribe) => {
          unsubscribe();
        });
      };
    }, []);
  },

  async setTemporaryToFalse(userId) {
    const q = query(
      this.schedulesRef,
      where('userId', '==', userId),
      where('isTemporary', '==', true)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const scheduleRef = querySnapshot.docs[0].ref;
      await updateDoc(scheduleRef, {
        isTemporary: false,
      });
    }
  },
}; //加條件判斷

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
