import styled from 'styled-components';
import color, { screen } from '@/theme';

import gpxParser from 'gpxparser';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect, useCallback } from 'react';
//utils
import useFirestoreSchedules from '@/hooks/useFirestoreSchedules';
import { useScheduleArrangement } from '@/zustand';
import useNewItineraryListener from '@/hooks/useNewItineraryListener';
import { showErrorToast } from '@/utils/sweetAlert';
import getDocById from '@/firestore/getDocById';
import getFirestoreDocs from '@/firestore/getFirestoreDocs';
import addFirestoreDoc from '@/firestore/addFirestoreDoc';
//components
import CalendarDate from './CalendarDate';
import Location from './SingleLocation';
import SaveScheduleBtn from './SaveScheduleBtn';
import UploadGPX from './UploadGPX';
//#region
const ScheduleWrapper = styled.div`
  ${screen.md} {
    padding: 1rem 2rem;
  }
`;

const PlanningText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TripName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${screen.md} {
    display: none;
  }
`;

const TripNameInput = styled.input`
  width: 220px;
  padding: 5px 10px;
  border: 1px solid ${color.borderColor};
  border-radius: 5px;
  background-color: ${color.lightBackgroundColor};
`;
const DaySplit = styled.span`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
  align-items: center;
  margin: 6px 0 4px;
`;

const NoteSplit = styled(DaySplit)`
  grid-template-columns: 1fr 2fr 1fr;
`;

const SplitLine = styled.hr`
  border: none;
  background-color: ${color.primary};
  height: 1px;
`;

const Note = styled.h6`
  letter-spacing: 2px;
  font-size: 0.75rem;
`;

const ScheduleBlock = styled.div`
  min-height: ${({ $isBaseBlock }) => ($isBaseBlock ? `200px` : '80px')};
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
  margin-top: 1rem;
  ${screen.md} {
    display: none;
  }
