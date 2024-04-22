import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import color from '@utils/theme';
//components
import Header from './components/Header/Header';
import Map from './components/Map/HomepageMap';

import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react';
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const StyledBackground = styled.div`
  min-height: calc(100vh - 100px);
  background-color: ${color.mainBackgound};
  padding: 0 40px;
`;

function App() {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ClerkLoading>
          {/* clerk loading 使用 */}
          {/* <div>Clerk is loading</div> */}
        </ClerkLoading>
        <ClerkLoaded>
          <Header />
          <StyledBackground>
            <Outlet />
          </StyledBackground>
        </ClerkLoaded>
        <div>This div is always visible</div>
      </ClerkProvider>

      {/* <Map /> */}
    </>
  );
}

export default App;
