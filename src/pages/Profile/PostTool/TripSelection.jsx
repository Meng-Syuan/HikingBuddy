import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useUserState, usePostState } from '@utils/zustand';
import usePostsDB from '@utils/hooks/usePostsDB';

const TripSelection = () => {
  const { getPostData } = usePostsDB();
  const { pastSchedules } = useUserState();
  const { postId, tripName, setPostState, resetPostState } = usePostState();
  const [tripSelection, setTripSelection] = useState([]);

  useEffect(() => {
    if (pastSchedules.length === 0) return;
    const selection = pastSchedules.map((schedule) => ({
      id: schedule.id,
      tripName: schedule.tripName,
    }));
    setTripSelection(selection);
  }, [pastSchedules]);

  useEffect(() => {
    const fetchPostData = async (postId) => {
      const data = await getPostData(postId);
      if (data) {
        setPostState('title', data.title);
        setPostState('tripName', data.tripName);
        setPostState('content', data.content);
        setPostState('allUploadPhotos', data.allUploadPhotos);
        setPostState('mainPhoto', data.mainPhoto);
      } else {
        resetPostState();
      }
    };

    if (!postId) {
      resetPostState();
    } else {
      fetchPostData(postId);
    }
  }, [postId]);

  const handleChange = (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    setPostState('postId', value);
    setPostState('tripName', value);
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
        {tripSelection &&
          tripSelection.map((selection) => (
            <MenuItem value={selection.id} key={selection.id}>
              {selection.tripName}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default TripSelection;
