import styled from 'styled-components';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';

import { Toast } from '@/utils/sweetAlert';

//components
import { Outlet } from 'react-router-dom';

const ProfileContainer = styled.main`
  width: 1100px;
`;

const Profile = () => {
  const { isSignedIn } = useAuth();
  useEffect(() => {
    if (!isSignedIn) {
      Toast.fire({
        title: '未登入',
        text: '請在右上角進行登入操作',
        icon: 'info',
      });
    }
  }, [isSignedIn]);
  return (
    <ProfileContainer>
      <Outlet />
    </ProfileContainer>
  );
};

export default Profile;
