import db from '../firebase/firebaseConfig.js';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { useScheduleArrangement } from '@utils/zustand.js';

export default function useNewItineraryListener(id) {
  const { setScheduleArrangement } = useScheduleArrangement();
  useEffect(() => {
    if (!id) return;
    const itinerariesRef = collection(db, 'schedules', id, 'itineraries');
    const unsubscribe = onSnapshot(itinerariesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const data = change.doc.data();
          setScheduleArrangement('newItinerary', data);
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, [id]);
}