`;

//#endregion

const PlanningSchedule = ({ isSaved, setSave }) => {
  const { userId } = useAuth();
  const {
    setScheduleArrangement,
    temporaryScheduleId,
    newItinerary,
    tripName,
    locationNumber,
    gpxUrl,
    scheduleBlocks,
  } = useScheduleArrangement();
  const { getTemporaryScheduleId } = useFirestoreSchedules();
  const [selectedDates, setSelectedDates] = useState([]);
  const [baseBlock, setBaseBlock] = useState([]);

  const getTemporaryLocations = useCallback(async () => {
    try {
      const locations = await getFirestoreDocs(
        `schedules/${temporaryScheduleId}/itineraries`
      );
      if (!locations) {
        setScheduleArrangement('mapMarkers', []);
      } else {
        //for right section(schedules) render
        const items = locations.map((location, index) => ({
          id: location.itineraryId,
          name: location.location,
          number: index + 1,
          timeDiff: 0,
          timeStr: '00:00',
        }));
        setBaseBlock(items);
        //for left section(OSM) render
        const mapMarkers = locations.map((location, index) => {
          return {
            lat: location.geopoint._lat,
            lng: location.geopoint._long,
            id: location.itineraryId,
            name: location.location,
            number: index + 1,
          };
        });
        setScheduleArrangement('mapMarkers', mapMarkers);
        setScheduleArrangement('locationNumber', locations.length);
        return items;
      }
    } catch (error) {
      await showErrorToast('發生錯誤', error.message);
    }
  }, [temporaryScheduleId]);

  useNewItineraryListener(temporaryScheduleId);

  useEffect(() => {
    (async () => {
      const id = await getTemporaryScheduleId();
      if (!id) {
        const firestoreNewItem = {
          isTemporary: true,
          isFinished: false,
          userId,
        };
        try {
          const newDocId = await addFirestoreDoc(
            'schedules',
            firestoreNewItem,
            'scheduleId'
          );
          setScheduleArrangement('temporaryScheduleId', newDocId);
        } catch (error) {
          await showErrorToast('創建行程表發生錯誤', error.message);
        }
      } else {
        setScheduleArrangement('temporaryScheduleId', id);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!temporaryScheduleId || Object.keys(scheduleBlocks).length > 1) return;
    const fetchScheduleData = async () => {
      await getTemporaryLocations();
      try {
        const data = await getDocById('schedules', temporaryScheduleId);
        setScheduleArrangement('gpxFileName', data?.gpxFileName || '');
        setScheduleArrangement('gpxUrl', data?.gpxUrl);
      } catch (error) {
        await showErrorToast('發生錯誤', error.message);
      }
    };
    fetchScheduleData();
  }, [temporaryScheduleId]);

  //setScheduleBlocks when base block change(add new location / get data from db)
  useEffect(() => {
    if (baseBlock.length === 0) return;
    if (Object.keys(scheduleBlocks).length === 1) {
      setScheduleArrangement('scheduleBlocks', {
        notArrangedBlock: { items: baseBlock },
      });
    } else {
      const updateScheduleBlocks = {
        ...scheduleBlocks,
        notArrangedBlock: {
          items: baseBlock,
        },
      };
      setScheduleArrangement('scheduleBlocks', updateScheduleBlocks);
    }
  }, [baseBlock]);

  //generate blocks according to the dates selection
  useEffect(() => {
    if (selectedDates.length === 0) return;
    const generateDateBlocks = async () => {
      const generatedBlocks = selectedDates.reduce((acc, cur) => {
        acc[cur] = { items: [] };
        return acc;
      }, {});
      await getTemporaryLocations();
      setScheduleArrangement('scheduleBlocks', {
        ...generatedBlocks,
        notArrangedBlock: { items: baseBlock },
      });
    };
    generateDateBlocks();
  }, [selectedDates]);

  //set the new location on time
  useEffect(() => {
    if (!newItinerary) return;

    const newItem = {
      id: newItinerary.itineraryId,
      name: newItinerary.location,
      number: locationNumber + 1,
      timeStr: '00:00',
      timeDiff: 0,
    };
    const originalBaseBlock = scheduleBlocks.notArrangedBlock.items;
    const updateNewBaseBlock = [...originalBaseBlock, newItem];
    if (!isSaved) {
      setBaseBlock(updateNewBaseBlock);
      setScheduleArrangement('newItinerary', null);
    }
  }, [newItinerary]);

  //display gpxPoints ob the map
  useEffect(() => {
    if (!gpxUrl) return;
    const parseGPX = async (url) => {
      const response = await fetch(url);
      const data = await response.text();
      const gpx = new gpxParser();
      gpx.parse(data);
      const gpxPoints = gpx.tracks[0].points.map((point) => [
        point.lat,
        point.lon,
      ]);
      setScheduleArrangement('gpxPoints', gpxPoints);
    };
    parseGPX(gpxUrl);
  }, [gpxUrl]);

  const onDragEnd = (event) => {
    const { source, destination } = event;
    if (!destination) return;

    const newBlocks = { ...scheduleBlocks };
    // splice(start, deleteCount, item )
    // get the dragged item, cut and past to destination
    const [remove] = newBlocks[source.droppableId].items.splice(
      source.index,
      1
    );
    newBlocks[destination.droppableId].items.splice(
      destination.index,
      0,
      remove
    );

    setScheduleArrangement('scheduleBlocks', newBlocks);
  };

  return (
    <>
      <ScheduleWrapper>
        <PlanningText>
          <TripName>
            <label htmlFor="tripName">路線名稱</label>
            <TripNameInput
              id="tripName"
              type="text"
              placeholder="未命名的路線名稱"
              value={tripName}
              onChange={(e) =>
                setScheduleArrangement('tripName', e.target.value)
              }
              maxLength={10}
            />
          </TripName>
          <CalendarDate selectDates={setSelectedDates} />
        </PlanningText>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(scheduleBlocks).map(([date, items], index) => (
            <div key={date}>
              {index < Object.entries(scheduleBlocks).length - 1 ? (
                <DaySplit>
                  <SplitLine />
                  <Note>{`第${index + 1}天`}</Note>
                  <SplitLine />
                </DaySplit>
              ) : (
                scheduleBlocks?.notArrangedBlock.items.length > 0 && (
                  <NoteSplit>
                    <SplitLine />
                    <Note>往上拖曳、選取時間</Note>
                    <SplitLine />
                  </NoteSplit>
                )
              )}
              <Droppable droppableId={date}>
                {(provided) => (
                  <ScheduleBlock
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    $isBaseBlock={date === 'notArrangedBlock'}
                  >
                    {items.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <Location
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            name={item.name}
                            id={item.id}
                            number={item.number}
                            timeStr={item.timeStr}
                          ></Location>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ScheduleBlock>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </ScheduleWrapper>
      <ButtonsContainer>
        <SaveScheduleBtn isSaved={isSaved} setSave={setSave} />
        <UploadGPX />
      </ButtonsContainer>
    </>
  );
};

export default PlanningSchedule;
