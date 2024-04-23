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
  writeBatch,
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
  const { userData, setFutureSchedules, setPastSchedules } = useUserData();
  const { setScheduleData } = useScheduleData();
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
      gearChecklist: [
        { id: '大背包', isChecked: false },
        { id: '風雨衣、雨褲、鞋套', isChecked: false },
        { id: '中層外套', isChecked: false },
        { id: '保暖手套', isChecked: false },
        { id: '遮陽帽', isChecked: false },
        { id: '毛帽', isChecked: false },
        { id: '頭燈+電池', isChecked: false },
        { id: '登山杖', isChecked: false },
        { id: '雙鍋組+瓦斯+爐頭+插匙', isChecked: false },
        { id: '杯子', isChecked: false },
        { id: '充氣枕頭、睡墊', isChecked: false },
        { id: '拖鞋', isChecked: false },
        { id: '護膝', isChecked: false },
        { id: '濾水器、水袋', isChecked: false },
        { id: '行動電源', isChecked: false },
        { id: '充電線', isChecked: false },
        { id: '打火機、牙刷', isChecked: false },
        { id: '速乾毛巾', isChecked: false },
      ],
      otherItemChecklist: [
        { id: '面紙、濕紙巾', isChecked: false },
        { id: '夾鏈袋、垃圾袋', isChecked: false },
        { id: '暖暖包', isChecked: false },
        { id: '耳塞、眼罩', isChecked: false },
        { id: '眼鏡/隱形眼鏡', isChecked: false },
        { id: '座墊', isChecked: false },
        { id: '行動糧食', isChecked: false },
        { id: '茶包/咖啡包/湯包', isChecked: false },
        { id: '登山計劃書', isChecked: false },
        { id: '入山證正副本', isChecked: false },
        { id: '身分證', isChecked: false },
        { id: '健保卡', isChecked: false },
        { id: '頭燈備用電池', isChecked: false },
        { id: '救生毯', isChecked: false },
        { id: '藥品', isChecked: false },
        { id: '無線電', isChecked: false },
        { id: '備用衣物（長袖、短袖、短褲、內褲、襪子）', isChecked: false },
      ],
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
            isChecklistComfirmed: false,
          });
        } else {
          pastSchedules.push({
            id,
            firstDay,
            lastDay,
            isChecklistComfirmed: false,
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
        setScheduleData('scheduleInfo', data);
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
      setScheduleData('scheduleDetails', result);
    } catch (error) {
      console.log('Failed to fetch the current schedule details: ' + error);
    }
  };

  const getLocationNotes = async () => {};

  const updateScheduleContents = async (
    scheduleId,
    property,
    content,
    otherContent
  ) => {
    try {
      const scheduleDocRef = doc(schedulesRef, scheduleId);
      if (property === 'locationNotes') {
        await updateDoc(scheduleDocRef, {
          locationNotes: { ...content },
        });
      } else if (property === 'checklist') {
        await updateDoc(scheduleDocRef, {
          gearChecklist: [...content],
          otherItemChecklist: [...otherContent],
        });
      } else if (property === 'isActive') {
        await updateDoc(scheduleDocRef, {
          isActive: content,
        });
      }
    } catch (error) {
      console.log('Failed to update contents to current schedule.');
      console.log(error);
    }
  };

  return {
    addLocationToDB,
    useTemporaryLocations,
    useNewItineraryListener,
    useSaveSchedule,
    // getActiveScheduleId,
    useSortSchedulesDates,
    getScheduleInfo,
    getScheduleDetails,
    getLocationNotes,
    updateScheduleContents,
  };
};

export default useSchedulesDB;
//single
// export const getFirestoreData = async () => {
//   const docRef = doc(db, 'example', 'example-document');
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     console.log('Document data:', docSnap.data());
//   } else {
//     // docSnap.data() will be undefined in this case
//     console.log('No such document!');
//   }
// };

//batch寫入
// const updateActiveSchedule = async (id) => {
//   try {
//     const batch = writeBatch(db);
//     const activeDocSnapshot = await getDocs(q_activeSchedule);
//     activeDocSnapshot.forEach((doc) => {
//       batch.update(doc.ref, { isActive: false });
//     });

//     const scheduleDocRef = doc(schedulesRef, id);
//     await updateDoc(scheduleDocRef, { isActive: true });
//   } catch (error) {
//     console.log('Failed to batch update active status: ');
//     console.log(error);
//   }
// };
