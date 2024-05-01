import Map from './PlanningMap';
import Schedule from './Schedules/PlanningSchedule';
import styled from 'styled-components';
import color from '@utils/theme';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PlannerContainer = styled.main`
  display: flex;
`;
const MapWrapper = styled.section`
  position: relative;
  flex: 1;
`;

const ScheduleWrapper = styled.section`
  background-color: ${color.lightBackgroundColor};
  flex: 0 1 350px;
  padding: 20px;
`;

const PathPlanner = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) {
      alert(`請先登入 😊`);
      navigate('/');
    }
  }, []);

  return (
    <>
      <PlannerContainer>
        <MapWrapper>{isSignedIn && <Map />}</MapWrapper>
        {isSignedIn && (
          <ScheduleWrapper>
            <Schedule />
          </ScheduleWrapper>
        )}
      </PlannerContainer>
    </>
  );
};

export default PathPlanner;
