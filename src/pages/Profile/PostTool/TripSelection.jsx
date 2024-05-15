import { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
  useUserState,
  usePostWritingState,
  useTourGuideRefStore,
} from '@utils/zustand';
import usePostsDB from '@utils/hooks/usePostsDB';
import styled from 'styled-components';
import color from '@theme';

const StyledInputLabel = styled(InputLabel)`
  background: ${color.lightBackgroundColor};
  padding: 0 5px;
`;

const TripSelection = () => {
  const { getPostData } = usePostsDB();
  const { pastSchedules } = useUserState();
  const { setRefStore } = useTourGuideRefStore();
  const { postId, tripName, setPostState, resetPostState } =
    usePostWritingState();
  const [tripSelection, setTripSelection] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    setRefStore('tripSelectionRef', ref);
  }, []);

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
        setPostState('title', '');
        setPostState('content', '');
        setPostState('allUploadPhotos', []);
        setPostState('mainPhoto', '');
      }
    };

    if (!postId) {
      resetPostState();
    } else {
      fetchPostData(postId);
    }
  }, [postId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setPostState('postId', value);
    setPostState('tripName', value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small" ref={ref}>
      <StyledInputLabel id="tripNameSelection">路線</StyledInputLabel>
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
          選擇過去路線名稱
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
