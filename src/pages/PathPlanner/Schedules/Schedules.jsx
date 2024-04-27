import styled from 'styled-components';
import CalendarDate from './CalendarDate';
import color from '@theme';
import { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUploadFile from '@utils/hooks/useUploadFile';
import Location from './SingleLocation';
import SaveScheduleBtn from './SaveScheduleBtn';
import { useScheduleArrangement } from '@utils/zustand';
import gpxParser from 'gpxparser';

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
    font-size: 0.75rem;
  }
`;

const ScheduleBlock = styled.div`
  min-height: 80px;
  .sortable {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

const UploadGpxButton = styled.button`
  border: 2px solid #000;
`;

const GPXfileWrapper = styled.div``;

const GPXfileName = styled.span``;

const sortableOptions = {
  animation: 100,
  fallbackOnBody: true,
  swapThreshold: 0.1,
  ghostClass: 'ghost',
  group: 'shared',
  forceFallback: true,
};

const Schedules = () => {
  const {
    setScheduleArrangement,
    temporaryScheduleId,
    newItinerary,
    setNewItinerary,
    tripName,
    setTripName,
    itineraries_dates,
    itineraries_datetime,
    gpxFileName,
  } = useScheduleArrangement();
  const {
    getTemporaryScheduleId,
    createNewSchedule,
    updateScheduleContents,
    getScheduleDetails,
    addGPXtoDB,
  } = useSchedulesDB();
  const { getUploadFileUrl } = useUploadFile();
  const [selectedDates, setSelectedDates] = useState([]);
  const [baseBlock, setBaseBlock] = useState(null);
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [isSortEnd, setIsSortEnd] = useState(false);
  const [gpxContent, setGPXContent] = useState('');

  const getTemporaryLocations = useCallback(async () => {
    const locations = await getScheduleDetails(temporaryScheduleId);
    if (!locations) return;

    //for UI render
    const items = locations.map((location) => ({
      id: location.itineraryId,
      name: location.location,
    }));
    setBaseBlock([
      {
        id: 'base_block',
        items,
      },
    ]);
    //manage global state
    // setScheduleArrangement('itineraries_datetime', items);//??

    const geopoints = locations.map((location) => {
      return {
        lat: location.geopoint._lat,
        lng: location.geopoint._long,
        id: location.itineraryId,
        name: location.location,
      };
    });
    setScheduleArrangement('geopoints', geopoints);
  }, [temporaryScheduleId]);

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
    getTemporaryLocations();
  }, [temporaryScheduleId]);

  //setScheduleBlocks when base block change(add new location / get data from db)
  useEffect(() => {
    if (!baseBlock) return;
    if (scheduleBlocks.length <= 1) {
      setScheduleBlocks(baseBlock);
    }
    if (scheduleBlocks.length > 1) {
      const updateScheduleBlocks = scheduleBlocks.map((block) => {
        if (block.id === 'base_block') {
          return { id: 'base_block', items: [...baseBlock[0].items] };
        } else {
          return block;
        }
      });
      setScheduleBlocks(updateScheduleBlocks);
    }
  }, [baseBlock]);

  //generate blocks according to the dates selection
  useEffect(() => {
    if (selectedDates.length === 0) return;
    const generatedBlock = selectedDates.map((date) => {
      return {
        id: date,
        items: [],
      };
    });
    getTemporaryLocations();
    setScheduleBlocks([...generatedBlock, ...baseBlock]);
  }, [selectedDates]);

  //update scheduleBlocks after dragging
  useEffect(() => {
    if (isSortEnd) {
      const updateBlocks = scheduleBlocks.map((block) => {
        const updateItemsWithDate = block.items.map((item) => ({
          ...item,
          date: block.id,
        }));
        return { ...block, items: updateItemsWithDate }; //keep id, renew date property
      });

      setScheduleBlocks(updateBlocks);
      setIsSortEnd(false);
    }
  }, [isSortEnd]);

  //update date properties to itineraries_dates
  useEffect(() => {
    if (scheduleBlocks.length > 1) {
      const itineraries_dates = scheduleBlocks.reduce((acc, curr) => {
        curr.items.forEach((item) => {
          acc.push({
            itineraryId: item.id,
            date: item.date,
            // datetime: item.datetime,
            // location: item.name,
          });
        });
        return acc;
      }, []);
      setScheduleArrangement('itineraries_dates', itineraries_dates);
    }
  }, [scheduleBlocks]);

  //set the new location on time
  useEffect(() => {
    if (!newItinerary) return;

    if (scheduleBlocks.length === 0) {
      setBaseBlock([
        {
          id: 'base_block',
          items: [
            {
              id: newItinerary.itineraryId,
              name: newItinerary.location,
            },
          ],
        },
      ]);
      setNewItinerary(null);
    } else {
      const newItem = {
        id: newItinerary.itineraryId,
        name: newItinerary.location,
      };
      const originalBaseBlocks = scheduleBlocks.filter(
        (block) => block.id === 'base_block'
      );
      const updateNewBaseBlock = [
        ...originalBaseBlocks[0].items,
        { ...newItem },
      ];
      setBaseBlock([
        {
          id: 'base_block',
          items: [...updateNewBaseBlock],
        },
      ]);
    }
  }, [newItinerary]);

  ////////
  /////////
  ////////
  /////////
  ///////
  // useEffect(() => {
  //   if (!scheduleBlocks) return;
  //   console.log('scheduleBlocks');
  //   console.log(scheduleBlocks);
  // }, [scheduleBlocks]);
  // useEffect(() => {
  //   console.log('itineraries_dates');
  //   console.log(itineraries_dates);
  // }, [itineraries_dates]);
  // useEffect(() => {
  //   console.log('===itineraries_datetime====');
  //   console.log(itineraries_datetime);
  // }, [itineraries_datetime]);
  ////////
  ///////
  ////////
  ///////////

  useEffect(() => {
    if (!gpxContent) return;
    const gpx = new gpxParser();
    gpx.parse(gpxContent);
    const gpxPoints = gpx.tracks[0].points.map((point) => [
      point.lat,
      point.lon,
    ]);
    // console.log('gpxPoints');
    // console.log(gpxPoints);

    setScheduleArrangement('gpxPoints', gpxPoints);
    addGPXtoDB(temporaryScheduleId, gpxPoints);
  }, [gpxContent]);

  const handleSortEnd = (blockId, items) => {
    setScheduleBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          return { ...block, items };
        }
        return block;
      })
    );
    setIsSortEnd(true);
  };

  const handleUploadGPX = async (e) => {
    const file = e.target.files[0];
    setScheduleArrangement('gpxFileName', file.name);
    const url = await getUploadFileUrl('gpx_file', file, temporaryScheduleId);
    const response = await fetch(url);
    const data = await response.text();
    setGPXContent(data);
  };
  return (
    <>
      <TripName>
        <label htmlFor="tripName">路線名稱</label>
        <TripNameInput
          id="tripName"
          type="text"
          placeholder="未命名的路線名稱"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </TripName>
      <CalendarDate selectDates={setSelectedDates} />

      {scheduleBlocks.length > 0 &&
        scheduleBlocks.map((block, index) => (
          <ScheduleBlock key={block.id}>
            {index < scheduleBlocks.length - 1 && (
              <>
                <Day>
                  <hr />
                  <h6>{`第${index + 1}天`}</h6>
                  <hr />
                </Day>
              </>
            )}
            <ReactSortable
              className="sortable"
              {...sortableOptions}
              setList={(items) => {
                handleSortEnd(block.id, items);
              }}
              list={block.items}
            >
              {block.items.map((item) => (
                <Location key={item.id} name={item.name} id={item.id} />
              ))}
            </ReactSortable>
          </ScheduleBlock>
        ))}
      <SaveScheduleBtn />
      <input
        type="file"
        accept=".gpx"
        onChange={handleUploadGPX}
        id="gpxUpload"
        style={{ display: 'none' }}
      />
      <GPXfileWrapper>
        <GPXfileName>{gpxFileName}</GPXfileName>
        <UploadGpxButton as="label" htmlFor="gpxUpload">
          上傳 GPX 檔案
        </UploadGpxButton>
      </GPXfileWrapper>
    </>
  );
};

export default Schedules;
