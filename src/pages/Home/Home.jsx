import styled from 'styled-components';
import Poc from './Poc';
import BackgroundVideo from './BackgroundVideo';
import Intro from './Intro';
const HomeContainer = styled.div``;

const IntroContainer = styled.main``;

const Home = () => {
  return (
    <HomeContainer>
      <IntroContainer>
        <BackgroundVideo />
        <Intro />
      </IntroContainer>
    </HomeContainer>
  );
};

export default Home;
