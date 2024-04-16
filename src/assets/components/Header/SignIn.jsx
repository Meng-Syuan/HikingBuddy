import styled from 'styled-components';
import color from '@theme';
import { LoginHover_icon, Login_icon } from '/src/assets/img/svgIcons';
import hoverMixin from '@utils/hoverMixin';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { signInWithCustomToken, updateProfile } from 'firebase/auth';
import { auth } from '@utils/firebaseConfig.js';
import { usersDB } from '@utils/firestore.js';

//components
import ButtonWrapper from '../Button/ButtonWrapper';

const LoginBtn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48px;
  height: 45px;
  &:hover {
    cursor: pointer;
    color: ${color.secondary};
  }
  ${hoverMixin('login-hover', 'login')}
`;
const Span_login = styled.span`
  line-height: 16px;
  font-size: 0.625rem;
`;

const ProfileBtn = styled(ButtonWrapper)`
  margin: 0 30px;
`;

const Img = styled.img`
  border-radius: 50%;
  border: 1px solid ${color.primary};
`;

const SignIn = () => {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  //之後要打開
  // useEffect(() => {
  //   if (isLoaded && isSignedIn) {
  //     signInWithClerk();
  //   }
  // }, [isLoaded, isSignedIn]);

  const signInWithClerk = async () => {
    const token = await getToken({ template: 'integration_firebase' });
    const userCredentials = await signInWithCustomToken(auth, token || '');

    await updateProfile(userCredentials.user, {
      displayName: user.username,
    });
    //sync users data with firestore
    await usersDB.setUsersDB(userId, user.username);
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
          <ProfileBtn>
            <Img src={user.imageUrl} alt="profile page entry" />
          </ProfileBtn>
        )}
      </SignedIn>
    </>
  );
};

export default SignIn;
