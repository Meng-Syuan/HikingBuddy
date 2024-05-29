import styled, { keyframes } from 'styled-components';
import color, { screen } from '@/theme';
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';

const NavContainer = styled.div`
  display: none;
  ${screen.md} {
    display: inline-block;
  }
`;

const MenuIconWrapper = styled.div`
  overflow: hidden;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 4px;
  background-color: #fff;
  padding: 6px;
  right: 1rem;
  top: 80px;
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? 'none' : '2px 2px 2px rgba(0, 0, 0, 0.4)'};
  cursor: pointer;
`;

const MenuIcon = styled.div`
  width: 90%;
  height: 4px;
  background: ${color.textColor};
  position: relative;
  border-radius: 5px;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(30px)' : '')};
  background: ${({ $isOpen }) => ($isOpen ? 'transparent' : '')};
  &:before,
  &:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 4px;
    background: ${color.textColor};
    border-radius: 5px;
    transition: all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  &:before {
    transform: translateY(-10px);
    transform: ${({ $isOpen }) =>
      $isOpen ? 'translateX(-30px) rotate(45deg)' : ''};
  }
  &:after {
    transform: translateY(10px);
    transform: ${({ $isOpen }) =>
      $isOpen ? 'translateX(-30px) rotate(-45deg)' : ''};
  }
`;

const menu = keyframes`
 0% { height: 1px; width: 0;padding:0 }
25% { height: 1px; width: 200px; padding:0 }
 100% { height: 200px; width: 200px;padding:40px 1rem 0 }`;

const NavWrapper = styled.div`
  overflow: hidden;
  position: fixed;
  background-color: #fff;
  right: 1rem;
  top: 80px;
  border-radius: 5px;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 0;
  height: 0;
  animation: ${({ $isOpen }) => ($isOpen ? menu : '')};
  animation-duration: 1.25s;
  animation-fill-mode: forwards;
  .active {
    font-weight: 450;
    color: ${color.primary};
  }
`;

const ListItem = styled.li`
  letter-spacing: 0.15rem;
  color: ${color.textColor};
  cursor: pointer;
`;

const HeaderNavBtn = ({ pageslinks, setIsSignInModalOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const handleSignIn = () => {
    setIsSignInModalOpen(true);
    setIsOpen(false);
  };
  return (
    <NavContainer $isOpen={isOpen}>
      <NavWrapper $isOpen={isOpen}>
        <NavList $isOpen={isOpen}>
          {isSignedIn ? (
            <>
              {pageslinks.map((link) => (
                <ListItem
                  key={link.id}
                  as={NavLink}
                  to={link.link}
                  onClick={() => setIsOpen(false)}
                >
                  {link.id}
                </ListItem>
              ))}
            </>
          ) : (
            <>
              {pageslinks.map((link) => (
                <ListItem key={link.id} onClick={handleSignIn}>
                  {link.id}
                </ListItem>
              ))}
            </>
          )}
        </NavList>
      </NavWrapper>

      <MenuIconWrapper $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon $isOpen={isOpen}></MenuIcon>
      </MenuIconWrapper>
    </NavContainer>
  );
};

export default HeaderNavBtn;
