import styled from 'styled-components';
import CalendarDate from './CalendarDate';
import color from '@theme';
import { useState, useEffect } from 'react';
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
  const { setItineraries, itineraries, newItinerary, setNewItinerary } =
    useScheduleArrangement();
  const [selectedDates, setSelectedDates] = useState([]);
  const [baseBlock, setBaseBlock] = useState(null);
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [isSortEnd, setIsSortEnd] = useState(false);

  //get temporary schedule from db when first loading
  useEffect(() => {
    const getTemporaryLocations = async (userId) => {
      const temporaryLocations = await schedulesDB.getTemporaryLocations(
        userId
      );
      if (temporaryLocations) {
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
      }
    };
    getTemporaryLocations(userId);
  }, []);
  //setScheduleBlocks when base block change(add new location / get data from db)
  useEffect(() => {
    if (baseBlock) {
      setScheduleBlocks(baseBlock);
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

  //get itineraries details and set to global state management
  useEffect(() => {
    // console.log(scheduleBlocks);
    const itinerariesDetails = scheduleBlocks.reduce((acc, curr) => {
      curr.items.forEach((item) => {
        acc.push({
          itineraryId: item.id,
          location: item.name,
          date: item.date,
        });
      });
      return acc;
    }, []);
    setItineraries(itinerariesDetails);
  }, [scheduleBlocks]);

  //set the new location on time
  useEffect(() => {
    if (!newItinerary) return;

    //initial state
    if (scheduleBlocks.length === 0) {
      console.log('新增第一筆');
      console.log(newItinerary);
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
      console.log('已經有base資料，再新增進來');
      const newItem = {
        id: newItinerary.itineraryId,
        name: newItinerary.location,
      };
      const updateBaseBlocks = scheduleBlocks.map((block) => {
        if (block.id === 'base_block') {
          return {
            id: 'base_block',
            items: [...block.items, { ...newItem }],
          };
        }
        return block;
      });
      setScheduleBlocks(updateBaseBlocks);
      console.log('setScheduleBlocks complete');
    }
  }, [newItinerary]);

  useEffect(() => {
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

  return (
    <>
      <TripName>
        <label htmlFor="tripName">路線名稱</label>
        <TripNameInput
          id="tripName"
          type="text"
          placeholder="未命名的路線名稱"
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
