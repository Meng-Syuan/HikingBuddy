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
  deleteDoc,
} from 'firebase/firestore';
import { useAuth } from '@clerk/clerk-react';
import { isFuture } from 'date-fns';

const useSchedulesDB = () => {
  const { userId } = useAuth();
  const schedulesRef = collection(db, 'schedules');
  const q_temporarySchedule = query(
    schedulesRef,
    where('userId', '==', userId),
    where('isTemporary', '==', true)
  );

  const addLocationToDB = async (id, geopoint, location) => {
    try {
      const newItinerary = {
        geopoint: new GeoPoint(geopoint.lat, geopoint.lng),
        location,
      };
      const itinerariesRef = collection(schedulesRef, id, 'itineraries');
      const itinerariesDocRef = await addDoc(itinerariesRef, newItinerary);
      const itineraryId = itinerariesDocRef.id;
      await updateDoc(itinerariesDocRef, { itineraryId });
      return itineraryId;
    } catch (error) {
      console.log('Error: ' + error);
    }
  };

  const addArrivalTime = async (scheduleId, itineraryId, time) => {
    try {
      const docRef = doc(schedulesRef, scheduleId, 'itineraries', itineraryId);
      await updateDoc(docRef, {
        arrivalTime: time,
        isArrived: true,
      });
    } catch (error) {
      console.log(`Failed to write arrival time to ${itineraryId} itinerary.`);
      console.log(error);
    }
  };

  const deleteItinerary = async (id, itineraryId) => {
    const deletionDoc = doc(schedulesRef, id, 'itineraries', itineraryId);
    await deleteDoc(deletionDoc);
  };

  const saveScheduleDetails = async (
    id,
    tripName,
    gpxFileName,
    scheduleBlocks
  ) => {
    const dates = [];
    const itinerariesTimeInfo = [];
    for (let key in scheduleBlocks) {
      key !== 'notArrangedBlock' ? dates.push(Number(key)) : '';
      scheduleBlocks[key].items.forEach((item) => {
        itinerariesTimeInfo.push({
          id: item.id,
          date: Number(key),
          datetime: Number(key) + item.timeDiff,
        });
      });
    }

    const firstDay = Math.min(...dates);
    const lastDay = Math.max(...dates);
    const docRef = doc(schedulesRef, id);
    await updateDoc(docRef, {
      gpxFileName,
      isTemporary: false,
      tripName,
      firstDay,
      lastDay,
      isChecklistConfirmed: false,
      gearChecklist: [
        { id: '登山包', isChecked: false },
        { id: '攻頂包', isChecked: false },
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

    const itinerariesPromise = itinerariesTimeInfo.map((itinerary) => {
      const itineraryDocRef = doc(docRef, 'itineraries', itinerary.id);
      return updateDoc(itineraryDocRef, {
        date: itinerary.date,
        datetime: itinerary.datetime,
      });
    });
    await Promise.all(itinerariesPromise);
  };

  const sortSchedulesDates = async (userData) => {
    if (!userData.schedulesIDs) return;
    const schedulesIDs = userData.schedulesIDs;
    const futureSchedules = [];
    const pastSchedules = [];
    try {
      const promises = schedulesIDs.map(async (id) => {
        const scheduleRef = doc(schedulesRef, id);
        const docSnap = await getDoc(scheduleRef);
        const tripName = docSnap.data().tripName;
        const lastDay = docSnap.data().lastDay;
        const firstDay = docSnap.data().firstDay;
        const isChecklistConfirmed = docSnap.data().isChecklistConfirmed;
        if (isFuture(lastDay)) {
          futureSchedules.push({
            id,
            firstDay,
            lastDay,
            tripName,
            isChecklistConfirmed,
          });
        } else {
          pastSchedules.push({
            id,
            firstDay,
            lastDay,
            tripName,
          });
        }
      });
      await Promise.all(promises);
      futureSchedules.sort((a, b) => a.lastDay - b.lastDay);
      pastSchedules.sort((a, b) => b.lastDay - a.lastDay);
      return { futureSchedules, pastSchedules };
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
        return data;
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
      if (itinerariesSnapshot.empty) {
        return null;
      } else {
        const locations = [];
        itinerariesSnapshot.forEach((doc) => {
          locations.push(doc.data());
        });
        return locations;
      }
    } catch (error) {
      console.log('Failed to fetch the current schedule details: ' + error);
    }
  };

  const getTemporaryScheduleId = async () => {
    try {
      const querySnapshot = await getDocs(q_temporarySchedule);
      if (querySnapshot.empty) {
        return null;
      } else {
        const result = querySnapshot.docs[0].id;
        return result;
      }
    } catch (error) {
      console.log('Failed to get temporarySchedule docs.');
    }
  };

  const createNewSchedule = async () => {
    try {
      const newDocRef = await addDoc(schedulesRef, {
        isTemporary: true,
        isFinished: false,
        userId,
      });
      return newDocRef.id;
    } catch (error) {
      console.log('Failed to createNewSchedule');
      console.log(error);
    }
  };

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
      } else {
        await updateDoc(scheduleDocRef, {
          [property]: content,
        });
      }
    } catch (error) {
      console.log('Failed to update contents to current schedule.');
      console.log(error);
    }
  };

  return {
    getTemporaryScheduleId,
    createNewSchedule,
    addLocationToDB,
    addArrivalTime,
    deleteItinerary,
    saveScheduleDetails,
    sortSchedulesDates,
    getScheduleInfo,
    getScheduleDetails,
    updateScheduleContents,
  };
};

export default useSchedulesDB;
