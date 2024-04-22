import db from '../firebase/firebaseConfig.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  GeoPoint,
  onSnapshot,
} from 'firebase/firestore';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import {
  useScheduleArrangement,
  useUserData,
  useScheduleData,
} from '../zustand.js';
import { isFuture } from 'date-fns';

const useSchedulesDB = () => {
  const { userId } = useAuth();
  const {
    userData,
    futureSchedules,
    setFutureSchedules,
    pastSchedules,
    setPastSchedules,
  } = useUserData();
  const { setScheduleInfo, setScheduleDetails } = useScheduleData();
  const schedulesRef = collection(db, 'schedules');
  const q_temporarySchedule = query(
    schedulesRef,
    where('userId', '==', userId),
    where('isTemporary', '==', true)
  );

  const addLocationToDB = async (geopoint, location) => {
    try {
      const querySnapshot = await getDocs(q_temporarySchedule);
      const newItinerary = {
        geopoint: new GeoPoint(geopoint.lat, geopoint.lng),
        location,
      };
      if (querySnapshot.empty) {
        const newDocRef = await addDoc(schedulesRef, {
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
        'Created a new document in itineraries collection successfully.'
      );
    } catch (error) {
      console.log('Error: ' + error);
    }
  };
  const useTemporaryLocations = async () => {
    try {
      const querySnapshot = await getDocs(q_temporarySchedule);
      if (querySnapshot.empty) return;
      const doc = querySnapshot.docs[0];
      const itinerariesRef = collection(doc.ref, 'itineraries');
      const itinerariesSnapshot = await getDocs(itinerariesRef);
      const locations = itinerariesSnapshot.docs.map((itineraryDoc) =>
        itineraryDoc.data()
      );
      return locations; //把 component 內的程式碼 useEffect 拉到這邊來寫？
    } catch (error) {
      console.log('Failed to get schedules data: ' + error);
    }
  };
  const useNewItineraryListener = () => {
    const unsubscribersRef = useRef([]);
    const { setNewItinerary } = useScheduleArrangement();

    useEffect(() => {
      //check where to add listener
      const checkQuery = async () => {
        const querySnapshot = await getDocs(q_temporarySchedule);
        if (querySnapshot.empty) {
          const unsubscribeSchedules = onSnapshot(schedulesRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const doc = change.doc;
                const data = change.doc.data();
                if (data.userId === userId && data.isTemporary === true) {
                  const itinerariesRef = collection(doc.ref, 'itineraries');
                  const unsubscribeItineraries = onSnapshot(
                    itinerariesRef,
                    (itinerariesSnapshot) => {
                      itinerariesSnapshot.docChanges().forEach((change) => {
                        if (change.type === 'modified') {
                          setNewItinerary(change.doc.data());
                        }
                      });
                    }
                  );
                  unsubscribersRef.current.push(unsubscribeItineraries);
                }
              }
            });
          });
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
                  console.log('modified');

                  if (change.type === 'modified') {
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
  };
  const useSaveSchedule = async (itineraries, tripName) => {
    const dates = itineraries.map((itinerary) => itinerary.date);
    const firstDay = Math.min(...dates);
    const lastDay = Math.max(...dates);
    const querySnapshot = await getDocs(q_temporarySchedule);
    if (querySnapshot.empty) return;
    const currentScheduleRef = querySnapshot.docs[0].ref;
    await updateDoc(currentScheduleRef, {
      isTemporary: false,
      tripName,
      firstDay,
      lastDay,
    });
    const itinerariesPromise = itineraries.map((itinerary) => {
      const itineraryDocRef = doc(
        currentScheduleRef,
        'itineraries',
        itinerary.itineraryId
      );
      return updateDoc(itineraryDocRef, {
        date: itinerary.date,
        datetime: itinerary.datetime,
      });
    });
    await Promise.all(itinerariesPromise);
    //add new schedule id to users DB
    return currentScheduleRef.id;
  };

  //protector
  const getActiveScheduleId = async () => {
    try {
      const q = query(
        schedulesRef,
        where('userId', '==', userId),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return;
      const activeScheduleId = querySnapshot.docs[0].id;
      return activeScheduleId;
    } catch (error) {
      console.log('Error: ' + error);
    }
  };

  const useSortSchedulesDates = async () => {
    if (!userData.schedulesIDs) return;
    const schedulesIDs = userData.schedulesIDs;
    const futureSchedules = [];
    const pastSchedules = [];
    try {
      const promises = schedulesIDs.map(async (id) => {
        const scheduleRef = doc(schedulesRef, id);
        const docSnap = await getDoc(scheduleRef);
        const lastDay = docSnap.data().lastDay;
        const firstDay = docSnap.data().firstDay;
        if (isFuture(lastDay)) {
          futureSchedules.push({
            id,
            firstDay,
            lastDay,
            isEquipmentComfirmed: false,
          });
        } else {
          pastSchedules.push({
            id,
            firstDay,
            lastDay,
            isEquipmentComfirmed: false,
          });
        }
      });
      await Promise.all(promises);
      setFutureSchedules(futureSchedules.sort((a, b) => a.lastDay - b.lastDay));
      setPastSchedules(pastSchedules.sort((a, b) => (b.lastDay = a.lastDay)));
    } catch (error) {
      console.log('Failed to group schedules : ' + error);
    }
  };

  const getScheduleInfo = async (id) => {
    try {
      const scheduleDocRef = doc(schedulesRef, id);
      const docSnap = await getDoc(scheduleDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setScheduleInfo(data);
      } else {
        console.log('No such schedule');
      }
    } catch (error) {
      console.log('Failed to get current schedule data: ' + error);
    }
  };

  const getScheduleDetails = async (id) => {
    try {
      const itinerariesRef = collection(schedulesRef, id, 'itineraries');
      const itinerariesSnapshot = await getDocs(itinerariesRef);
      const result = [];
      itinerariesSnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      setScheduleDetails(result);
    } catch (error) {
      console.log('Failed to fetch the current schedule details: ' + error);
    }
  };

  const addNotesToSchedule = async (scheduleId, locationNotes) => {
    try {
      const scheduleDocRef = doc(schedulesRef, scheduleId);
      await updateDoc(scheduleDocRef, {
        locationNotes: { ...locationNotes },
      });
    } catch (error) {
      console.log('Failed to add notes to current schedule.');
      console.log(error);
    }
  };

  const getLocationNotes = async () => {};

  return {
    addLocationToDB,
    useTemporaryLocations,
    useNewItineraryListener,
    useSaveSchedule,
    getActiveScheduleId,
    useSortSchedulesDates,
    getScheduleInfo,
    getScheduleDetails,
    addNotesToSchedule,
    getLocationNotes,
  };
};

export default useSchedulesDB;
//選定一種方法：組件內用 useEffect，還是拉出來的 function 用 useEffect？
//用 state 儲存值，還是 useRef？還是都丟出去給 component 用？
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
