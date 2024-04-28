import styled from 'styled-components';
import color from '@utils/theme';
//components
import PersonalInfo from './PersonalInfo';
import Post from './Post';

const ProfileWrapper = styled.section`
  display: flex;
  gap: 20px;
  padding: 0 10px;
`;
const ProfileHome = () => {
  return (
    <ProfileWrapper>
      <Post />
      <PersonalInfo />
    </ProfileWrapper>
  );
};

export default ProfileHome;
