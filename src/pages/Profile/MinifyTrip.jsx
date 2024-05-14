import styled from 'styled-components';
import { lightFormat } from 'date-fns';
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
  height: 45px;
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

const Content = styled.div`
  letter-spacing: 1px;
  margin-right: 1rem;
  width: 115px;
  text-align: center;
`;

const BadgeWrapper = styled.div`
  display: flex;
  width: 70px;
  gap: 3px;
`;

const BadgeProtector = styled.div`
  height: 1rem;
  border-radius: 15px;
  background-color: #e78f1b66;
  padding: 1px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-weight: 450;
    font-size: 0.6rem;
    color: #754a11;
    letter-spacing: 2px;
    transform: translateX(1px);
  }
`;

const BadgeChecked = styled(BadgeProtector)`
  background-color: #93c5436f;
  p {
    color: #172e00;
  }
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
        <Content>{content}</Content>
        <BadgeWrapper>
          {isChecked && (
            <BadgeChecked>
              <p>裝備</p>
            </BadgeChecked>
          )}
          {id === activeScheduleId && (
            <BadgeProtector>
              <p>留守</p>
            </BadgeProtector>
          )}
        </BadgeWrapper>
        <IconButton onClick={(e) => handleDeleteTrip(e, type, id)}>
          <FontAwesomeIcon icon={faTrash} size="sm" />
        </IconButton>
      </TripWrapper>
    </Tooltip>
  );
};

export default MinifyTrip;
