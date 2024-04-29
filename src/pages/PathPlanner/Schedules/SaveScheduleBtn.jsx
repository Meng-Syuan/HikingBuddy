import { useAuth } from '@clerk/clerk-react';
import styled from 'styled-components';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import { useScheduleArrangement, useUserState } from '@utils/zustand';
import { useNavigate } from 'react-router-dom';

const StyledBtn = styled.button``;

const SaveScheduleBtn = () => {
  const { futureSchedules, setUserState } = useUserState();
  const {
    temporaryScheduleId,
    tripName,
    itineraries_dates,
    itineraries_datetime,
    setScheduleArrangement,
    gpxFileName,
  } = useScheduleArrangement();
  const { useSaveScheduleToUsersDB } = useUsersDB();
  const { saveScheduleDetails } = useSchedulesDB();
  const navigate = useNavigate();

  const handleSaveClick = async () => {
    const result = checkReqirement();
    if (!result) {
      console.log('填寫未完成');
      alert('請完成路線命名及日期、時間填寫');
    } else {
      alert('填寫完成');
      await saveScheduleDetails(
        temporaryScheduleId,
        itineraries_dates,
        itineraries_datetime,
        tripName,
        gpxFileName
      );
      await useSaveScheduleToUsersDB(temporaryScheduleId);

      const newSchedule = getNewScheduleInfo();
      console.log('futureSchedules');
      console.log(futureSchedules);
      const newFutureSchedules = [...futureSchedules, newSchedule];
      newFutureSchedules.sort((a, b) => a.lastDay - b.lastDay);
      console.log(newFutureSchedules);
      console.log('newFutureSchedules');
      setUserState('futureSchedules', newFutureSchedules);

      setScheduleArrangement('tripName', '');
      setScheduleArrangement('itineraries_dates', []);
      setScheduleArrangement('itineraries_datetime', []);
      setScheduleArrangement('temporaryScheduleId', null);
      setScheduleArrangement('gpxPoints', null);
      setScheduleArrangement('gpxFileName', '');
      setScheduleArrangement('mapMarkers', []);
      alert('儲存成功，到個人頁面查看');
      navigate('/profile');
      //把schedule 清空
    }
  };

  const getNewScheduleInfo = () => {
    const dates = itineraries_dates.map((itinerary) => itinerary.date);
    const firstDay = Math.min(...dates);
    const lastDay = Math.max(...dates);
    return {
      id: temporaryScheduleId,
      firstDay,
      lastDay,
      isChecklistComfirmed: false,
    };
  };

  const checkReqirement = () => {
    const isDatesNotCompleted = itineraries_dates.find(
      (itinerary) => isNaN(itinerary.date) || !itinerary.date
    );
    const isDatetimeNotCompelte = itineraries_datetime.find(
      (itinerary) => isNaN(itinerary.datetime) || !itinerary.datetime
    );
    if (!isDatesNotCompleted && !isDatetimeNotCompelte && tripName) {
      return true;
    } else {
      return false;
    }
  };

  return <StyledBtn onClick={handleSaveClick}>儲存行程表</StyledBtn>;
};

export default SaveScheduleBtn;
