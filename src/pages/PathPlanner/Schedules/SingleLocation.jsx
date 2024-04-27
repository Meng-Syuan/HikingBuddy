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
  const { setScheduleArrangement, itineraries_dates, itineraries_datetime } =
    useScheduleArrangement();
  const [timeDiff, setTimeDiff] = useState('');

  useEffect(() => {
    //initialization
    if (itineraries_datetime.length === 0) {
      const initialDatetimes = itineraries_dates.map((itinerary) => ({
        itineraryId: itinerary.itineraryId,
        date: itinerary.date,
        datetime: itinerary.date,
      }));
      console.log('set itineraries_datetime=======================');
      setScheduleArrangement('itineraries_datetime', initialDatetimes);
    } else {
      //update according to new location or new date
      // console.log('itineraries_dates');
      // console.log(itineraries_dates);
      // console.log('itineraries_datetime');
      // console.log(itineraries_datetime);
      const newItinerary = itineraries_dates.find((itinerary) => {
        return !itineraries_datetime.some(
          (object) => object.itineraryId === itinerary.itineraryId
        );
      });
      // console.log('newItinerary');
      // console.log(newItinerary);
      if (newItinerary) {
        let newItineraries_datetime = itineraries_datetime.map((itinerary) => ({
          itineraryId: itinerary.itineraryId,
          date: itinerary.date,
          datetime: itinerary.datetime,
        }));
        newItineraries_datetime.push(newItinerary);
        // console.log('newItineraries_datetime...加一個新的');
        // console.log(newItineraries_datetime);
        setScheduleArrangement('itineraries_datetime', newItineraries_datetime);
      } else {
        const newItineraries_datetime = itineraries_datetime.map(
          (itinerary) => {
            const matchingItem = itineraries_dates.find(
              (item) => item.itineraryId === itinerary.itineraryId
            );
            console.log('matchingItem 存在');
            return {
              ...itinerary,
              date: matchingItem.date,
              //use new datetime; cause matchingItem is founded by itineraries_datetime, which doesn't have datetime property
              datetime: itinerary.datetime,
            };
          }
        );
        setScheduleArrangement('itineraries_datetime', newItineraries_datetime);

        // console.log(
        //   'newItineraries_datetime重整，看 dates 怎麼更新，以下是新的 datetime 狀態'
        // );
        // console.log(newItineraries_datetime);
      }
    }
    //更新itineraries_datetime，依據itineraries_dates 調整 date 與 datetime，找 match 的。
    //如果有新的 itinerary，舊的不動，增加newItinerary進去！
  }, [itineraries_dates]);

  useEffect(() => {
    if (!timeDiff) return;
    console.log('timeDiff改變' + timeDiff);
    const updatedItineraries = itineraries_datetime.map((itinerary) => {
      if (id === itinerary.itineraryId) {
        return {
          ...itinerary,
          datetime: itinerary.date + timeDiff,
        };
      } else {
        console.log('這邊都是跟之前一樣的');
        return itinerary;
      }
    });

    console.log('updatedItineraries.......with timedate.................');
    console.log(updatedItineraries);
    setScheduleArrangement('itineraries_datetime', updatedItineraries);
  }, [timeDiff]);
  ////////////////////////////////
  ///////////////////////////////
  ////////////////////////////////
  // useEffect(() => {
  //   if (itineraries_datetime.length === 0) return;
  //   console.log('itineraries_datetime......');
  //   console.log(itineraries_datetime);
  // }, [itineraries_datetime]);

  const handleTimeChange = (selectedDateTime) => {
    const todayMidnight_timestamp = new Date().setHours(0, 0, 0, 0);
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
    onChange: (e) => handleTimeChange(e),
  };

  return (
    <ContentWrapper>
      <Flatpickr options={timePickerOptions}>
        <input type="text" data-input readOnly />
      </Flatpickr>
      <Location_Name>{name}</Location_Name>
      <DeleteButton>刪除</DeleteButton>
    </ContentWrapper>
  );
};

export default SingleLocation;
