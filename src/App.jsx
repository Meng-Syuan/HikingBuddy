import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import color from '@utils/theme';
//components
import Header from './components/Header/Header';

import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react';
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const StyledBackground = styled.div`
  min-height: calc(100vh - 80px);
  background-color: ${color.mainBackgound};
  display: flex;
  justify-content: center;
`;

function App() {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ClerkLoading>
          {/* clerk loading 使用 */}
          <div></div>
        </ClerkLoading>
        <ClerkLoaded>
          <Header />
          <StyledBackground>
            <Outlet />
          </StyledBackground>
        </ClerkLoaded>
        {/* <div>This div is always visible</div> */}
      </ClerkProvider>
    </>
  );
}

export default App;
