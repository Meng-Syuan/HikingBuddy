import { useAuth } from '@clerk/clerk-react';
import styled from 'styled-components';
import { schedulesDB } from '@utils/firestore';
import { useScheduleArrangement } from '@utils/zustand';
import { useNavigate } from 'react-router-dom';

const StyledBtn = styled.button``;

const StoreScheduleBtn = () => {
  const { userId } = useAuth();
  const { tripName, itineraries, setItineraries } = useScheduleArrangement();
  const navigate = useNavigate();
  const handleSaveClick = () => {
    const isNotCompleted = itineraries.find(
      (itinerary) => isNaN(itinerary.date) || !itinerary.datetime
    );

    if (!isNotCompleted && tripName) {
      schedulesDB.useSaveSchedule(userId, tripName, itineraries);
      console.log('條件符合');
      alert('儲存成功，到個人頁面查看');
      navigate('/profile');
      setItineraries(null);
    } else {
      alert('請完成路線命名及日期、時間填寫');
    }
  };
  return <StyledBtn onClick={handleSaveClick}>儲存行程表</StyledBtn>;
};

export default StoreScheduleBtn;
