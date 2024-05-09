import styled from 'styled-components';
import Poc from './Poc';
import BackgroundVideo from './BackgroundVideo';
import Intro from './Intro';
const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home = () => {
  return (
    <HomeContainer>
      <BackgroundVideo />
      <Intro />
    </HomeContainer>
  );
};

export default Home;
