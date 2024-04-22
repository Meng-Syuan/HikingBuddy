import { useAuth } from '@clerk/clerk-react';
import styled from 'styled-components';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import { useScheduleArrangement } from '@utils/zustand';
import { useNavigate } from 'react-router-dom';

const StyledBtn = styled.button``;

const StoreScheduleBtn = () => {
  const { userId } = useAuth();
  const { tripName, itineraries, setItineraries } = useScheduleArrangement();
  const { useSaveScheduleToUsersDB } = useUsersDB();
  const { useSaveSchedule } = useSchedulesDB();
  const navigate = useNavigate();
  const handleSaveClick = async () => {
    const isNotCompleted = itineraries.find(
      (itinerary) => isNaN(itinerary.date) || !itinerary.datetime
    );

    if (!isNotCompleted && tripName) {
      console.log('填寫完成');
      const scheduleId = await useSaveSchedule(itineraries, tripName);
      await useSaveScheduleToUsersDB(scheduleId);
      alert('儲存成功，到個人頁面查看');
      navigate('/profile');
      setItineraries(null);
    } else {
      console.log('填寫未完成');
      alert('請完成路線命名及日期、時間填寫');
    }
  };
  return <StyledBtn onClick={handleSaveClick}>儲存行程表</StyledBtn>;
};

export default StoreScheduleBtn;
