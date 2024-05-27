import styled from 'styled-components';
import color, { screen } from '@/theme';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';

import PlanningSchedule from './Schedules/PlanningSchedule';
import Map from './PlanningMap';
import SaveScheduleBtn from './Schedules/SaveScheduleBtn';
import UploadGPX from './Schedules/UploadGPX';

const TabsContainer = styled.section`
  display: none;
  ${screen.md} {
    display: flex;
    flex-direction: column;
    width: 100vw;
    min-height: calc(100vh - 80px);
  }
`;

const TabsBox = styled(Box)`
  border-bottom: 1px solid ${color.borderColor};
  color: ${color.textColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  .MuiTabs-indicator {
    background-color: #704621;
  }
`;

const StyledTab = styled(Tab)`
  width: 30vw;
  height: 52px;
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-right: 1rem;
`;

const MapWrapper = styled.div`
  position: relative;
`;

const PlanningTabs = ({ isSaved, setSave }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabsContainer>
      <TabsBox>
        <Tabs value={value} onChange={handleChange}>
          <StyledTab label="地圖" />
          <StyledTab label="行程表" />
        </Tabs>
        <ButtonsContainer>
          <UploadGPX />
          <SaveScheduleBtn isSaved={isSaved} setSave={setSave} />
        </ButtonsContainer>
      </TabsBox>
      {value === 0 && (
        <MapWrapper>
          <Map />
        </MapWrapper>
      )}
      {value === 1 && <PlanningSchedule />}
    </TabsContainer>
  );
};

export default PlanningTabs;
