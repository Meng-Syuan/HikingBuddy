import Map from './PlanningMap';
import Schedules from './Schedules/Schedules';
import styled from 'styled-components';
import color from '@utils/theme';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import { useEffect } from 'react';

const PlannerContainer = styled.main`
  display: flex;
`;
const MapWrapper = styled.section`
  position: relative;
  flex: 1;
`;

const SchedulesWrapper = styled.section`
  background-color: ${color.lightBackgroundColor};
  flex: 0 1 350px;
  padding: 20px;
`;

const PathPlanner = () => {
  const { isSignedIn, userId } = useAuth();
  const { useNewItineraryListener } = useSchedulesDB();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) {
      alert(`請先登入 😊`);
      navigate('/');
    }
  }, []);

  useNewItineraryListener();

  // 之後用 CSS 修改彈出式視窗

  return (
    <>
      <PlannerContainer>
        <MapWrapper>{isSignedIn && <Map />}</MapWrapper>
        {isSignedIn && (
          <SchedulesWrapper>
            <Schedules />
          </SchedulesWrapper>
        )}
      </PlannerContainer>
    </>
  );
};

export default PathPlanner;
