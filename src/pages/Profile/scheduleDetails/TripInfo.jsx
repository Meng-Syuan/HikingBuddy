import styled from 'styled-components';
import { lightFormat, format } from 'date-fns';
import color, { textBorder } from '@utils/theme';
import { useScheduleData } from '@utils/zustand';
import { useEffect, useState } from 'react';
import { SharedListTitle } from './index';

export const TripInfoWrapper = styled.div`
  width: 90%;
  position: relative;
  margin-bottom: 1rem;
`;

const DateSplit = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
`;
const SplitContentText = styled.span`
  font-size: 0.875rem;
  letter-spacing: 1px;
  line-height: 1.25rem;
  color: ${color.primary};
  padding: 0 10px;
  text-align: center;
  position: absolute;
  background-color: ${color.lightBackgroundColor};
  left: 60px;
`;
const SplitLine = styled.hr`
  height: 1px;
  border: none;
  background-color: ${color.primary};
  width: 100%;
`;

const LocationsContainer = styled.div``;

const LocationWrapper = styled.div`
  display: flex;
  gap: 8px;
`;
const Time = styled.span`
  ${textBorder};
  font-size: 0.875rem;
`;
const LocationName = styled.span`
  ${textBorder};
  width: 30%;
  text-align: center;
`;
const NoteInput = styled.input`
  ${textBorder}
  flex: 1;
  border-radius: 5px;
  outline: ${(props) => (props.readOnly ? 'none' : '')};
  background-color: ${(props) =>
    props.readOnly ? `${color.lightBackgroundColor}` : ''};
`;

const TripInfo = ({ isEditable }) => {
  const { scheduleInfo, scheduleDetails, locationNotes, setLocationNote } =
    useScheduleData();
  const [sortedDates, setSortedDates] = useState(null);
  const [groupItineraries, setGroupItineraries] = useState(null);

  useEffect(() => {
    if (!scheduleDetails) return;
    // console.log('scheduleDetails');
    // console.log(scheduleDetails);
    // console.log('scheduleInfo');
    // console.log(scheduleInfo);
    const dates = scheduleDetails.map((itinerary) => itinerary.date);
    dates.sort();
    setSortedDates(dates);
  }, [scheduleDetails]);

  useEffect(() => {
    if (!sortedDates || !scheduleDetails) return;
    const groupItineraries = sortedDates.reduce((acc, date) => {
      const itineraries = scheduleDetails.filter(
        (itinerary) => itinerary.date === date
      );
      if (itineraries.length > 0) {
        acc.push({
          date: format(date, 'yyyy-MM-dd　E'),
          itineraries: itineraries.map((itinerary) => ({
            id: itinerary.itineraryId,
            location: itinerary.location,
            datetime: lightFormat(itinerary.datetime, 'HH:mm'),
            note: '',
          })),
        });
      }
      return acc;
    }, []);
    // console.log('groupItineraries........');
    // console.log(groupItineraries);
    setGroupItineraries(groupItineraries);
  }, [sortedDates]);

  useEffect(() => {
    console.log('locationNotes');
    console.log(locationNotes);
  }, [locationNotes]);
  return (
    <TripInfoWrapper>
      <SharedListTitle>{scheduleInfo?.tripName}</SharedListTitle>
      {groupItineraries &&
        groupItineraries.map((date) => {
          return (
            <>
              <DateSplit key={date.date}>
                <SplitLine />
                <SplitContentText>{date.date}</SplitContentText>
              </DateSplit>
              <LocationsContainer>
                {date.itineraries.map((itinerary) => {
                  return (
                    <LocationWrapper key={itinerary.id}>
                      <Time>{itinerary.datetime}</Time>
                      <LocationName>{itinerary.location}</LocationName>
                      {isEditable || locationNotes[itinerary.id] ? (
                        <NoteInput
                          id={itinerary.id}
                          onChange={(e) =>
                            setLocationNote(itinerary.id, e.target.value)
                          }
                          value={locationNotes[itinerary.id] || ''}
                          readOnly={!isEditable}
                        />
                      ) : null}
                    </LocationWrapper>
                  );
                })}
              </LocationsContainer>
            </>
          );
        })}
    </TripInfoWrapper>
  );
};

export default TripInfo;
