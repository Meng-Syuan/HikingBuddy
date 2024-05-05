import styled from 'styled-components';
import color from '@theme';
import { LoginHover_icon, Login_icon } from '/src/assets/svg/svgIcons';
import hoverMixin from '@utils/hoverMixin';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useAuth,
  useClerk,
} from '@clerk/clerk-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import sweetAlert, { Toast } from '@utils/sweetAlert';
import { useEffect } from 'react';

import { signInWithCustomToken, updateProfile } from 'firebase/auth';
import { auth } from '@utils/firebase/firebaseConfig.js';
import useUsersDB from '@utils/hooks/useUsersDB';
import { useUserState } from '@utils/zustand';

//components
import ButtonWrapper from '../Button/ButtonWrapper';

const LoginBtn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45px;
  height: 40px;
  &:hover {
    cursor: pointer;
    color: ${color.secondary};
  }
  ${hoverMixin('login-hover', 'login')}
`;
const Span_login = styled.span`
  line-height: 16px;
  font-size: 0.6rem;
`;

const ProfileBtn = styled(ButtonWrapper)`
  margin: 0 30px;
`;

const Img = styled.img`
  border-radius: 50%;
  border: 1px solid ${color.primary};
  object-fit: cover;
`;

const SignOutBtn = styled(FontAwesomeIcon)`
  font-size: 1.8rem;
  color: #4f4f4f;
  &:hover {
    color: ${color.secondary};
    cursor: pointer;
  }
`;

export const SignIn = () => {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { getUserData, setUsersDB } = useUsersDB();
  const { setUserState, userPhoto } = useUserState();

  useEffect(() => {
    if (!isSignedIn) return;
    const fetchUserData = async () => {
      const data = await getUserData();
      if (!data) {
        signInWithClerk();
      } else {
        setUserState('userData', data);
        setUserState('userPhoto', data.userPhoto || '');
        setUserState('activeScheduleId', data.activeSchedule);
        setUserState('userPostsIds', data.posts || []);
      }
    };
    fetchUserData();
  }, [isSignedIn]);

  useEffect(() => {
    if (!userId) return;
    Toast.fire({
      icon: 'success',
      title: '登入成功🎉',
      timer: 1500,
      width: '220px',
    });
  }, [userId]);

  const signInWithClerk = async () => {
    const token = await getToken({ template: 'integration_firebase' });
    const userCredentials = await signInWithCustomToken(auth, token || '');

    await updateProfile(userCredentials.user, {
      displayName: user.username,
    });
    //sync users data with firestore
    await setUsersDB(userId, user.username, user.imageUrl || '');
  };

  const userInfo = user
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        isLoaded,
        isSignedIn,
        userId,
      }
    : null;

  return (
    <>
      {/* before sign-in */}
      <SignedOut>
        <SignInButton>
          <LoginBtn>
            <Login_icon />
            <LoginHover_icon />
            <Span_login>Log In</Span_login>
          </LoginBtn>
        </SignInButton>
      </SignedOut>

      {/*Manage account after sign-in */}
      <SignedIn>
        {userInfo && (
          <NavLink
            to="/profile"
            style={({ isActive }) => {
              return {
                color: isActive ? `${color.primary}` : `${color.textColor}`,
              };
            }}
          >
            <ProfileBtn>
              <Img src={userPhoto} alt="profile page entry" />
            </ProfileBtn>
          </NavLink>
        )}
      </SignedIn>
    </>
  );
};

export const SignOut = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleSignOut = () => {
    alert('預備開始登出');
    signOut();
    alert('要回首頁了');
    navigate('/');
  };
  return (
    <>
      {isSignedIn && (
        <SignOutBtn
          icon={faArrowRightFromBracket}
          title="登出"
          onClick={handleSignOut}
        />
      )}
    </>
  );
};
