import styled from 'styled-components';
import color from '@theme';
import logo from '/src/assets/img/logo.png';
import { LoginHover_icon, Login_icon } from '/src/assets/img/svgIcons';
import hoverMixin from '@utils/hoverMixin';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';

//components
import ButtonWrapper from '../Button/ButtonWrapper';

const HeaderContainer = styled.header`
  height: 100px;
  border-top: solid 10px #4f8700;
  border-bottom: solid 5px ${color.primary};
  /* padding: 0px 50px; */
  display: flex;
  justify-content: center;
`;
const HeaderContent = styled.div`
  border: 1px solid ${color.primary};
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  height: 90px;
  margin: 0 30px;

  img {
    height: 100%;
  }
`;

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
  span {
    line-height: 16px;
    font-size: 10px;
  }
`;

const ProfileBtn = styled(ButtonWrapper)`
  margin: 0 30px;
  img {
    border-radius: 50%;
    border: 1px solid ${color.primary};
  }
`;

const Navigation = styled.nav`
  border: 1px solid ${color.primary};
`;
const UnorderedList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  letter-spacing: 2px;
  /* width: 50vw; */
`;
const ListItem = styled.li``;

const Header = () => {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  // const navigate = useNavigate();

  // const handleProfileClick = (e) => {
  //   e.preventDefault();
  //   navigate('/profile');
  // };

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
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <img src={logo} alt="logo-homepage" />
        </Logo>
        <Navigation>
          <UnorderedList>
            <ListItem>
              <NavLink
                to="/path-planner"
                style={({ isActive }) => {
                  return {
                    color: isActive ? `${color.primary}` : `${color.textColor}`,
                  };
                }}
              >
                規劃助手
              </NavLink>
            </ListItem>
            {/* <span className="split">|</span> */}
            <ListItem>山閱足跡</ListItem>
            {/* <span className="split">|</span> */}
            <ListItem>親愛的留守人</ListItem>
          </UnorderedList>
        </Navigation>
        {/* before sign-in */}
        <SignedOut>
          <SignInButton>
            <LoginBtn>
              <Login_icon />
              <LoginHover_icon />
              <span>Log In</span>
            </LoginBtn>
          </SignInButton>
        </SignedOut>

        {/*Manage account after sign-in */}
        <SignedIn>
          {userInfo && (
            <ProfileBtn onClick={() => console.log(userInfo)}>
              <img src={user.imageUrl} alt="profile page entry" />
            </ProfileBtn>
          )}
        </SignedIn>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
