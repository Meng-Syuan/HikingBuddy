import styled from 'styled-components';
import { lightFormat } from 'date-fns';
import color from '@utils/theme';
import { useEffect, useState } from 'react';
import { sha256 } from 'js-sha256';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import { useScheduleData } from '@utils/zustand';
import { useParams } from 'react-router-dom';

import TripInfo from './TripInfo';
import ProtectorSetting from './ProtectorSetting';

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
  /* border: 2px solid #000; */
  height: 30px;
`;
const ToggleEditButton = styled.button`
  position: absolute;
  right: 40%;
`;
const SetActiveBtn = styled.button`
  position: absolute;
  right: 10%;
`;

const ToggleProtectorButton = styled(ToggleEditButton)``;
const ScheduleDetails = () => {
  const { getScheduleInfo, getScheduleDetails, addNotesToSchedule } =
    useSchedulesDB();
  const {
    scheduleInfo,
    scheduleDetails,
    locationNotes,
    isProtectorActive,
    toggleIsProtectorActive,
  } = useScheduleData();
  const scheduleId = useParams().scheduleId;
  const [tripsEditable, setTripsEditable] = useState(false);
  const [proptectorEditable, setProptectorEditable] = useState(false);

  useEffect(() => {
    console.log('scheduleId:');
    console.log(scheduleId, '---');
    getScheduleInfo(scheduleId);
    getScheduleDetails(scheduleId);
  }, []);

  // useEffect(() => {
  //   if (!scheduleInfo) return;
  //   console.log('-----scheduleInfo------');
  //   console.log(scheduleInfo);
  // }, [scheduleInfo]);
  // useEffect(() => {
  //   if (!scheduleDetails) return;
  //   console.log('-----scheduleDetails-------');
  //   console.log(scheduleDetails);
  // }, [scheduleDetails]);

  useEffect(() => {
    console.log('isProtectorActive');
    console.log(isProtectorActive);
  }, [isProtectorActive]);

  const handleTripsEdition = async () => {
    setTripsEditable((prevState) => !prevState);
    if (Object.keys(locationNotes).length > 0) {
      await addNotesToSchedule(scheduleId, locationNotes);
    }
  };

  const handleProtectorEdition = async () => {
    setProptectorEditable((prevState) => !prevState);
  };
  const handleToggleProtectorFunc = () => {
    toggleIsProtectorActive();
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
      <ArticleWrapper>裝備清單</ArticleWrapper>
      <StyledSplitLine />
      <ArticleWrapper>
        <ProtectorSetting isActive={isProtectorActive} />
        <ButtonWrapper>
          {proptectorEditable ? (
            <ToggleProtectorButton onClick={handleProtectorEdition}>
              設定密碼
            </ToggleProtectorButton>
          ) : (
            <ToggleProtectorButton onClick={handleProtectorEdition}>
              儲存變更
            </ToggleProtectorButton>
          )}
          {isProtectorActive ? (
            <SetActiveBtn onClick={handleToggleProtectorFunc}>
              啟用留守人功能
            </SetActiveBtn>
          ) : (
            <SetActiveBtn onClick={handleToggleProtectorFunc}>
              暫停留守人功能
            </SetActiveBtn>
          )}
        </ButtonWrapper>
      </ArticleWrapper>
    </ArticlesContainer>
  );
};

export default ScheduleDetails;
