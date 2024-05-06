import styled from 'styled-components';
import Map from '../../components/Map/HomepageMap';
import Poc from './Poc';
import BackgroundVideo from './BackgroundVideo';
import Intro from './Intro';
import { useAuth } from '@clerk/clerk-react';
const HomeContainer = styled.div``;

const MapWrapper = styled.main`
  width: 100vw;
`;
const IntroContainer = styled.main``;

const VideoWrapper = styled.div``;

const Home = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <HomeContainer>
      {/* {!isSignedIn && ( */}
      <IntroContainer>
        {/* <VideoWrapper> */}
        <BackgroundVideo />
        <Intro /> {/* </VideoWrapper> */}
      </IntroContainer>
      {/* )} */}

      {/* <MapWrapper> */}
      <Map />
      {/* <Poc></Poc> */}
      {/* </MapWrapper> */}
    </HomeContainer>
  );
};

export default Home;
