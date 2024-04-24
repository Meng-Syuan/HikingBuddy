import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserData, useProtectorPageData } from '@utils/zustand';
import { useAuth } from '@clerk/clerk-react';

import HikerInfo from './HikerInfo';
import { useState, useEffect } from 'react';
import { sha256 } from 'js-sha256';
import useProtectorsDB from '@utils/hooks/useProtectorsDB';
import useUsersDB from '@utils/hooks/useUsersDB';

const ProtectorContainer = styled.main`
  width: 80vw;
  display: flex;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const TabsWrapper = styled.section`
  border: 2px dashed #ddd;
  min-height: calc(100vh - 100px);
  flex: 2 1 530px;
`;

const firestoreDocIdLength = 20;
const Protector = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const navigate = useNavigate();
  const scheduleId = useParams().encryptedScheduleId;
  const { isSignedIn } = useAuth();

  const { userData } = useUserData();
  const { hashKey, getProtectorDoc } = useProtectorsDB();
  const { getActiveScheduleIdByPassword } = useUsersDB();
  const { setProtectorPageData } = useProtectorPageData();

  useEffect(() => {
    const checkStatus = async () => {
      const hashedPassword = sha256.hmac(scheduleId, hashKey);
      if (!isSignedIn && scheduleId.length <= firestoreDocIdLength) {
        alert('請先登入😊');
        navigate('/');
      } else if (isSignedIn && scheduleId.length <= firestoreDocIdLength) {
        const encryptedId = sha256(scheduleId);
        const hashedPassword = sha256.hmac(encryptedId, hashKey);
        const id = await getActiveScheduleIdByPassword(hashedPassword);
        if (id) {
          const hikerInfo = await getProtectorDoc(id);
          setProtectorPageData('hikerInfo', hikerInfo);
          setProtectorPageData('hikerPhoto', hikerInfo.hiker_photo);
          setIsEditable(true);
          setIsUrlValid(true);
        } else {
          alert('請先到行程表下方啟用留守人功能 😊');
          navigate('/profile');
        }
      } else if (scheduleId.length > firestoreDocIdLength) {
        const id = await getActiveScheduleIdByPassword(hashedPassword);
        if (id) {
          const hikerInfo = await getProtectorDoc(id);
          setProtectorPageData('hikerInfo', hikerInfo);
          setProtectorPageData('hikerPhoto', hikerInfo.hiker_photo);
          setIsEditable(false);
          setIsUrlValid(true);
        } else {
          alert('此網址功能未生效');
          navigate('/');
        }
      }
    };
    checkStatus();
  }, [scheduleId, userData]);

  useEffect(() => {
    console.log('isEditable////');
    console.log(isEditable);
  }, [isEditable]);
  return (
    <ProtectorContainer>
      <TabsWrapper></TabsWrapper>
      <HikerInfo
        isEditable={isEditable}
        id={scheduleId}
        valid={isUrlValid}
      ></HikerInfo>
    </ProtectorContainer>
  );
};

export default Protector;
