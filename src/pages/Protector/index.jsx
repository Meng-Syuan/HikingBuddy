import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

import gpxParser from 'gpxparser';
import { sha256 } from 'js-sha256';

//components
import HikerInfo from './HikerInfo';
import Tabs from './Tabs';

//utils
import useUsersDB from '@/hooks/useUsersDB';
import { Toast, showErrorToast } from '@/utils/sweetAlert';
import getDocById from '@/firestore/getDocById';
import getFirestoreDocs from '@/firestore/getFirestoreDocs';
import {
  useUserState,
  useProtectorPageData,
  useScheduleState,
  useScheduleArrangement,
} from '@/zustand';
//#region
const ProtectorContainer = styled.main`
  width: 1100px;
  display: flex;
`;

const TabsContainer = styled.section`
  min-height: 100vh;
  flex: 2 1 530px;
`;

const firestoreDocIdLength = 20;
//#endregion
const Protector = () => {
  const HASH_KEY = 'testing..rewrite later';
  const [isEditable, setIsEditable] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [gpxUrl, setGPXurl] = useState(null);
  const [gpxPoints, setGPXpoints] = useState(null);
  const navigate = useNavigate();
  const scheduleId = useParams().encryptedScheduleId;
  const { isSignedIn } = useAuth();
  const { userData } = useUserState();
  const { setScheduleState, scheduleInfo, scheduleDetails } =
    useScheduleState();
  const { setScheduleArrangement } = useScheduleArrangement();
  const { setProtectorPageData } = useProtectorPageData();
  const { getActiveScheduleIdByPassword } = useUsersDB();

  //determine the perspective and fetch the target data
  useEffect(() => {
    const checkStatus = async () => {
      const hashedPassword = sha256.hmac(scheduleId, HASH_KEY);
      if (!isSignedIn && scheduleId.length <= firestoreDocIdLength) {
        Toast.fire({
          title: '未登入',
          text: '請在右上角進行登入操作',
          icon: 'info',
        });
      } else if (isSignedIn && scheduleId.length <= firestoreDocIdLength) {
        const encryptedId = sha256(scheduleId);
        const hashedPassword = sha256.hmac(encryptedId, HASH_KEY);
        const id = await getActiveScheduleIdByPassword(hashedPassword);
        if (id) {
          try {
            const hikerInfo = await getDocById('protectors', id);
            setProtectorPageData('hikerInfo', hikerInfo || '');
            setProtectorPageData('hikerPhoto', hikerInfo?.hiker_photo || '');

            const scheduleDetails = await getFirestoreDocs(
              `schedules/${id}/itineraries`
            );
            console.log('scheduleDetails');
            console.log(scheduleDetails);
            const scheduleInfo = await getDocById('schedules', id);
            setScheduleState('scheduleDetails', scheduleDetails);
            setScheduleState('scheduleInfo', scheduleInfo);
            setIsEditable(true);
            setIsUrlValid(true);
          } catch (error) {
            await showErrorToast('讀取登山者資訊發生錯誤', error.message);
          }
        } else {
          await Toast.fire({
            icon: 'info',
            title: '導向使用者頁面',
            text: '請先到行程表下方啟用留守人功能 😊',
            position: 'center',
          });
          navigate('/profile');
        }
      } else if (scheduleId.length > firestoreDocIdLength) {
        const id = await getActiveScheduleIdByPassword(hashedPassword);
        if (id) {
          try {
            const hikerInfo = await getDocById('protectors', id);
            setProtectorPageData('hikerInfo', hikerInfo || '');
            setProtectorPageData('hikerPhoto', hikerInfo?.hiker_photo || '');

            const scheduleDetails = await getFirestoreDocs(
              `schedules/${id}/itineraries`
            );
            console.log('scheduleDetails');
            console.log(scheduleDetails);
            const scheduleInfo = await getDocById('schedules', id);
            setScheduleState('scheduleDetails', scheduleDetails);
            setScheduleState('scheduleInfo', scheduleInfo);
            setIsEditable(false);
            setIsUrlValid(true);
          } catch (error) {
            await showErrorToast('讀取登山者資訊發生錯誤', error.message);
          }
        } else {
          await Toast.fire({
            icon: 'info',
            title: '此網址未生效',
            position: 'center',
          });
          navigate('/');
        }
      }
    };
    checkStatus();
  }, [scheduleId, userData]);

  useEffect(() => {
    if (!scheduleInfo) return;
    const gpxUrl = scheduleInfo?.gpxUrl;
    const gearChecklist = scheduleInfo.gearChecklist;
    const otherItemChecklist = scheduleInfo.otherItemChecklist;
    const locationNotes = scheduleInfo.locationNotes;
    setGPXurl(gpxUrl);
    setScheduleState('gearChecklist', gearChecklist);
    setScheduleState('otherItemChecklist', otherItemChecklist);
    setScheduleState('locationNotes', locationNotes);
  }, [scheduleInfo]);

  useEffect(() => {
    if (!scheduleDetails) return;
    const mapMarkers = scheduleDetails.map((location) => {
      return {
        lat: location.geopoint._lat,
        lng: location.geopoint._long,
        id: location.itineraryId,
        name: location.location,
        ETA: location?.datetime,
        isArrived: location?.isArrived,
        arrivalTime: location?.arrivalTime,
      };
    });
    setScheduleArrangement('mapMarkers', mapMarkers);
  }, [scheduleDetails]);

  useEffect(() => {
    if (!gpxUrl) return;
    const parseGPX = async (url) => {
      const response = await fetch(url);
      const data = await response.text();
      const gpx = new gpxParser();
      gpx.parse(data);
      const gpxPoints = gpx.tracks[0].points.map((point) => [
        point.lat,
        point.lon,
      ]);
      setGPXpoints(gpxPoints);
    };
    parseGPX(gpxUrl);
  }, [gpxUrl]);

  return (
    <ProtectorContainer>
      {scheduleId !== 'no_active_schedule' && (
        <TabsContainer>
          <Tabs
            isEditable={isEditable}
            gpxPoints={gpxPoints}
            valid={isUrlValid}
          />
        </TabsContainer>
      )}
      <HikerInfo
        isEditable={isEditable}
        id={scheduleId}
        valid={isUrlValid}
      ></HikerInfo>
    </ProtectorContainer>
  );
};

export default Protector;
