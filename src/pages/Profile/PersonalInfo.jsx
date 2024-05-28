import styled from 'styled-components';
import color, { screen } from '@/theme';
import profileDefault from '/src/assets/img/profileDefault.png';
import { useState, useEffect, useRef } from 'react';

//utils
import { useUserState, useTourGuideRefStore } from '@/zustand';
import uploadFile from '@/utils/uploadFile';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';
import { showErrorToast } from '@/utils/sweetAlert';

//components
import Trip from './MinifyTrip';
//#region
const PersonalInfoWrapper = styled.section`
  width: 320px;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 25px;
  background-color: ${color.lightBackgroundColor};
  ${screen.lg} {
    width: 35vw;
    padding: 20px 5px;
  }
  ${screen.md} {
    width: 100vw;
    min-height: auto;
  }
`;

const UserPhoto = styled.div`
  width: 220px;
  height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ${screen.lg} {
    width: 90%;
  }
  ${screen.md} {
    width: 40vw;
    height: 40vw;
  }
`;

const Tip = styled.span`
  position: absolute;
  font-size: 0.75rem;
  top: 50%;
  z-index: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TripsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${screen.md} {
    flex-direction: row;
    justify-content: center;
  }
  ${screen.sm} {
    flex-direction: column;
  }
`;

const TripsTime = styled.span`
  font-size: 1.2rem;
`;

const FutureTrips = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  ${screen.sm} {
    width: 90%;
  }
`;
const PastTrips = styled(FutureTrips)``;

const Split = styled.hr`
  height: 1px;
  width: 100%;
  border: none;
  background-color: #888;
  margin: 1rem 5px;
  ${screen.lg} {
    width: 90%;
  }
  ${screen.md} {
    width: 0;
  }
`;

//#endregion
const PersonalInfo = () => {
  const { userData, userPhoto, futureSchedules, pastSchedules, setUserState } =
    useUserState();

  const { getUploadFileUrl } = uploadFile();
  const [activeId, setActiveId] = useState('');
  const [imgUpload, setImgUpload] = useState('');
  const { setRefStore } = useTourGuideRefStore();
  const futureTripsRef = useRef(null);
  const pastTripsRef = useRef(null);

  const previewURL = imgUpload || userPhoto || profileDefault;

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
    try {
      const firestoreItem = { userPhoto: url };
      await setFirestoreDoc('users', userData.userId, firestoreItem);
    } catch (error) {
      await showErrorToast('照片上傳失敗', error.message);
    }
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
        {!userPhoto && <Tip>點選並上傳個人照片</Tip>}
      </UserPhoto>
      <TripsWrapper>
        <FutureTrips ref={futureTripsRef}>
          <TripsTime>未來行程</TripsTime>
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
          <TripsTime>過去行程</TripsTime>
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
