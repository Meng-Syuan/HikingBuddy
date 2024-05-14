import styled from 'styled-components';
import color from '@theme';
import logo from '/src/assets/img/logo.png';
import { NavLink } from 'react-router-dom';
import { SignIn, SignOut } from './AuthIcon';
import { useAuth } from '@clerk/clerk-react';
import { useUserState } from '@utils/zustand';
import { useEffect, useState } from 'react';
import useUsersDB from '@utils/hooks/useUsersDB';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';

const HeaderContainer = styled.header`
  height: 80px;
  border-top: solid 10px #4f8700;
  border-bottom: solid 5px ${color.primary};
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
  background: #fff;
`;
const HeaderContent = styled.div`
  width: 1100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
`;

const LogoNavLink = styled(NavLink)`
  position: relative;
  top: 3px;
  left: 2px;
  height: 85%;
  width: 140px;
`;

const Logo = styled.img`
  height: 100%;
`;

const Navigation = styled.nav`
  width: 100%;
`;
const UnorderedList = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;
const ListItem = styled.li`
  width: 30%;
  letter-spacing: 0.25rem;
`;
const Split = styled.hr`
  border: none;
  background-color: ${color.textColor};
  width: 1px;
  height: 1rem;
`;

const AuthIconWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 130px;
`;

const Header = () => {
  const { isSignedIn } = useAuth();
  const { getUserData } = useUsersDB();
  const { sortSchedulesDates } = useSchedulesDB();
  const {
    isTestingAccount,
    setUserState,
    activeScheduleId,
    userData,
    futureSchedules,
  } = useUserState();
  const [scheduleId, setScheduleId] = useState('no_active_schedule');

  useEffect(() => {
    if (!isSignedIn && !isTestingAccount) return;
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserState('userData', data);
      setUserState('userPhoto', data?.userPhoto || '');
      setUserState('activeScheduleId', data?.activeSchedule);
      setUserState('userPostsIds', data.posts || []);
    };
    fetchUserData();
  }, [isSignedIn]);

  useEffect(() => {
    if (!userData) return;
    const sortDates = async () => {
      const sortedResult = await sortSchedulesDates(userData);
      setUserState('futureSchedules', sortedResult.futureSchedules);
      setUserState('pastSchedules', sortedResult.pastSchedules);
    };
    sortDates();
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

  return (
    <HeaderContainer id="header">
      <HeaderContent>
        <LogoNavLink to="/">
          <Logo src={logo} alt="logo-homepage" />
        </LogoNavLink>
        <Navigation>
          <UnorderedList>
            <ListItem
              as={NavLink}
              to="/path-planner"
              style={({ isActive }) => {
                return {
                  color: isActive ? `${color.primary}` : `${color.textColor}`,
                  fontWeight: isActive ? '450' : '',
                };
              }}
            >
              規劃助手
            </ListItem>
            <Split />
            <ListItem
              as={NavLink}
              to="/postslist"
              style={({ isActive }) => {
                return {
                  color: isActive ? `${color.primary}` : `${color.textColor}`,
                  fontWeight: isActive ? '450' : '',
                };
              }}
            >
              山閱足跡
            </ListItem>
            <Split />
            <ListItem
              as={NavLink}
              to={`/protector/${scheduleId}`}
              style={({ isActive }) => {
                return {
                  color: isActive ? `${color.primary}` : `${color.textColor}`,
                  fontWeight: isActive ? '450' : '',
                };
              }}
            >
              親愛的留守人
            </ListItem>
          </UnorderedList>
        </Navigation>
        <AuthIconWrapper>
          <SignIn />
          <SignOut />
        </AuthIconWrapper>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
