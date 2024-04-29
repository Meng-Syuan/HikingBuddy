import styled from 'styled-components';
import color from '@theme';
import logo from '/src/assets/img/logo.png';
import { NavLink } from 'react-router-dom';
import SignIn from './SignIn';
import { useUserState } from '@utils/zustand';
import { useEffect, useState } from 'react';
import useUsersDB from '@utils/hooks/useUsersDB';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';

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
  const { getUserData } = useUsersDB();
  const { sortSchedulesDates } = useSchedulesDB();
  const { setUserState, activeScheduleId, userData } = useUserState();
  const [scheduleId, setScheduleId] = useState('no_active_schedule');

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserState('userData', data);
      setUserState('userPhoto', data?.userPhoto);
      setUserState('activeScheduleId', data.activeSchedule);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!activeScheduleId) return;
    setScheduleId(activeScheduleId ?? 'no_active_schedule');
  }, [activeScheduleId]);

  useEffect(() => {
    if (!userData) return;
    console.log(userData);
    const sortDates = async () => {
      const sortedResult = await sortSchedulesDates(userData);
      console.log(sortedResult);
      setUserState('futureSchedules', sortedResult.futureSchedules);
      setUserState('pastSchedules', sortedResult.pastSchedules);
    };
    sortDates();
  }, [userData]);

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
            <ListItem>
              <NavLink to={`/protector/${scheduleId}`}>親愛的留守人</NavLink>
            </ListItem>
          </UnorderedList>
        </Navigation>
        <SignIn />
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
