import styled from 'styled-components';
import color, { textBorder, fieldWrapper, styledListTitle } from '@/theme';
import { lightFormat, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useScheduleState } from '@/zustand';

//#region
const InfoContainer = styled.section`
  background-color: ${color.lightBackgroundColor};
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  height: calc(100% - 64px);
`;
const TripInfoWrapper = styled.section`
  ${fieldWrapper};
  width: 100%;
`;

const ListTitle = styled.h3`
  ${styledListTitle};
  padding: 0;
`;
const DateContainer = styled.div``;

const DateSplit = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 1.8rem 0;
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
  gap: 1.5rem;
  margin-bottom: 4px;
  align-items: baseline;
`;

const ItemWrapper = styled.div`
  display: flex;
  max-width: 45%;
  gap: 8px;
`;

const Time = styled.span`
  ${textBorder};
  font-size: 0.875rem;
  background-color: ${color.lightBackgroundColor};
`;
const LocationName = styled.span`
  ${textBorder};
  text-align: center;
  min-width: 200px;
  min-height: 28px;
  background-color: ${color.lightBackgroundColor};
`;
const Note = styled.span`
  font-size: 0.875rem;
`;

const ChecklistsWrapper = styled.div`
  ${fieldWrapper};
  width: 100%;
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 2rem;
  gap: 10px 20px;
`;

const ListItemWrapper = styled.div`
  ${textBorder};
  display: inline-block;
  background-color: ${color.lightBackgroundColor};
  text-align: center;
  min-width: 100px;
`;

//#endregion
const ScheduleInfo = () => {
  const {
    scheduleInfo,
    scheduleDetails,
    locationNotes,
    gearChecklist,
    otherItemChecklist,
  } = useScheduleState();
  const [sortedDates, setSortedDates] = useState(null);
  const [groupItineraries, setGroupItineraries] = useState(null);
  const [checkedListItem, setCheckedListItem] = useState([]);

  useEffect(() => {
    if (!scheduleDetails) return;
    const dates = scheduleDetails.map((itinerary) => itinerary.date);
    const datesSet = [...new Set(dates)];
    datesSet.sort();
    setSortedDates(datesSet);
  }, [scheduleDetails]);

  useEffect(() => {
    if (!sortedDates || !scheduleDetails) return;
    const groupItineraries = sortedDates.reduce((acc, date) => {
      scheduleDetails.sort((a, b) => a.datetime - b.datetime);
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
          })),
        });
      }
      return acc;
    }, []);
    setGroupItineraries(groupItineraries);
    console.log(groupItineraries);
  }, [sortedDates]);

  useEffect(() => {
    if (!scheduleInfo) return;
    const checkedGears = gearChecklist.filter((item) => item.isChecked);
    const checkedOthers = otherItemChecklist.filter((item) => item.isChecked);
    const checkedListItem = [...checkedGears, ...checkedOthers];
    setCheckedListItem(checkedListItem);
  }, [scheduleInfo]);
  return (
    <InfoContainer>
      <TripInfoWrapper>
        <ListTitle>行程表</ListTitle>
        {groupItineraries &&
          groupItineraries.map((date) => {
            return (
              <DateContainer key={date.date}>
                <DateSplit>
                  <SplitLine />
                  <SplitContentText>{date.date}</SplitContentText>
                </DateSplit>
                <LocationsContainer>
                  {date.itineraries.map((itinerary) => {
                    return (
                      <LocationWrapper key={`listItem${itinerary.id}`}>
                        <ItemWrapper>
                          <Time>{itinerary.datetime}</Time>
                          <LocationName>{itinerary.location}</LocationName>
                        </ItemWrapper>
                        {locationNotes && locationNotes[itinerary.id] && (
                          <Note key={`note${itinerary.id}`} id={itinerary.id}>
                            {`備註：${locationNotes[itinerary.id]}`}
                          </Note>
                        )}
                      </LocationWrapper>
                    );
                  })}
                </LocationsContainer>
              </DateContainer>
            );
          })}
      </TripInfoWrapper>
      <ChecklistsWrapper>
        <ListTitle>裝備</ListTitle>
        <ItemsContainer>
          {checkedListItem.length > 0 &&
            checkedListItem.map((item) => (
              <ListItemWrapper key={item.id}>{item.id}</ListItemWrapper>
            ))}
        </ItemsContainer>
      </ChecklistsWrapper>
    </InfoContainer>
  );
};

export default ScheduleInfo;
