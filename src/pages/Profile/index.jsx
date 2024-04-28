import styled from 'styled-components';

//components
import { Outlet } from 'react-router-dom';

const ProfileContainer = styled.main`
  width: 1050px;
  background-color: #d9d9d9;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const Profile = () => {
  //判斷登入狀態!!
  return (
    <ProfileContainer>
      <Outlet />
    </ProfileContainer>
  );
};

export default Profile;
