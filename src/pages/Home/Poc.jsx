import styled, { keyframes } from 'styled-components';
import color from '@utils/theme';
import { useState } from 'react';

const NavContainer = styled.div``;

const MenuIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 4px;
  background: ${color.lightBackgroundColor};
  padding: 6px;
  z-index: 2;
  right: 0;
  &:hover {
    background: ${color.borderColor};
  }
`;

const MenuIcon = styled.div`
  width: 90%;
  height: 4px;
  background: ${color.textColor};
  position: relative;
  border-radius: 5px;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: ${(props) => (props.isOpen ? 'translateX(30px)' : '')};
  background: ${(props) => (props.isOpen ? 'transparent' : '')};
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
    transform: ${(props) =>
      props.isOpen ? 'translateX(-30px) rotate(45deg)' : ''};
    background: ${(props) => (props.isOpen ? color.secondary : '')};
  }
  &:after {
    transform: translateY(10px);
    transform: ${(props) =>
      props.isOpen ? 'translateX(-30px) rotate(-45deg)' : ''};
    background: ${(props) => (props.isOpen ? color.secondary : '')};
  }
`;

const menu = keyframes`
 0% { height: 1px; width: 0;padding:0 }
 50% { height: 1px; width: 30vw; padding:0 }
 100% { height: 50vh; width: 30vw;padding:1rem }`;

const NavWrapper = styled.div`
  overflow: hidden;
  position: fixed;
  z-index: 1;
  right: 0;
  background-color: #fff;
  transform: translate(-40px, 20px);
`;

const NavList = styled.ul`
  /* overflow: hidden; */

  list-style: none;
  background-color: #fff;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  width: 0;
  height: 0;
  animation: ${(props) => (props.isOpen ? menu : '')};
  animation-direction: ${(props) => (props.isOpen ? '' : 'reverse')};
  animation-duration: 5s;
  animation-fill-mode: forwards;
`;

const Poc = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <NavContainer>
      <NavContainer isOpen={isOpen}>
        <NavWrapper isOpen={isOpen}>
          <NavList isOpen={isOpen}>
            <li>
              <a href="#">規劃助手</a>
            </li>
            <li>
              <a href="#">山閱足跡</a>
            </li>
            <li>
              <a href="#">親愛的留守人</a>
            </li>
          </NavList>
        </NavWrapper>
      </NavContainer>
      <MenuIconWrapper onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon isOpen={isOpen}></MenuIcon>
      </MenuIconWrapper>
    </NavContainer>
  );
};

export default Poc;
