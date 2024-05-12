import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import { useEffect, useState } from 'react';
import { usePostState } from '@utils/zustand';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const Marker = () => {
  const { getScheduleDetails } = useSchedulesDB();
  const { postId, markers, setPostState } = usePostState();
  const [locations, setlocations] = useState([]);
  const [selections, setSelections] = useState([]);
  useEffect(() => {
    if (!postId) return;
    setSelections([]);
    const fetchScheduleData = async () => {
      const result = await getScheduleDetails(postId);
      const locations = result.map(({ itineraryId, geopoint, location }) => ({
        id: itineraryId,
        geopoint: [geopoint._long, geopoint._lat],
        name: location,
      }));
      setlocations(locations);
    };
    fetchScheduleData();
  }, [postId]);

  useEffect(() => {
    const markers = selections.map((selection) => selection.geopoint);
    setPostState('markers', markers);
  }, [selections]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelections(value);
  };

  return (
    <>
      {postId && (
        <FormControl sx={{ m: 1, minWidth: 150, maxWidth: 250 }} size="small">
          <InputLabel style={{ fontSize: '0.875rem' }}>
            選擇日誌座標點
          </InputLabel>
          <Select
            multiple
            value={selections}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value.id} label={value.name} />
                ))}
              </Box>
            )}
          >
            {locations.length > 0 &&
              locations.map((location) => (
                <MenuItem key={location.id} value={location}>
                  {location.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default Marker;
