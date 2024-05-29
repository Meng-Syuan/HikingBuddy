import styled from 'styled-components';
import color, { screen } from '@/theme';
import logo from '/src/assets/img/logo.png';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

//utils
import { useUserState, usePostMapState } from '@/zustand';
import useFirestoreSchedules from '@/hooks/useFirestoreSchedules';
import getPostsList from '@/firestore/getPostsList';
import { showErrorToast } from '@/utils/sweetAlert';
import { SignedOut, useAuth } from '@clerk/clerk-react';

//component
import { SignInBtn, SignOutBtn, SignInAsGuest } from './AuthIcon';
import HeaderNavBtn from './HeaderNavBtn';
import SignInModal from '../SignInModal';

const HeaderContainer = styled.header`
  height: 80px;
  border-top: solid 10px #4f8700;
  border-bottom: solid 5px ${color.primary};
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 500;
  background: #fff;
  padding: 0 25px;
`;
const HeaderContent = styled.div`
  width: 1150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoNavLink = styled(NavLink)`
  position: relative;
  top: 3px;
  left: 2px;
  height: 85%;
  width: 80px;
`;

const Logo = styled.img`
  height: 100%;
`;

const Navigation = styled.nav`
  width: 80%;
  display: flex;
  justify-content: center;
  ${screen.md} {
    display: none;
  }
`;
const UnorderedList = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 100%;
  .active {
    font-weight: 450;
    color: ${color.primary};
  }
`;
const ListItem = styled.li`
  width: 30%;
  letter-spacing: 0.25rem;
  color: ${color.textColor};
  &:hover {
    font-weight: 450;
    color: ${color.primary};
    cursor: pointer;
  }
`;
const Split = styled.hr`
  border: none;
  background-color: ${color.textColor};
  width: 1px;
  height: 1rem;
  &:nth-child(6) {
    display: none;
  }
`;

const AuthIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100px;
`;

const Header = () => {
  const { isSignedIn } = useAuth();
  const { sortSchedulesDates } = useFirestoreSchedules();
  const { setUserState, activeScheduleId, userData, futureSchedules } =
    useUserState();
  const { setPostMarkers } = usePostMapState();
  const [scheduleId, setScheduleId] = useState('no_active_schedule');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    if (!userData) return;
    const sortDates = async () => {
      const sortedResult = await sortSchedulesDates(userData);
      setUserState('futureSchedules', sortedResult?.futureSchedules);
      setUserState('pastSchedules', sortedResult?.pastSchedules);
    };
    sortDates();
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    (async () => {
      const postIds = userData.posts;
      try {
        const postsData = await getPostsList(postIds);
        const postMarkers = postsData.map((post) => {
          const markers = Object.values(post.markers);
          return markers.map((marker) => {
            return {
              id: post.id,
              title: post.title,
              coordinates: marker,
              createTime: post.createTime,
            };
          });
        });
        setPostMarkers('postMarkers', postMarkers.flat());
      } catch (error) {
        await showErrorToast('發生錯誤', error.message);
      }
    })();
  }, [userData]);

  useEffect(() => {
    if (futureSchedules.length < 1) return;
    const listsConfirmedStatus = futureSchedules.map((schedule) => ({
      id: schedule.id,
      isConfirmed: schedule.isChecklistConfirmed,
    }));
    setUserState('listsConfirmedStatus', listsConfirmedStatus);
  }, [futureSchedules]);

  useEffect(() => {
    if (!activeScheduleId) return;
    setScheduleId(activeScheduleId ?? 'no_active_schedule');
  }, [activeScheduleId]);

  const pageslinks = [
    { id: '規劃助手', link: '/path-planner' },
    { id: '山閱足跡', link: '/postslist' },
    { id: '親愛的留守人', link: `/protector/${scheduleId}` },
  ];
  return (
    <>
      <SignedOut>
        <SignInModal
          isModalOpen={isSignInModalOpen}
          setModalOpen={setIsSignInModalOpen}
        />
      </SignedOut>
      <HeaderContainer id="header">
        <HeaderContent>
          <LogoNavLink to="/">
            <Logo src={logo} alt="logo-homepage" />
          </LogoNavLink>
          <Navigation>
            <UnorderedList>
              {isSignedIn ? (
                <>
                  {pageslinks.map((link) => (
                    <>
                      <ListItem key={link.id} as={NavLink} to={link.link}>
                        {link.id}
                      </ListItem>
                      <Split />
                    </>
                  ))}
                </>
              ) : (
                <>
                  {pageslinks.map((link) => (
                    <>
                      <ListItem
                        key={link.id}
                        onClick={() => setIsSignInModalOpen(true)}
                      >
                        {link.id}
                      </ListItem>
                      <Split />
                    </>
                  ))}
                </>
              )}
            </UnorderedList>
          </Navigation>

          <HeaderNavBtn
            pageslinks={pageslinks}
            setIsSignInModalOpen={setIsSignInModalOpen}
          />
          <AuthIconWrapper>
            <SignInBtn />
            {isSignedIn ? <SignOutBtn /> : <SignInAsGuest />}
          </AuthIconWrapper>
        </HeaderContent>
      </HeaderContainer>
    </>
  );
};

export default Header;
