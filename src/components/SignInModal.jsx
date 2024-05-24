import styled from 'styled-components';
import { SignIn } from '@clerk/clerk-react';

const BackDrop = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  display: ${({ $isOpen }) => ($isOpen ? '' : 'none')};
`;

const SignInWrapper = styled.div`
  width: fit-content;
  margin: auto;
  transform: translateY(calc((100vh - 100%) / 2));
`;

const SignInModal = ({ isModalOpen, setModalOpen }) => {
  const handleSignIn = (e) => {
    e.stopPropagation();
  };
  return (
    <BackDrop $isOpen={isModalOpen} onClick={() => setModalOpen(false)}>
      <SignInWrapper $isOpen={isModalOpen} onClick={handleSignIn}>
        <SignIn />
      </SignInWrapper>
    </BackDrop>
  );
};

export default SignInModal;
