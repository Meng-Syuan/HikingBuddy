import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useUserState,
  useProtectorPageData,
  useScheduleState,
  useScheduleArrangement,
} from '@utils/zustand';
import { useAuth } from '@clerk/clerk-react';

import HikerInfo from './HikerInfo';
import Tabs from './Tabs';
import { useState, useEffect } from 'react';
import { sha256 } from 'js-sha256';
import useProtectorsDB from '@utils/hooks/useProtectorsDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
//#region
const ProtectorContainer = styled.main`
  width: 80vw;
  display: flex;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const TabsContainer = styled.section`
  min-height: 100vh;
  flex: 2 1 530px;
`;

const firestoreDocIdLength = 20;
//#endregion
const Protector = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const navigate = useNavigate();
  const scheduleId = useParams().encryptedScheduleId;
  const { isSignedIn } = useAuth();
  const { userData } = useUserState();
  const { setScheduleState, scheduleInfo, scheduleDetails } =
    useScheduleState();
  const { setScheduleArrangement } = useScheduleArrangement();
  const { setProtectorPageData } = useProtectorPageData();
  const { hashKey, getProtectorDoc } = useProtectorsDB();
  const { getActiveScheduleIdByPassword } = useUsersDB();
  const { getScheduleDetails, getScheduleInfo } = useSchedulesDB();

  //determine the perspective and fetch the target data
  useEffect(() => {
    const checkStatus = async () => {
      const hashedPassword = sha256.hmac(scheduleId, hashKey);
      if (!isSignedIn && scheduleId.length <= firestoreDocIdLength) {
        alert('請先登入😊');
        navigate('/');
      } else if (isSignedIn && scheduleId.length <= firestoreDocIdLength) {
        const encryptedId = sha256(scheduleId);
        const hashedPassword = sha256.hmac(encryptedId, hashKey);
        const id = await getActiveScheduleIdByPassword(hashedPassword);
        if (id) {
          const hikerInfo = await getProtectorDoc(id);
          setProtectorPageData('hikerInfo', hikerInfo);
          setProtectorPageData('hikerPhoto', hikerInfo.hiker_photo);
          const scheduleDetails = await getScheduleDetails(id);
          const ScheduleInfo = await getScheduleInfo(id);
          setScheduleState('scheduleDetails', scheduleDetails);
          setScheduleState('ScheduleInfo', ScheduleInfo);
          setIsEditable(true);
          setIsUrlValid(true);
        } else {
          alert('請先到行程表下方啟用留守人功能 😊');
          navigate('/profile');
        }
      } else if (scheduleId.length > firestoreDocIdLength) {
        const id = await getActiveScheduleIdByPassword(hashedPassword);
        if (id) {
          const hikerInfo = await getProtectorDoc(id);
          setProtectorPageData('hikerInfo', hikerInfo);
          setProtectorPageData('hikerPhoto', hikerInfo.hiker_photo);
          const scheduleDetails = await getScheduleDetails(id);
          console.log('scheduleDetails');
          console.log(scheduleDetails);
          const scheduleInfo = await getScheduleInfo(id);
          setScheduleState('scheduleDetails', scheduleDetails);
          setScheduleState('ScheduleInfo', scheduleInfo);
          setIsEditable(false);
          setIsUrlValid(true);
        } else {
          alert('此網址功能未生效');
          navigate('/');
        }
      }
    };
    checkStatus();
  }, [scheduleId, userData]);

  useEffect(() => {
    if (!scheduleInfo) return;
    const gpxPoints = scheduleInfo?.gpxPoints;
    // const gpxFileName = scheduleInfo?.gpxFileName || '';
    console.log(gpxPoints);
    // console.log(gpxFileName);
    setScheduleArrangement('gpxPoints', gpxPoints);
    // setScheduleArrangement('gpxFileName', gpxFileName);
  }, [scheduleInfo]);

  useEffect(() => {
    if (!scheduleDetails) return;
    console.log(scheduleDetails);
    const mapMarkers = scheduleDetails.map((location) => {
      return {
        lat: location.geopoint._lat,
        lng: location.geopoint._long,
        id: location.itineraryId,
        name: location.location,
        ETA: location.datetime,
        isArrived: location?.isArrived,
        arrivalTime: location?.arrivalTime,
      };
    });
    setScheduleArrangement('mapMarkers', mapMarkers);
  }, [scheduleDetails]);

  return (
    <ProtectorContainer>
      <TabsContainer>
        <Tabs isEditable={isEditable} />
      </TabsContainer>
      <HikerInfo
        isEditable={isEditable}
        id={scheduleId}
        valid={isUrlValid}
      ></HikerInfo>
    </ProtectorContainer>
  );
};

export default Protector;
