import styled from 'styled-components';
import color, { screen } from '@/theme';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';

import MapInfo from './MapInfo';
import ScheduleInfo from './ScheduleInfo';
import HikerInfo from './HikerInfo';

const TabsWrapper = styled(Box)`
  display: flex;
  border-bottom: 1px solid #999;
  color: ${color.textColor};
  background-color: ${color.lightBackgroundColor};
  .MuiTabs-indicator {
    background-color: #704621;
  }
  ${screen.lg} {
    justify-content: center;
  }
  ${screen.md} {
    justify-content: start;
  }
`;

const StyledTab = styled(Tab)`
  width: 230px;
  height: 3.5rem;
  letter-spacing: 0.4rem;
  font-size: 1rem;
  font-family: 'Noto Sans TC';
  font-weight: 350;
  color: ${color.textColor};
  &.Mui-selected {
    color: ${color.secondary};
    background-color: rgba(139, 87, 42, 0.1);
    font-weight: 480;
  }
  ${screen.lg} {
    width: 30vw;
  }
`;

const SmallScreenTab = styled(StyledTab)`
  display: none;
  width: 0;
  ${screen.lg} {
    display: inline-block;
    width: 30vw;
  }
`;

const HikerInfoWrapper = styled.div`
  display: none;
  ${screen.lg} {
    display: block;
  }
`;

const ProtectorTabs = ({ id, valid, gpxPoints, isEditable }) => {
  const [value, setValue] = useState(0);

  //for RWD
  useEffect(() => {
    const handleViewPortResize = () => {
      if (window.innerWidth < 800) return;
      if (window.innerWidth >= 800 && value === 2) {
        setValue(0);
      }
    };
    window.addEventListener('resize', handleViewPortResize);

    return () => {
      window.removeEventListener('resize', handleViewPortResize);
    };
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {valid && (
        <TabsWrapper>
          <Tabs value={value} onChange={handleChange}>
            <StyledTab label="查看地圖" />
            <StyledTab label="規劃清單" />
            <SmallScreenTab label="登山者資訊" />
          </Tabs>
        </TabsWrapper>
      )}
      {value === 0 && <MapInfo isEditable={isEditable} gpxPoints={gpxPoints} />}
      {value === 1 && <ScheduleInfo />}
      {value === 2 && (
        <HikerInfoWrapper>
          <HikerInfo isEditable={isEditable} valid={valid} id={id} />
        </HikerInfoWrapper>
      )}
    </>
  );
};

export default ProtectorTabs;
