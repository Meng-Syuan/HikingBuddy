import styled from 'styled-components';
import color from '@utils/theme.js';
import Flatpickr from 'react-flatpickr';
import { useState, useEffect } from 'react';
import { useScheduleArrangement } from '@utils/zustand';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';

const ContentWrapper = styled.div`
  min-height: 25px;
  border: 1px solid ${color.borderColor};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 6px;
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

const SingleLocation = ({ name, id, number, deletionId, setDeletion }) => {
  const {
    temporaryScheduleId,
    setScheduleArrangement,
    itineraries_dates,
    itineraries_datetime,
    mapMarkers,
  } = useScheduleArrangement();
  const { deleteItinerary } = useSchedulesDB();
  const [timeDiff, setTimeDiff] = useState('');

  useEffect(() => {
    //initialization
    if (itineraries_datetime.length === 0) {
      const initialDatetimes = itineraries_dates.map((itinerary) => ({
        itineraryId: itinerary.itineraryId,
        date: itinerary.date,
        datetime: itinerary.date,
      }));
      setScheduleArrangement('itineraries_datetime', initialDatetimes);
    } else {
      //update according to new location or new date / deletion
      if (!deletionId) {
        const newItinerary = itineraries_dates.find((itinerary) => {
          return !itineraries_datetime.some(
            (object) => object.itineraryId === itinerary.itineraryId
          );
        });
        if (newItinerary) {
          const newItineraries_datetime = itineraries_datetime.map(
            (itinerary) => ({
              itineraryId: itinerary.itineraryId,
              date: itinerary.date,
              datetime: itinerary.datetime,
            })
          );
          newItineraries_datetime.push(newItinerary);
          setScheduleArrangement(
            'itineraries_datetime',
            newItineraries_datetime
          );
        } else {
          const newItineraries_datetime = itineraries_datetime.map(
            (itinerary) => {
              const matchingItem = itineraries_dates.find(
                (item) => item.itineraryId === itinerary.itineraryId
              );
              return {
                ...itinerary,
                date: matchingItem.date,
                //use new datetime; cause matchingItem is founded by itineraries_datetime, which doesn't have datetime property
                datetime: itinerary.datetime,
              };
            }
          );
          setScheduleArrangement(
            'itineraries_datetime',
            newItineraries_datetime
          );
        }
      } else {
        const newItineraries_datetime = itineraries_datetime.filter(
          (itinerary) => itinerary.itineraryId !== deletionId
        );
        setScheduleArrangement('itineraries_datetime', newItineraries_datetime);
        setDeletion(null);
      }
    }
  }, [itineraries_dates]);

  useEffect(() => {
    if (!timeDiff) return;
    const updatedItineraries = itineraries_datetime.map((itinerary) => {
      if (id === itinerary.itineraryId) {
        return {
          ...itinerary,
          datetime: itinerary.date + timeDiff,
        };
      } else {
        return itinerary;
      }
    });
    setScheduleArrangement('itineraries_datetime', updatedItineraries);
  }, [timeDiff]);

  const handleTimeChange = (selectedDateTime) => {
    const todayMidnight_timestamp = new Date().setHours(0, 0, 0, 0);
    const diffTimestamp =
      selectedDateTime[0].getTime() - todayMidnight_timestamp;
    setTimeDiff(diffTimestamp);
  };

  const handleDeleteItinerary = (id) => {
    setDeletion(id);
    deleteItinerary(temporaryScheduleId, id);
    const remainingMarkers = mapMarkers.filter((marker) => marker.id !== id);
    setScheduleArrangement('mapMarkers', remainingMarkers);
  };
  const timePickerOptions = {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    wrap: true,
    onChange: (e) => handleTimeChange(e),
  };

  return (
    <ContentWrapper>
      <Flatpickr options={timePickerOptions}>
        <input type="text" data-input readOnly />
      </Flatpickr>
      <Number>{number}</Number>
      <Location_Name>{name}</Location_Name>
      <IconButton onClick={() => handleDeleteItinerary(id)}>
        <FontAwesomeIcon icon={faTrash} size="xs" />
      </IconButton>
    </ContentWrapper>
  );
};

export default SingleLocation;
