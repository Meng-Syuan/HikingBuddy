import styled from 'styled-components';
//components
import PersonalInfo from './PersonalInfo';
import Post from './Post';
import TourGuide from './TourGuide';

const ProfileWrapper = styled.section`
  display: flex;
  gap: 20px;
  padding: 0 10px;
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
