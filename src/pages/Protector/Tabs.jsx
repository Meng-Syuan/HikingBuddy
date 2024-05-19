import styled from 'styled-components';
import color from '@/theme';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';

import MapInfo from './MapInfo';
import ScheduleInfo from './ScheduleInfo';

const TabsWrapper = styled(Box)`
  border-bottom: 1px solid #999;
  color: ${color.textColor};
  background-color: ${color.lightBackgroundColor};
  .MuiTabs-indicator {
    background-color: #704621;
  }
`;

const StyledTab = styled(Tab)`
  width: 250px;
  height: 3.5rem;
  letter-spacing: 0.4rem;
  font-size: 1rem;
  font-family: 'Noto Sans TC';
  font-weight: 350;
  color: ${color.textColor};
  &.Mui-selected {
    color: ${color.secondary};
  }
  &:focus {
    color: ${color.secondary};
    background-color: rgba(139, 87, 42, 0.1);
    font-weight: 480;
  }
`;

export default function ProtectorTabs({ isEditable, valid, gpxPoints }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {valid && (
        <TabsWrapper>
          <Tabs value={value} onChange={handleChange}>
            <StyledTab label="地圖助手" />
            <StyledTab label="規劃清單" />
          </Tabs>
        </TabsWrapper>
      )}
      {value === 0 && <MapInfo isEditable={isEditable} gpxPoints={gpxPoints} />}
      {value === 1 && <ScheduleInfo />}
    </>
  );
}
