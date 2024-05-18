import styled from 'styled-components';
import color from '@/theme';
import wireframe from '/src/assets/img/wireframe.png';
import { useState, useEffect, useRef } from 'react';

//utils
import { useUserState, useTourGuideRefStore } from '@/utils/zustand';
import useUsersDB from '@/hooks/useUsersDB';
import useUploadFile from '@/hooks/useUploadFile';

//components
import Trip from './MinifyTrip';
//#region
const PersonalInfoWrapper = styled.section`
  flex: 0 0 320px;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 25px;
  background-color: ${color.lightBackgroundColor};
`;

const UserPhoto = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Tip = styled.span`
  position: absolute;
  font-size: 0.75rem;
  top: 50%;
  z-index: 1;
`;

const Image = styled.img`
  width: 220px;
  height: 220px;
  object-fit: contain;
`;

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
  margin: 1rem 5px;
`;

//#endregion
const PersonalInfo = () => {
  const { userData, userPhoto, futureSchedules, pastSchedules, setUserState } =
    useUserState();

  const { getUploadFileUrl } = useUploadFile();
  const { updateUserDoc } = useUsersDB();
  const [activeId, setActiveId] = useState('');
  const [imgUpload, setImgUpload] = useState('');
  const { setRefStore } = useTourGuideRefStore();
  const futureTripsRef = useRef(null);
  const pastTripsRef = useRef(null);

  const previewURL = imgUpload || userPhoto || wireframe;

  useEffect(() => {
    setRefStore('futureTripsRef', futureTripsRef);
    setRefStore('pastTripsRef', pastTripsRef);
  }, []);

  useEffect(() => {
    if (!userData) return;
    const id = userData.activeSchedule;
    setActiveId(id);
  }, [userData]);

  const handleUploadUserPhoto = async (e) => {
    const file = e.target.files[0];
    const url = await getUploadFileUrl('user_photo', file, userData.userId);
    setImgUpload(url);
    setUserState('userPhoto', url);
    await updateUserDoc('userPhoto', url);
  };
  return (
    <PersonalInfoWrapper>
      <input
        type="file"
        accept="image/png,image/jpeg"
        id="userPhoto"
        style={{ display: 'none' }}
        onChange={handleUploadUserPhoto}
      ></input>
      <UserPhoto as="label" htmlFor="userPhoto">
        <Image src={previewURL} alt="user photo in profile" />
        {!userPhoto && <Tip>點選並上傳</Tip>}
      </UserPhoto>
      <TripsWrapper>
        <FutureTrips ref={futureTripsRef}>
          {futureSchedules.length > 0 &&
            futureSchedules.map((schedule) => (
              <Trip
                key={schedule.id}
                id={schedule.id}
                firstDay={schedule.firstDay}
                lastDay={schedule.lastDay}
                tripName={schedule.tripName}
                activeId={activeId}
                type="futureSchedules"
              />
            ))}
        </FutureTrips>
        <Split />
        <PastTrips ref={pastTripsRef}>
          {pastSchedules.length > 0 &&
            pastSchedules.map((schedule) => (
              <Trip
                key={schedule.id}
                id={schedule.id}
                firstDay={schedule.firstDay}
                lastDay={schedule.lastDay}
                tripName={schedule.tripName}
                activeId={activeId}
                type="pastSchedules"
              />
            ))}
        </PastTrips>
      </TripsWrapper>
    </PersonalInfoWrapper>
  );
};

export default PersonalInfo;
