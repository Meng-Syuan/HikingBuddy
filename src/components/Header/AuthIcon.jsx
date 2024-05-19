import styled from 'styled-components';
import color from '@/theme';
import { LoginHover_icon, Login_icon } from '/src/assets/svg/svgIcons';
import profileDefault from '/src/assets/img/profileDefault.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { signInWithCustomToken, updateProfile } from 'firebase/auth';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useAuth,
  useClerk,
} from '@clerk/clerk-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect } from 'react';

//utils
import hoverMixin from '@/utils/hoverMixin';
import { auth } from '@/utils/firebase/firebaseConfig.js';
import useUsersDB from '@/hooks/useUsersDB';
import { useUserState } from '@/zustand';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';
import getDocById from '@/firestore/getDocById';
import sweetAlert, { showErrorToast } from '@/utils/sweetAlert';

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

const ProfileBtn = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin: 0 30px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  font-size: 0.5rem;
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
  const { setUserState, userPhoto, isTestingAccount } = useUserState();

  const profileIcon = userPhoto || profileDefault;

  useEffect(() => {
    if (!isSignedIn && !isTestingAccount) return;
    (async () => {
      try {
        const userData = await getDocById('users', userId);
        if (!userData) {
          signInWithClerk();
        } else {
          setUserState('userData', userData);
          setUserState('userPhoto', userData?.userPhoto || '');
          setUserState('activeScheduleId', userData?.activeSchedule);
          setUserState('userPostsIds', userData.posts || []);
        }
      } catch (error) {
        await showErrorToast('取得使用者資料錯誤', error.message);
      }
    })();
  }, [isSignedIn, isTestingAccount]);

  const signInWithClerk = async () => {
    const token = await getToken({ template: 'integration_firebase' });
    const userCredentials = await signInWithCustomToken(auth, token || '');

    await updateProfile(userCredentials.user, {
      displayName: user.username,
    });
    //sync users data with firestore
    try {
      const newUserInfo = {
        userId,
        username: user.username,
        userPhoto: user.imageUrl || '',
      };
      await setFirestoreDoc('users', userId, newUserInfo);
    } catch (error) {
      await showErrorToast('使用者資料寫入錯誤', error.message);
    }
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
              <Img src={profileIcon} alt="profile page entry" />
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

  const handleSignOut = async () => {
    const { value: willSignOut } = await sweetAlert.confirm(
      '注意',
      '確定要登出嗎😯？',
      'question',
      '確認登出',
      '取消'
    );
    if (!willSignOut) return;
    signOut();
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
