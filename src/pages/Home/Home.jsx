import styled from 'styled-components';
import BackgroundVideo from './BackgroundVideo';
import Intro from './Intro';
import mountainBackground from '/src/assets/img/mountain_background.jpg';

const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FixedBackground = styled.img`
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100vh;
  top: 0;
`;

const Home = () => {
  return (
    <HomeContainer>
      <FixedBackground
        src={mountainBackground}
        alt="mountain background picture"
      />
      <BackgroundVideo />
      <Intro />
    </HomeContainer>
  );
};

export default Home;
