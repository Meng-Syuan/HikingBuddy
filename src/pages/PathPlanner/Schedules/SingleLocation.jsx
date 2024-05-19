import styled from 'styled-components';
import color from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';

import Flatpickr from 'react-flatpickr';

import { useState, useEffect, forwardRef } from 'react';
//utils
import { useScheduleArrangement } from '@/zustand';
import deleteFirestoreDoc from '@/firestore/deleteFirestoreDoc';
import { showErrorToast } from '@/utils/sweetAlert';

const ContentWrapper = styled.div`
  min-height: 25px;
  border: 1px solid ${color.borderColor};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 6px;
  margin-bottom: 2px;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
  .flatpickr-input {
    font-size: 0.75rem;
    text-align: center;
    width: 40px;
    padding: 2px;
    border: 1px solid ${color.borderColor};
    border-radius: 8px;
    outline: none;
    background-color: ${color.secondary};
    color: #fff;
  }
`;

const Number = styled.div`
  font-size: 0.75rem;
  margin: 0 5px;
`;
const Location_Name = styled.h5`
  width: 180px;
  line-height: 1rem;
  font-size: 0.875rem;
`;

const SingleLocation = forwardRef(
  ({ name, id, number, timeStr, ...props }, ref) => {
    const {
      scheduleBlocks,
      temporaryScheduleId,
      setScheduleArrangement,
      mapMarkers,
    } = useScheduleArrangement();
    const [timeDiff, setTimeDiff] = useState('');

    useEffect(() => {
      if (!timeDiff) return;

      const updatedScheduleBlocks = {};
      for (let key in scheduleBlocks) {
        updatedScheduleBlocks[key] = {
          items: scheduleBlocks[key].items.map((item) => {
            if (timeDiff.id === item.id) {
              return {
                ...item,
                timeDiff: timeDiff.diffTimestamp,
                timeStr: timeDiff.str,
              };
            } else {
              return item;
            }
          }),
        };
      }
      setScheduleArrangement('scheduleBlocks', updatedScheduleBlocks);
    }, [timeDiff]);

    const handleTimeChange = (datetime, str) => {
      const todayMidnight_timestamp = new Date().setHours(0, 0, 0, 0);
      const diffTimestamp = datetime[0].getTime() - todayMidnight_timestamp;
      setTimeDiff({ id, diffTimestamp, str });
    };
    const timePickerOptions = {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
      time_24hr: true,
      wrap: true,
      onChange: (datetime, str) => handleTimeChange(datetime, str),
    };

    const handleDeleteItinerary = async (id) => {
      try {
        await deleteFirestoreDoc(
          `schedules/${temporaryScheduleId}/itineraries`,
          id
        );
        const remainingMarkers = mapMarkers.filter(
          (marker) => marker.id !== id
        );
        setScheduleArrangement('mapMarkers', remainingMarkers);
        const updatedScheduleBlocks = {};
        for (let key in scheduleBlocks) {
          updatedScheduleBlocks[key] = {
            items: scheduleBlocks[key].items.filter((item) => item.id !== id),
          };
        }
        setScheduleArrangement('scheduleBlocks', updatedScheduleBlocks);
      } catch (error) {
        await showErrorToast('發生錯誤', error.message);
      }
    };

    return (
      // make every location can be draggable
      <ContentWrapper ref={ref} {...props}>
        <Flatpickr options={timePickerOptions}>
          <input type="text" data-input readOnly value={timeStr} />
        </Flatpickr>
        <Number>{number}</Number>
        <Location_Name>{name}</Location_Name>
        <IconButton onClick={() => handleDeleteItinerary(id)}>
          <FontAwesomeIcon icon={faTrash} size="xs" />
        </IconButton>
      </ContentWrapper>
    );
  }
);

export default SingleLocation;
SingleLocation.displayName = 'SingleLocation'; //for ESLint
