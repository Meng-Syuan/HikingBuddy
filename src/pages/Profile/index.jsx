import styled from 'styled-components';

//components
import { Outlet } from 'react-router-dom';

const StyledProfileContainer = styled.main`
  width: 1050px;
  background-color: #d9d9d9;
  display: flex;
  justify-content: space-between; //待修改
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const Profile = () => {
  return (
    <StyledProfileContainer>
      <Outlet />
    </StyledProfileContainer>
  );
};

export default Profile;
