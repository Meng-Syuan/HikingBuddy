import styled from 'styled-components';
import color from '@utils/theme';
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
`;

const StyledTab = styled(Tab)`
  width: 250px;
  height: 4rem;
  letter-spacing: 0.4rem;
  font-size: 1rem;
`;

export default function ProtectorTabs({ isEditable }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <TabsWrapper>
        <Tabs value={value} onChange={handleChange}>
          <StyledTab label="地圖助手" />
          <StyledTab label="規劃清單" />
        </Tabs>
      </TabsWrapper>
      {value === 0 && <MapInfo isEditable={isEditable} />}
      {value === 1 && <ScheduleInfo />}
    </>
  );
}
