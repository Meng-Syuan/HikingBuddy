import styled from 'styled-components';
import color from '@/theme';
import profileDefault from '/src/assets/img/profileDefault.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';

import { signInWithCustomToken, updateProfile } from 'firebase/auth';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useAuth,
  useClerk,
  useSignIn,
} from '@clerk/clerk-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

//utils
import { auth } from '@/utils/firebase/firebaseConfig.js';
import { useUserState } from '@/zustand';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';
import getDocById from '@/firestore/getDocById';
import sweetAlert, { showErrorToast, Toast } from '@/utils/sweetAlert';

const LoginBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  height: 40px;
`;
const LoginIntro = styled.span`
  line-height: 16px;
  font-size: 0.6rem;
`;

const ProfileBtn = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  font-size: 0.5rem;
  border-radius: 50%;
  border: 1px solid ${color.primary};
  object-fit: cover;
`;

const SignOutIcon = styled(FontAwesomeIcon)`
  font-size: 1.8rem;
  color: #4f4f4f;
  &:hover {
    color: ${color.secondary};
    cursor: pointer;
  }
`;

const SignInIcon = styled(SignOutIcon)``;

export const SignInBtn = () => {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { setUserState, userPhoto } = useUserState();
  const [isFirstLogin, setIsFirstLogin] = useState();

  const profileIcon = userPhoto || profileDefault;

  useEffect(() => {
    if (!isSignedIn) return;
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
  }, [isSignedIn, isFirstLogin]);

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
        isFirstSignIn: true,
        schedulesIDs: [],
        posts: [],
      };
      await setFirestoreDoc('users', userId, newUserInfo);
      setIsFirstLogin(true);
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
      <SignedOut>
        <SignInButton mode="modal">
          <LoginBtnWrapper>
            <SignInIcon icon={faUser}></SignInIcon>
            <LoginIntro>Log In</LoginIntro>
          </LoginBtnWrapper>
        </SignInButton>
      </SignedOut>

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

export const SignOutBtn = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

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
    <SignOutIcon
      icon={faArrowRightFromBracket}
      title="登出"
      onClick={handleSignOut}
    />
  );
};

export const SignInAsGuest = () => {
  const { signIn } = useSignIn();
  const signInAsGuest = async () => {
    const identifier = 'testor+clerk_test@example.com';
    const password = 'testaccountpassword';
    try {
      await signIn.create({
        identifier,
        password,
      });
      window.location.reload();
    } catch (error) {
      await Toast.fire({
        icon: 'error',
        title: '登入失敗',
        text: '可嘗試重整或洽專案管理員',
        position: 'center',
      });
    }
  };
  return (
    <LoginBtnWrapper>
      <SignInIcon
        icon={faArrowRightToBracket}
        title="訪客模式登入"
        onClick={signInAsGuest}
      />
      <LoginIntro>GUSET</LoginIntro>
    </LoginBtnWrapper>
  );
};
