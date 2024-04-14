import Map from './PlaningMap';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components';
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

const PlannerWrapper = styled.aside`
  background-color: green;
  flex: 0 1 350px;
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
        <MapWrapper>{isSignedIn && <Map />}</MapWrapper>
        <PlannerWrapper></PlannerWrapper>
      </PlannerContainer>
    </>
  );
};

export default PathPlanner;
