import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useUserState, usePostState } from '@utils/zustand';

const PastTrip = () => {
  const { pastSchedules } = useUserState();
  const { postId, tripName, setPostState, isTemporaryPost } = usePostState();
  const [tripSelection, setTripSelection] = useState([]);

  useEffect(() => {
    //這是沒有暫存的情況下，之後寫暫存功能的話要加判斷式
    if (pastSchedules.length === 0) return;
    if (!isTemporaryPost) {
      console.log('pastSchedules');
      console.log(pastSchedules);
      const selection = pastSchedules.map((schedule) => ({
        id: schedule.id,
        tripName: schedule.tripName,
      }));
      setTripSelection(selection);
    }
  }, [pastSchedules]);

  const handleChange = (e) => {
    setPostState('postId', e.target.value);
    setPostState('tripName', e.target.value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="tripNameSelection">路線</InputLabel>
      <Select
        labelId="tripNameSelection"
        value={tripName}
        autoWidth
        onChange={handleChange}
      >
        <MenuItem
          value=""
          style={{
            fontSize: '0.75rem',
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          選擇路線名稱
        </MenuItem>

        {!isTemporaryPost &&
          tripSelection &&
          tripSelection.map((selection) => (
            <MenuItem value={selection.id} key={selection.id}>
              {selection.tripName}
            </MenuItem>
          ))}
        {/* 之後如果有暫存的話渲染方式會不一樣 */}
        {/* {!isTemporaryPost &&
          tripSelection &&
          tripSelection.map((selection) => (
            <MenuItem value={selection.id}>{selection.tripName}</MenuItem>
          ))} */}
      </Select>
    </FormControl>
  );
};

export default PastTrip;
