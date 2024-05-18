import { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
  useUserState,
  usePostWritingState,
  useTourGuideRefStore,
} from '@/zustand';
import styled from 'styled-components';
import color from '@/theme';
import getDocById from '@/firestore/getDocById';
import sweetAlert, { showErrorToast } from '@/utils/sweetAlert';

const StyledInputLabel = styled(InputLabel)`
  background: ${color.lightBackgroundColor};
  padding: 0 5px;
`;

const TripSelection = () => {
  const { pastSchedules } = useUserState();
  const { setRefStore } = useTourGuideRefStore();
  const {
    postId,
    tripName,
    title,
    content,
    setPostWritingState,
    resetPostWritingState,
  } = usePostWritingState();
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
    if (!postId) {
      resetPostWritingState();
    } else {
      (async () => {
        try {
          const data = await getDocById('posts', postId);
          if (data) {
            setPostWritingState('title', data?.title);
            setPostWritingState('content', data?.content);
            setPostWritingState('allUploadPhotos', data?.allUploadPhotos);
            setPostWritingState('mainPhoto', data?.mainPhoto);
          } else {
            //to clear text field if no temp data
            setPostWritingState('title', '');
            setPostWritingState('content', '');
            setPostWritingState('allUploadPhotos', '');
            setPostWritingState('mainPhoto', '');
          }
        } catch (error) {
          await showErrorToast('發生錯誤', error.message);
        }
      })();
    }
  }, [postId]);

  const handleChange = async (e) => {
    const value = e.target.value;
    if (title || content) {
      const { value: willChangeTrip } = await sweetAlert.confirm(
        '暫存是否完成？',
        '若未暫存可能導致資料遺失😯',
        'question',
        '更換路線',
        '返回'
      );
      if (!willChangeTrip) return;
    }
    setPostWritingState('postId', value);
    setPostWritingState('tripName', value);
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
