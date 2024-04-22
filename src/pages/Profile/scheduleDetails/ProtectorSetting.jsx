import styled from 'styled-components';
import color, { textBorder } from '@utils/theme';
import { useScheduleData } from '@utils/zustand';
import { useEffect, useState } from 'react';
import { SharedListTitle } from './index';
import { TripInfoWrapper } from './TripInfo';

const ProtectorInfoText = styled.input``;

const SettingWrapper = styled.div`
  display: flex;
`;
const ProtectorQuiz = styled.span``;
const SettingContainer = styled(TripInfoWrapper)``;
const ProtectorSetting = () => {
  return (
    <SettingContainer>
      <SharedListTitle>設定留守人</SharedListTitle>
      <ProtectorInfoText></ProtectorInfoText>
    </SettingContainer>
  );
};

export default ProtectorSetting;
