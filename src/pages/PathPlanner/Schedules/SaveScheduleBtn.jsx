import { useAuth } from '@clerk/clerk-react';
import styled from 'styled-components';
import { schedulesDB } from '@utils/firestore';
import { useScheduleArrangement } from '@utils/zustand';
import { useNavigate } from 'react-router-dom';

const StyledBtn = styled.button``;

const StoreScheduleBtn = () => {
  const { userId } = useAuth();
  const { itineraries, setItineraries } = useScheduleArrangement();
  const navigate = useNavigate();
  const handleSaveClick = () => {
    schedulesDB.setTemporaryToFalse(userId);
    alert('儲存成功，到個人頁面查看');
    setItineraries(null);
    navigate('/profile');
  };
  return <StyledBtn onClick={handleSaveClick}>儲存行程表</StyledBtn>;
};

export default StoreScheduleBtn;
