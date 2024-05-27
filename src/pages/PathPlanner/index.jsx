import styled from 'styled-components';
import color, { screen } from '@/theme';
import 'leaflet/dist/leaflet.css';
import { useAuth, SignedIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Toast } from '@/utils/sweetAlert';
import { useScheduleArrangement } from '@/zustand';

//components
import Map from './PlanningMap';
import Schedule from './Schedules/PlanningSchedule';
import PlanningTabs from './PlanningTabs';

const PlannerContainer = styled.main`
  display: flex;
  width: 1100px;
  justify-content: center;
  background-color: ${color.lightBackgroundColor};
  ${screen.lg} {
    width: 100vw;
  }
  ${screen.md} {
    flex-direction: column;
    align-items: center;
  }
`;

const TripName = styled.div`
  display: none;
  ${screen.md} {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    border-bottom: 1px solid ${color.borderColor};
    width: 100%;
    padding: 0.5rem 1rem;
  }
`;

const TripNameLabel = styled.label``;

const TripNameInput = styled.input`
  width: 300px;
  padding: 5px 10px;
  border: 1px solid ${color.borderColor};
  border-radius: 5px;
  background-color: ${color.lightBackgroundColor};
  ${screen.md} {
    width: 200px;
  }
`;

const MapWrapper = styled.section`
  position: relative;
  flex: 1;
  ${screen.md} {
    display: none;
    width: 100vw;
  }
`;

const ScheduleWrapper = styled.section`
  background-color: ${color.lightBackgroundColor};
  flex: 0 0 340px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${screen.md} {
    display: none;
  }
`;

const PathPlanner = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { tripName, setScheduleArrangement } = useScheduleArrangement();
  const [isSaved, setIsSaved] = useState(false);

  const navigateToHomeWithAlert = async () => {
    if (isSignedIn) return;
    await Toast.fire({
      title: '請先登入',
      icon: 'warning',
      timer: 1500,
    });
    navigate('/');
  };

  navigateToHomeWithAlert();

  return (
    <SignedIn>
      <PlannerContainer>
        <TripName>
          <TripNameLabel htmlFor="tripName">路線名稱</TripNameLabel>
          <TripNameInput
            id="tripName"
            type="text"
            placeholder="未命名的路線名稱"
            value={tripName}
            onChange={(e) => setScheduleArrangement('tripName', e.target.value)}
            maxLength={10}
          />
        </TripName>
        <PlanningTabs isSaved={isSaved} setSave={setIsSaved} />
        <MapWrapper>
          <Map />
        </MapWrapper>

        <ScheduleWrapper>
          <Schedule isSaved={isSaved} setSave={setIsSaved} />
        </ScheduleWrapper>
      </PlannerContainer>
    </SignedIn>
  );
};

export default PathPlanner;
