import styled from 'styled-components';
import CalendarDate from './CalendarDate';
import color from '@theme';
import { useState, useEffect, useCallback } from 'react';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUploadFile from '@utils/hooks/useUploadFile';
import Location from './SingleLocation';
import SaveScheduleBtn from './SaveScheduleBtn';
import { useScheduleArrangement } from '@utils/zustand';
import gpxParser from 'gpxparser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tippy';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//#region
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
  min-height: 80px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
  margin-top: 1rem;
`;

const UploadGpxButton = styled.div`
  .gpxUpload {
    font-size: 2rem;
    color: #6e6e6e;
    &:hover {
      color: #0161bb;
      cursor: pointer;
    }
  }
`;

const GPXfileWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: baseline;
`;

const GPXfileName = styled.span`
  font-size: 0.875rem;
  background-color: #fff0c9;
  padding: 2px 6px;
  border-radius: 4px;
  font-style: italic;
`;

//#endregion

const PlanningSchedule = () => {
  const {
    setScheduleArrangement,
    temporaryScheduleId,
    newItinerary,
    tripName,
    gpxFileName,
    locationNumber,
    gpxUrl,
    scheduleBlocks,
  } = useScheduleArrangement();
  const {
    getTemporaryScheduleId,
    createNewSchedule,
    updateScheduleContents,
    getScheduleInfo,
    getScheduleDetails,
    useNewItineraryListener,
  } = useSchedulesDB();
  const { getUploadFileUrl } = useUploadFile();
  const [selectedDates, setSelectedDates] = useState([]);
  //to maintain the datetime when add new location
  const [baseBlock, setBaseBlock] = useState([]);

  const [isSaved, setIsSaved] = useState(false);

  const getTemporaryLocations = useCallback(async () => {
    const locations = await getScheduleDetails(temporaryScheduleId);
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
    }
  }, [temporaryScheduleId]);

  useNewItineraryListener(temporaryScheduleId);

  useEffect(() => {
    const initializeSchedule = async () => {
      const id = await getTemporaryScheduleId();
      if (!id) {
        const newDocId = await createNewSchedule();
        await updateScheduleContents(newDocId, 'scheduleId', newDocId);
        setScheduleArrangement('temporaryScheduleId', newDocId);
      } else {
        setScheduleArrangement('temporaryScheduleId', id);
      }
    };
    initializeSchedule();
  }, []);

  useEffect(() => {
    if (!temporaryScheduleId) return;
    const fetchScheduleData = async () => {
      await getTemporaryLocations();
      const data = await getScheduleInfo(temporaryScheduleId);
      setScheduleArrangement('gpxFileName', data?.gpxFileName || '');
      setScheduleArrangement('gpxUrl', data?.gpxUrl);
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

  const handleUploadGPX = async (e) => {
    const file = e.target.files[0];
    setScheduleArrangement('gpxFileName', file.name); //global state
    await updateScheduleContents(temporaryScheduleId, 'gpxFileName', file.name); //DB
    const url = await getUploadFileUrl('gpx_file', file, temporaryScheduleId); //storage
    await updateScheduleContents(temporaryScheduleId, 'gpxUrl', url); //DB
    setScheduleArrangement('gpxUrl', url);
  };
  return (
    <>
      <div>
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
      </div>
      <ButtonsContainer>
        <SaveScheduleBtn isSaved={isSaved} setSave={setIsSaved} />
        <input
          type="file"
          accept=".gpx"
          onChange={handleUploadGPX}
          id="gpxUpload"
          style={{ display: 'none' }}
        />
        <GPXfileWrapper>
          {gpxFileName && <GPXfileName>{gpxFileName}</GPXfileName>}
          <UploadGpxButton as="label" htmlFor="gpxUpload">
            <Tooltip
              title="上傳 GPX"
              arrow={true}
              position="right"
              size="small"
              theme="light"
            >
              <FontAwesomeIcon icon={faFileArrowUp} className="gpxUpload" />
            </Tooltip>
          </UploadGpxButton>
        </GPXfileWrapper>
      </ButtonsContainer>
    </>
  );
};

export default PlanningSchedule;
