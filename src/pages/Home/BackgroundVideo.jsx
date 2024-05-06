import styled, { keyframes } from 'styled-components';
import video from '../../assets/home_video.mp4';
import scrollDownIcon from '../../assets/svg/whiteArrow.svg';

const VideoWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: calc(100vh - 80px);
`;

const Video = styled.video`
  min-width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const OverlayText = styled.div`
  position: absolute;
  top: 35%;
  left: 20%;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-family: 'Kalam', Courier, monospace;
  font-weight: bold;
  color: #fff;
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
`;

const Slogan = styled.h3`
  font-family: 'Kalam', Courier, monospace;
  color: #000;
  font-size: 1.6rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards 1.2s;
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  z-index: 5;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
  height: 35px;
  animation: ${bounce} 1.8s infinite;
`;

const Icon = styled.img`
  width: 100%;
`;

const BackgroundVideo = () => {
  return (
    <VideoWrapper>
      <Video src={video} autoPlay muted loop></Video>
      <OverlayText>
        <Title>Hiking Buddy</Title>
        <Slogan>Embarking on a Journey to the Peak.</Slogan>
      </OverlayText>
      <IconWrapper>
        <Icon src={scrollDownIcon} alt="scroll down icon" />
      </IconWrapper>
    </VideoWrapper>
  );
};

export default BackgroundVideo;
