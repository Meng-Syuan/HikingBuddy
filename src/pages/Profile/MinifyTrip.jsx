import styled from 'styled-components';
import { lightFormat } from 'date-fns';
import color from '@utils/theme';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { sha256 } from 'js-sha256';
import { useScheduleData } from '@utils/zustand';

const TripWrapper = styled.div`
  width: 90%;
  height: 35px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 10px;
  background-color: ${color.lightBackgroundColor};
  &:hover {
    cursor: pointer;
    transform: scale(1.02);
    transition: all 0.1s;
    box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);
  }
`;
const CheckBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.ischecked === 'true' ? color.secondary : color.borderColor};
`;
const Content = styled.div`
  letter-spacing: 1px;
`;
const DeleteBtn = styled.button``;

const MinifyTrip = ({ id, firstDay, lastDay, isChecked }) => {
  const { setScheduleId } = useScheduleData();
  const encriptedId = useRef('');
  const navigate = useNavigate();
  const firstDayContent = lightFormat(firstDay, 'M/d');
  const lastDayContent = lightFormat(lastDay, 'M/d');
  const content = `${firstDayContent} - ${lastDayContent}`;

  // const encryptedId = sha256(scheduleIdRef.current);
  const showScheduleDetails = () => {
    // alert('展開行程表');
    navigate(`/profile/schedule-details/${id}`);
    //寫入裝備清單!

    //
  };
  return (
    <TripWrapper onClick={showScheduleDetails}>
      <CheckBox ischecked={isChecked.toString()}></CheckBox>
      <Content>{content}</Content>
      <DeleteBtn>刪除</DeleteBtn>
    </TripWrapper>
  );
};

export default MinifyTrip;
