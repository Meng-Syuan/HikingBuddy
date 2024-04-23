import styled from 'styled-components';
import color from '@utils/theme';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUserData } from '@utils/zustand';
import Trip from './MinifyTrip';

const PersonalInfoWrapper = styled.section`
  flex: 0 0 320px;
  border: 2px blue solid;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px 25px;
`;

const UserPhoto = styled.div`
  width: 220px;
  height: 220px;
  background-color: #fff;
`;
const UploadBtn = styled.button``;

const TripsWrapper = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FutureTrips = styled.div`
  flex-basis: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
const PastTrips = styled(FutureTrips)``;
const Split = styled.hr`
  height: 1px;
  width: 100%;
  border: none;
  background-color: #888;
  margin: 5px;
`;

const PersonalInfo = () => {
  const { userData, futureSchedules, pastSchedules } = useUserData();
  const { useSortSchedulesDates } = useSchedulesDB();
  const [activeId, setActiveId] = useState('');

  // useEffect(() => {
  //   if (!userData) return;
  //   const fetchActiveScheduleId = async () => {
  //     const id = await getActiveScheduleId(); //不用! 之後直接取useData 裡面的資料!
  //     setActiveId(id);
  //   };
  //   fetchActiveScheduleId();
  // }, [userData]);
  useEffect(() => {
    if (!userData) return;
    const id = userData.activeSchedule;
    setActiveId(id);
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    console.log(userData);
    useSortSchedulesDates();
  }, [userData]);

  //comfirment?
  useEffect(() => {
    console.log('futureSchedules');
    console.log(futureSchedules);
    console.log('pastSchedules');
    console.log(pastSchedules);
  }, [futureSchedules, pastSchedules]);

  return (
    <PersonalInfoWrapper>
      <UserPhoto>
        使用者照片，很重要嗎？
        <UploadBtn>你確定？</UploadBtn>
      </UserPhoto>
      <TripsWrapper>
        <FutureTrips>
          {futureSchedules.length > 0 &&
            futureSchedules.map((schedule) => (
              <Trip
                key={schedule.id}
                id={schedule.id}
                firstDay={schedule.firstDay}
                lastDay={schedule.lastDay}
                isChecked={schedule.isChecklistComfirmed}
                activeId={activeId}
              />
            ))}
        </FutureTrips>
        <Split></Split>
        <PastTrips>
          過去的
          {pastSchedules.length > 0 &&
            pastSchedules.map((schedule) => (
              <Trip
                key={schedule.id}
                id={schedule.id}
                firstDay={schedule.firstDay}
                lastDay={schedule.lastDay}
                isChecked={schedule.isChecklistComfirmed}
                activeId={activeId}
              />
            ))}
        </PastTrips>
      </TripsWrapper>
    </PersonalInfoWrapper>
  );
};

export default PersonalInfo;
