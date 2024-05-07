import styled from 'styled-components';
import { lightFormat } from 'date-fns';
import color from '@utils/theme';
import { useNavigate } from 'react-router-dom';
import { useUserState, useScheduleState } from '@utils/zustand';
import useUsersDB from '@utils/hooks/useUsersDB';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import { Tooltip } from 'react-tippy';

import sweetAlert from '@utils/sweetAlert';
import { useEffect, useState } from 'react';

const TripWrapper = styled.div`
  width: 100%;
  height: 35px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0px 2px 10px;
  border: 1px solid #d9d9d9;
  position: relative;
  &:hover {
    cursor: pointer;
    transform: scale(1.02);
    transition: all 0.15s;
    box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);
  }
`;
const CheckBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${(props) =>
    props['data-is-checked'] ? color.secondary : color.borderColor};
`;

const PastTripPrefix = styled(CheckBox)`
  visibility: hidden;
`;

const Content = styled.div`
  letter-spacing: 1px;
  margin-right: 1rem;
`;

const Badge = styled.div`
  position: absolute;
  right: 2.5rem;
  height: 1rem;
  font-size: 0.6rem;
  border-radius: 15px;
  border: 1px solid #ff8800;
  background-color: #e78f1b66;
  padding: 2px;
  display: flex;
  align-items: center;
`;
const MinifyTrip = ({ id, firstDay, lastDay, tripName, type }) => {
  const { deleteTargetData } = useUsersDB();
  const { getScheduleInfo, getScheduleDetails } = useSchedulesDB();
  const { activeScheduleId, deleteTrip, listsConfirmedStatus } = useUserState();
  const { setScheduleState } = useScheduleState();
  const [isChecked, setIsChecked] = useState();
  const navigate = useNavigate();
  const firstDayContent = lightFormat(firstDay, 'M/d');
  const lastDayContent = lightFormat(lastDay, 'M/d');
  const content = `${firstDayContent} - ${lastDayContent}`;

  useEffect(() => {
    if (listsConfirmedStatus.length < 1 || type === 'pastSchedules') return;
    const status = listsConfirmedStatus.find(
      (trip) => trip.id === id
    ).isConfirmed;
    setIsChecked(status);
  }, [listsConfirmedStatus]);

  const handleDeleteTrip = async (e, type, id) => {
    e.stopPropagation(); //prevent navigate
    const { value: willDelete } = await sweetAlert.confirm(
      '提醒',
      `確認要刪除行程表 ${tripName} 嗎？`,
      'warning',
      '刪除',
      '取消'
    );
    if (!willDelete) return;
    deleteTrip(type, id);
    await deleteTargetData('schedulesIDs', id);
  };

  const showScheduleDetails = async () => {
    const info = await getScheduleInfo(id);
    const details = await getScheduleDetails(id);
    setScheduleState('scheduleInfo', info);
    setScheduleState('scheduleDetails', details);
    navigate(`/profile/schedule-details/${id}`);
  };

  return (
    <Tooltip
      title={tripName}
      size="small"
      position="top-end"
      arrow
      theme="transparent"
      style={{ width: '90%' }}
    >
      <TripWrapper onClick={showScheduleDetails}>
        {type === 'futureSchedules' ? (
          <CheckBox data-is-checked={isChecked}></CheckBox>
        ) : (
          <PastTripPrefix>readOnly</PastTripPrefix>
        )}
        <Content>{content}</Content>
        {id === activeScheduleId && <Badge>留守</Badge>}
        <IconButton onClick={(e) => handleDeleteTrip(e, type, id)}>
          <FontAwesomeIcon icon={faTrash} size="sm" />
        </IconButton>
      </TripWrapper>
    </Tooltip>
  );
};

export default MinifyTrip;
