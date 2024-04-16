import Map from './PlaningMap';
import Schedules from './Schedules/Schedules';
import styled from 'styled-components';
import color from '@utils/theme';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const PlannerContainer = styled.main`
  display: flex;
`;
const MapWrapper = styled.section`
  position: relative;
  flex: 1;
`;

const SchedulesWrapper = styled.aside`
  background-color: ${color.lightBackgroundColor};
  flex: 0 1 350px;
  padding: 20px;
`;

const PathPlanner = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  // 之後用 CSS 修改彈出式視窗
  if (!isSignedIn) {
    alert(`請先登入 😊`);
    navigate('/');
  }
  return (
    <>
      <PlannerContainer>
        {/* <MapWrapper>{isSignedIn && <Map />}</MapWrapper> */}
        <SchedulesWrapper>
          <Schedules />
        </SchedulesWrapper>
      </PlannerContainer>
    </>
  );
};

export default PathPlanner;
