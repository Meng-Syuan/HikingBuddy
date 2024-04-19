import styled from 'styled-components';
import CalendarDate from './CalendarDate';
import color from '@theme';
import { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { schedulesDB } from '@utils/firestore';
import { useAuth } from '@clerk/clerk-react';
import Location from './SingleLocation';
import SaveScheduleBtn from './SaveScheduleBtn';
import { useScheduleArrangement } from '@utils/zustand';

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

const sortableOptions = {
  animation: 100,
  fallbackOnBody: true,
  swapThreshold: 0.1,
  ghostClass: 'ghost',
  group: 'shared',
  forceFallback: true,
};

const Schedules = () => {
  const { userId } = useAuth();
  const {
    setItineraries,
    itineraries,
    newItinerary,
    setNewItinerary,
    setGeopoints,
    tripName,
    setTripName,
    updateItinerariesWithDates,
  } = useScheduleArrangement();
  const [selectedDates, setSelectedDates] = useState([]);
  const [baseBlock, setBaseBlock] = useState(null);
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [isSortEnd, setIsSortEnd] = useState(false);

  const getTemporaryLocations = useCallback(async () => {
    const temporaryLocations = await schedulesDB.getTemporaryLocations(userId);

    if (temporaryLocations) {
      //for UI render
      const items = temporaryLocations.map((location) => ({
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
      const geopoints = temporaryLocations.map((location) => {
        return {
          lat: location.geopoint._lat,
          lng: location.geopoint._long,
          id: location.itineraryId,
          name: location.location,
        };
      });
      setGeopoints(geopoints);

      const itineraries = temporaryLocations.map((location) => ({
        itineraryId: location.itineraryId,
        location: location.location,
      }));
      setItineraries(itineraries);
    }
  }, [userId]);

  //get temporary schedule and set the global itineraries state from db when first loading
  useEffect(() => {
    getTemporaryLocations();
  }, []);

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
        return { ...block, items: updateItemsWithDate };
      });

      setScheduleBlocks(updateBlocks);
      setIsSortEnd(false);
    }
  }, [isSortEnd]);

  //update date properties to itineraries
  useEffect(() => {
    // console.log('scheduleBlocks');
    // console.log(scheduleBlocks);
    if (scheduleBlocks.length > 1) {
      const itinerariesWithDates = scheduleBlocks.reduce((acc, curr) => {
        curr.items.forEach((item) => {
          acc.push({
            itineraryId: item.id,
            date: item.date,
          });
        });
        return acc;
      }, []);
      updateItinerariesWithDates(itinerariesWithDates);
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

  useEffect(() => {
    console.log('itineraries');
    console.log(itineraries);
  }, [itineraries]);
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
  const handleTripNameChange = (e) => {
    setTripName(e.target.value);
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
          onChange={handleTripNameChange}
        />
      </TripName>
      <CalendarDate selectDates={setSelectedDates} />

      {scheduleBlocks.map((block, index) => (
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
    </>
  );
};

export default Schedules;
