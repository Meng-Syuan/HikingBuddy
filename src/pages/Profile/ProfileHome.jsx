import styled from 'styled-components';
import { screen } from '@/theme';
//components
import PersonalInfo from './PersonalInfo';
import Post from './Post';
import TourGuide from './TourGuide';

const ProfileWrapper = styled.section`
  display: flex;
  gap: 20px;
  ${screen.lg} {
    gap: 0;
  }
  ${screen.md} {
    flex-direction: column-reverse;
  }
`;
const ProfileHome = () => {
  return (
    <ProfileWrapper>
      <TourGuide />
      <Post />
      <PersonalInfo />
    </ProfileWrapper>
  );
};

export default ProfileHome;
