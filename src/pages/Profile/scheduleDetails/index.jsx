import styled from 'styled-components';
import color, { styledListTitle, screen } from '@/theme';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sha256 } from 'js-sha256';
import { isFuture } from 'date-fns';

//utils
import { Toast, showErrorToast } from '@/utils/sweetAlert';
import { useScheduleState, useUserState } from '@/zustand';
import getDocById from '@/firestore/getDocById';
import getFirestoreDocs from '@/firestore/getFirestoreDocs';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';
import useNavigateToHomeWithAlert from '@/hooks/useNavigateToHomeWithAlert';

//components
import TripInfo from './TripInfo';
import ProtectorSetting from './ProtectorSetting';
import CheckList from './CheckList';

export const SharedListTitle = styled.h3`
  ${styledListTitle}
`;

const ArticlesContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1100px;
  background-color: ${color.lightBackgroundColor};
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 2rem;
  ${screen.xl} {
    width: 100vw;
  }
`;
const ArticleWrapper = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSplitLine = styled.hr`
  border: none;
  background-color: ${color.primary};
  height: 2px;
  width: 90%;
  margin-top: 1.5rem;
`;

const ButtonWrapper = styled.div`
  position: relative;
  height: 30px;
  align-self: flex-end;
  right: 90px;
`;
const StyledButton = styled(Button)`
  background-color: #8b572a;
  color: #fff;

  &:hover {
    background-color: #b3733b;
  }
`;

const SettingActionBtn = styled(StyledButton)`
  position: relative;
  bottom: 50px;
`;

const ScheduleDetails = () => {
  const HASH_KEY = import.meta.env.VITE_PROTECTOR_ACTIVE_HASH_KEY;
  const {
    scheduleInfo,
    locationNotes,
    isActive,
    toggleActiveState,
    gearChecklist,
    otherItemChecklist,
    setScheduleState,
  } = useScheduleState();
  const { userData, setUserState, activeScheduleId, listsConfirmedStatus } =
    useUserState();
  const { scheduleId } = useParams();
  const [tripsEditable, setTripsEditable] = useState(false);
  const [isFutureTrip, setIsFutureTrip] = useState(false);
  useNavigateToHomeWithAlert();

  useEffect(() => {
    (async () => {
      try {
        const scheduleInfo = await getDocById('schedules', scheduleId);
        const scheduleDetails = await getFirestoreDocs(
          `schedules/${scheduleId}/itineraries`
        );
        setScheduleState('scheduleInfo', scheduleInfo);
        setScheduleState('scheduleDetails', scheduleDetails);
      } catch (error) {
        await showErrorToast('發生錯誤', error.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!scheduleId || !activeScheduleId) return;
    setScheduleState('isActive', activeScheduleId === scheduleId);
  }, [scheduleId, activeScheduleId]);

  useEffect(() => {
    if (!scheduleInfo) return;
    const gearChecklist = scheduleInfo.gearChecklist;
    const otherItemChecklist = scheduleInfo.otherItemChecklist;
    const locationNotes = scheduleInfo.locationNotes || {};
    const lastDay = scheduleInfo.lastDay;
    if (isFuture(lastDay)) {
      setIsFutureTrip(true);
    }
    setScheduleState('locationNotes', locationNotes);
    setScheduleState('gearChecklist', gearChecklist);
    setScheduleState('otherItemChecklist', otherItemChecklist);
  }, [scheduleInfo]);

  const handleTripsEdition = async () => {
    setTripsEditable((prevState) => !prevState);
    if (Object.keys(locationNotes).length > 0) {
      try {
        const firestoreLocationNotes = { locationNotes };
        await setFirestoreDoc('schedules', scheduleId, firestoreLocationNotes);
      } catch (error) {
        await showErrorToast('上傳備註發生錯誤', error.message);
      }
    }
  };

  const handleSaveCheckList = async () => {
    const notCheckedGearItem = gearChecklist.find((item) => !item.isChecked);
    const notCheckedOtherItem = otherItemChecklist.find(
      (item) => !item.isChecked
    );
    const isAllItemsChecked = !notCheckedGearItem && !notCheckedOtherItem;
    const updatedConfirmedStatus = listsConfirmedStatus.map((list) => {
      if (list.id === scheduleId) {
        return { ...list, isConfirmed: isAllItemsChecked };
      } else {
        return list;
      }
    });

    try {
      const firestoreItem = {
        isChecklistConfirmed: isAllItemsChecked,
        gearChecklist,
        otherItemChecklist,
      };
      await setFirestoreDoc('schedules', scheduleId, firestoreItem);
      setUserState('listsConfirmedStatus', updatedConfirmedStatus);
      Toast.fire({
        text: '完成清單更新',
        icon: 'success',
      });
    } catch (error) {
      await showErrorToast('儲存清單準備失敗', error.message);
    }
  };

  const handleToggleProtectorFunc = async (isActive) => {
    toggleActiveState();
    if (!isActive) {
      try {
        const stoppedProtectorSetting = {
          activeSchedule: '',
          hashedPassword: '',
        };
        await setFirestoreDoc(
          'users',
          userData.userId,
          stoppedProtectorSetting
        );
        setUserState('activeScheduleId', '');
      } catch (error) {
        await showErrorToast('暫停留守功能發生錯誤', error.message);
      }
      return;
    }
    try {
      const encryptedId = sha256(scheduleId);
      const hashedPassword = sha256.hmac(encryptedId, HASH_KEY);
      const activeProtectorSetting = {
        activeSchedule: scheduleId,
        hashedPassword,
      };
      await setFirestoreDoc('users', userData.userId, activeProtectorSetting);
      setUserState('activeScheduleId', scheduleId);
    } catch (error) {
      await showErrorToast('啟用留守功能發生錯誤', error.message);
    }
  };

  return (
    <ArticlesContainer>
      <ArticleWrapper>
        <TripInfo isEditable={tripsEditable} />
        <ButtonWrapper>
          {isFutureTrip &&
            (tripsEditable ? (
              <StyledButton variant="contained" onClick={handleTripsEdition}>
                儲存變更
              </StyledButton>
            ) : (
              <StyledButton variant="contained" onClick={handleTripsEdition}>
                編輯備註
              </StyledButton>
            ))}
        </ButtonWrapper>
      </ArticleWrapper>

      <StyledSplitLine></StyledSplitLine>

      <ArticleWrapper>
        <CheckList isFuture={isFutureTrip} />
        <ButtonWrapper>
          {isFutureTrip && (
            <StyledButton variant="contained" onClick={handleSaveCheckList}>
              儲存變更
            </StyledButton>
          )}
        </ButtonWrapper>
      </ArticleWrapper>

      <StyledSplitLine />
      <ArticleWrapper>
        <ProtectorSetting salt={scheduleId} scheduleId={scheduleId} />
        <ButtonWrapper>
          {isActive ? (
            <SettingActionBtn
              variant="contained"
              onClick={() => handleToggleProtectorFunc(false)}
            >
              暫停功能
            </SettingActionBtn>
          ) : (
            <SettingActionBtn
              variant="contained"
              onClick={() => handleToggleProtectorFunc(true)}
            >
              啟用功能
            </SettingActionBtn>
          )}
        </ButtonWrapper>
      </ArticleWrapper>
    </ArticlesContainer>
  );
};

export default ScheduleDetails;
