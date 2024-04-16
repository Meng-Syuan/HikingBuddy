import styled from 'styled-components';
import CalendarDate from './CalendarDate';
import color from '@utils/theme';
import { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { schedulesDB } from '@utils/firestore';
import { useAuth } from '@clerk/clerk-react';
import Location from './SingleLocation';

import Test from '../SortablePoc';

const TripName = styled.div``;

const Day = styled.span`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
  align-items: center;
  hr {
    border: none;
    background-color: ${color.primary};
    height: 1px;
  }
  h6 {
    letter-spacing: 2px;
    font-size: 0.875rem;
  }
`;
const Content = styled.div`
  min-height: 50px;
  background-color: orange;
`;
const LocationsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Schedules = () => {
  const { userId } = useAuth();
  const [tripDays, setTripDays] = useState(0);
  const [locations, setLocations] = useState(null);
  useEffect(() => {
    const getTemporaryLocations = async (userId) => {
      const temporaryLocations = await schedulesDB.getLocations(userId);
      setLocations(temporaryLocations);
    };
    getTemporaryLocations(userId);
  }, []);

  useEffect(() => {
    console.log(locations);
  }, [locations]);

  return (
    <>
      <TripName>
        <label htmlFor="tripName">路線名稱</label>
        <input id="tripName" type="text" />
      </TripName>
      <CalendarDate setTripDays={setTripDays} />

      {[...Array(tripDays)].map((_, index) => {
        return <ScheduleBlock day={index + 1} key={index}></ScheduleBlock>;
      })}
      {/* <Location></Location> */}
      {/* {[...Array(tripDays)].map((_, index) => {
        return <Location day={index + 1} key={index}></Location>;
      })} */}
      <LocationsWrapper>
        {locations &&
          locations.map((location) => (
            <Location location={location.location} />
          ))}
      </LocationsWrapper>
      {/* <Test></Test> */}
    </>
  );
};

export default Schedules;

const ScheduleBlock = ({ day }) => {
  return (
    <div>
      <Day>
        <hr />
        <h6>{`第${day}天`}</h6>
        <hr />
      </Day>
      <Content />
    </div>
  );
};
