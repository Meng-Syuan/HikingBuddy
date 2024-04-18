import styled from 'styled-components';
import color from '@utils/theme.js';
import Flatpickr from 'react-flatpickr';
import { useState, useEffect } from 'react';
import { useScheduleArrangement } from '@utils/zustand';

const ContentWrapper = styled.div`
  min-height: 30px;
  border: 1px solid ${color.borderColor};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
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
const Location_Name = styled.h5`
  width: 200px;
  line-height: 1.2rem;
  font-size: 0.875rem;
`;

const DeleteButton = styled.button`
  border: none;
`;

const SingleLocation = ({ name, id }) => {
  const { itineraries, setItineraries } = useScheduleArrangement();
  const [timeStr, setTimeStr] = useState('');
  const [timeDiff, setTimeDiff] = useState('');

  useEffect(() => {
    if (!timeDiff) return;
    const updateItineraries = itineraries.map((itinerary) => {
      if (id === itinerary.itineraryId) {
        if (isNaN(itinerary.date)) {
          console.log('timeDiff change');
          return {
            ...itinerary,
            datetime: timeDiff,
          };
        } else {
          return {
            ...itinerary,
            datetime: itinerary.date + timeDiff,
          };
        }
      }
      console.log('no change');
      return itinerary;
    });
    setItineraries(updateItineraries);
    console.log('setItineraries with time diff');
  }, [timeDiff]);

  const handleTimeChange = (selectedDateTime, timeStr) => {
    setTimeStr(timeStr);
    const todayMidnight_timestamp = new Date().setHours(0, 0, 0);
    const diffTimestamp =
      selectedDateTime[0].getTime() - todayMidnight_timestamp;
    setTimeDiff(diffTimestamp);
  };
  const timePickerOptions = {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    wrap: true,
    onChange: handleTimeChange,
  };

  return (
    <ContentWrapper>
      <Flatpickr options={timePickerOptions}>
        <input type="text" value={timeStr} data-input readOnly />
      </Flatpickr>
      <Location_Name>{name}</Location_Name>
      <DeleteButton>刪除</DeleteButton>
    </ContentWrapper>
  );
};

export default SingleLocation;
