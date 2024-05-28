import styled, { keyframes } from 'styled-components';
import color, { screen } from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useEffect } from 'react';

//utils
import { useTourGuideRefStore, useUserState } from '@/zustand';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';
import { showErrorToast } from '@/utils/sweetAlert';

const flip = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }

`;

const TourGuideWrapper = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 1rem;
  border: 1px solid ${color.secondary};
  background: ${color.secondary};
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    animation: ${flip} 1.5s infinite ease-in-out forwards;
    cursor: pointer;
  }
  ${screen.xl} {
    position: absolute;
    right: 1rem;
    top: 320px;
  }
  ${screen.md} {
    position: fixed;
    top: 140px;
  }
`;

const TourGuide = () => {
  const { tripSelectionRef, futureTripsRef, pastTripsRef } =
    useTourGuideRefStore();
  const { userData } = useUserState();

  useEffect(() => {
    if (!userData?.isFirstSignIn) return;
    driverObj.drive();
    try {
      const updatedLoginStatus = { isFirstSignIn: false };
      setFirestoreDoc('users', userData.userId, updatedLoginStatus);
    } catch (error) {
      showErrorToast('網頁導覽發生錯誤', error.message);
    }
  }, [userData]);

  const driverObj = driver({
    steps: [
      {
        element: futureTripsRef?.current,
        popover: {
          title: '未來行程',
          description:
            '顯示裝備清單準備狀態、標示留守人功能。點擊可查看行前準備。',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: pastTripsRef?.current,
        popover: {
          title: '過去行程',
          description: '點擊查看行程回顧',
          side: 'right',
          align: 'center',
        },
      },
      {
        element: tripSelectionRef?.current,
        popover: {
          title: '過去路線',
          description: '選擇以進行發文',
          side: 'right',
          align: 'center',
        },
      },
    ],
  });

  return (
    <TourGuideWrapper onClick={() => driverObj.drive()}>
      <FontAwesomeIcon icon={faQuestion} size="lg" style={{ color: '#fff' }} />
    </TourGuideWrapper>
  );
};

export default TourGuide;
