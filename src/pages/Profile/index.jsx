import styled from 'styled-components';
import { screen } from '@/theme';
import { SignedIn } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';

//utils
import useNavgateToHomeWithAlert from '@/hooks/useNavigateToHomeWithAlert';

const ProfileContainer = styled.main`
  width: 1100px;
  ${screen.xl} {
    width: 100vw;
  }
`;

const Profile = () => {
  useNavgateToHomeWithAlert();
  return (
    <SignedIn>
      <ProfileContainer>
        <Outlet />
      </ProfileContainer>
    </SignedIn>
  );
};

export default Profile;
