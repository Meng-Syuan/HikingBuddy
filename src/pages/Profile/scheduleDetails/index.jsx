import styled from 'styled-components';
import color from '@utils/theme';
import { useEffect, useState } from 'react';
import { sha256 } from 'js-sha256';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import useProtectorsDB from '@utils/hooks/useProtectorsDB';
import { useScheduleState, useUserState } from '@utils/zustand';
import { useParams } from 'react-router-dom';

import TripInfo from './TripInfo';
import ProtectorSetting from './ProtectorSetting';
import CheckList from './CheckList';

export const SharedListTitle = styled.h3`
  padding: 1.25rem 0.875rem 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${color.textColor};
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
`;

const ButtonWrapper = styled.div`
  width: 90%;
  position: relative;
  height: 30px;
`;
const StyledButton = styled.button`
  position: absolute;
  right: 20%;
`;
const ToggleEditButton = styled(StyledButton)``;

const SaveChecklistEditionBtn = styled(StyledButton)``;

const SetActiveBtn = styled.button`
  position: absolute;
  right: 10%;
  top: -2.5rem;
`;

const ScheduleDetails = () => {
  const { getScheduleInfo, getScheduleDetails, updateScheduleContents } =
    useSchedulesDB();
  const { updateActiveSchedule, updateHashedPassword } = useUsersDB();
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
  const { setUserState, activeScheduleId } = useUserState();
  const { scheduleId } = useParams();
  const [tripsEditable, setTripsEditable] = useState(false);

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
  };

  const handleToggleProtectorFunc = async (isActive) => {
    toggleActiveState();
    if (!isActive) {
      await updateActiveSchedule('');
      await updateHashedPassword('');
      setUserState('activeScheduleId', '');
    } else {
      await updateActiveSchedule(scheduleId);
      await setProtectorsData(scheduleId);
      const encryptedId = sha256(scheduleId);
      const hashedPassword = sha256.hmac(encryptedId, hashKey);
      await updateHashedPassword(hashedPassword);
      setUserState('activeScheduleId', scheduleId);
    }
  };
  return (
    <ArticlesContainer>
      <ArticleWrapper>
        <TripInfo isEditable={tripsEditable} />
        <ButtonWrapper>
          {tripsEditable ? (
            <ToggleEditButton onClick={handleTripsEdition}>
              儲存變更
            </ToggleEditButton>
          ) : (
            <ToggleEditButton onClick={handleTripsEdition}>
              開始編輯
            </ToggleEditButton>
          )}
        </ButtonWrapper>
      </ArticleWrapper>

      <StyledSplitLine></StyledSplitLine>

      <ArticleWrapper>
        <CheckList />
        <ButtonWrapper>
          <SaveChecklistEditionBtn onClick={handleSaveCheckList}>
            儲存清單變更
          </SaveChecklistEditionBtn>
        </ButtonWrapper>
      </ArticleWrapper>

      <StyledSplitLine />
      <ArticleWrapper>
        <ProtectorSetting salt={scheduleId} />
        <ButtonWrapper>
          {isActive ? (
            <SetActiveBtn onClick={() => handleToggleProtectorFunc(false)}>
              暫停
            </SetActiveBtn>
          ) : (
            <SetActiveBtn onClick={() => handleToggleProtectorFunc(true)}>
              啟用
            </SetActiveBtn>
          )}
        </ButtonWrapper>
      </ArticleWrapper>
    </ArticlesContainer>
  );
};

export default ScheduleDetails;
