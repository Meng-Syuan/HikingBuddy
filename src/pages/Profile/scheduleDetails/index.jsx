import styled from 'styled-components';
import color, { styledListTitle } from '@utils/theme';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { sha256 } from 'js-sha256';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import useProtectorsDB from '@utils/hooks/useProtectorsDB';
import { useScheduleState, useUserState } from '@utils/zustand';
import { useParams } from 'react-router-dom';
import { Toast } from '@utils/sweetAlert';
import { isFuture } from 'date-fns';

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
  width: 900px;
  background-color: ${color.lightBackgroundColor};
  position: relative;
  left: 50%;
  transform: translateX(-50%);
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
  width: 90%;
  position: relative;
  height: 30px;
`;
const StyledButton = styled(Button)`
  position: relative;
  right: -80%;
  transform: translateX(-50%);
  background-color: #8b572a;
  color: #fff;

  &:hover {
    background-color: #b3733b;
  }
`;

const SettingActionBtn = styled(StyledButton)`
  bottom: 30px;
`;

const ScheduleDetails = () => {
  const { getScheduleInfo, getScheduleDetails, updateScheduleContents } =
    useSchedulesDB();
  const { updateUserDoc } = useUsersDB();
  const { hashKey, setProtectorsData } = useProtectorsDB();
  const {
    scheduleInfo,
    locationNotes,
    isActive,
    toggleActiveState,
    gearChecklist,
    otherItemChecklist,
    setScheduleState,
  } = useScheduleState();
  const { setUserState, activeScheduleId, listsConfirmedStatus } =
    useUserState();
  const { scheduleId } = useParams();
  const [tripsEditable, setTripsEditable] = useState(false);
  const [isFutureTrip, setIsFutureTrip] = useState(false);

  useEffect(() => {
    const fetchScheduleData = async () => {
      const info = await getScheduleInfo(scheduleId);
      const details = await getScheduleDetails(scheduleId);
      setScheduleState('scheduleInfo', info);
      setScheduleState('scheduleDetails', details);
    };
    fetchScheduleData();
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
      await updateScheduleContents(scheduleId, 'locationNotes', locationNotes);
    }
  };

  const handleSaveCheckList = async () => {
    await updateScheduleContents(
      scheduleId,
      'checklist',
      gearChecklist,
      otherItemChecklist
    );
    const gearItem = gearChecklist.find((item) => !item.isChecked);
    const otherItem = otherItemChecklist.find((item) => !item.isChecked);
    const isAllItemsChecked = !gearItem && !otherItem;
    if (isAllItemsChecked) {
      const updatedConfirmedStatus = listsConfirmedStatus.map((list) => {
        if (list.id === scheduleId) {
          return { ...list, isConfirmed: true };
        } else {
          return list;
        }
      });
      await updateScheduleContents(scheduleId, 'isChecklistConfirmed', true);
      setUserState('listsConfirmedStatus', updatedConfirmedStatus);
    } else {
      const updatedConfirmedStatus = listsConfirmedStatus.map((list) => {
        if (list.id === scheduleId) {
          return { ...list, isConfirmed: false };
        } else {
          return list;
        }
      });
      await updateScheduleContents(scheduleId, 'isChecklistConfirmed', false);
      setUserState('listsConfirmedStatus', updatedConfirmedStatus);
    }
    Toast.fire({
      text: '完成清單更新',
      icon: 'success',
    });
  };

  const handleToggleProtectorFunc = async (isActive) => {
    toggleActiveState();
    if (!isActive) {
      await updateUserDoc('activeSchedule', '');
      await updateUserDoc('hashedPassword', '');
      setUserState('activeScheduleId', '');
      return;
    }
    await updateUserDoc('activeSchedule', scheduleId);
    await setProtectorsData(scheduleId);
    const encryptedId = sha256(scheduleId);
    const hashedPassword = sha256.hmac(encryptedId, hashKey);
    await updateUserDoc('hashedPassword', hashedPassword);
    setUserState('activeScheduleId', scheduleId);
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
                開始編輯
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
        <ProtectorSetting salt={scheduleId} />
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
