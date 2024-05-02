import styled from 'styled-components';
import Map from '../../components/Map/HomepageMap';

const MapWrapper = styled.main`
  width: 100vw;
`;

const Home = () => {
  return (
    <MapWrapper>
      <Map />
    </MapWrapper>
  );
};

export default Home;
