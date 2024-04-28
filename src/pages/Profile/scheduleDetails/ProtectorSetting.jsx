import styled from 'styled-components';
import { sha256 } from 'js-sha256';
import color, { fieldWrapper } from '@utils/theme';
import { useScheduleState } from '@utils/zustand';
import { SharedListTitle } from './index';

const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;
const SettingContainer = styled.div`
  ${fieldWrapper}
  min-height: 150px;
`;
const ProtectorWrapper = styled.div`
  width: 70%;
  border: 1px solid ${color.borderColor};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const UrlWrapper = styled.div`
  border: 1px solid blue;
  display: flex;
`;

const ProtectorUrlContent = styled.span`
  font-size: 0.75rem;
`;

const CopyBtn = styled.button``;

const Note = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const ProtectorSetting = ({ salt }) => {
  const { isActive } = useScheduleState();
  const encryptedId = sha256(salt);
  const hashedUrl = `https://hikingbuddy-4abda.firebaseapp.com/protector/${encryptedId}`;

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(hashedUrl);
      alert('successfully');
    } catch (error) {
      alert('bad bad bad');
    }
  };
  return (
    <SettingContainer>
      <TitleWrapper>
        <SharedListTitle>留守人功能</SharedListTitle>
        <Note>提醒：啟用才能編輯留守人頁面。</Note>
      </TitleWrapper>

      {isActive && (
        <ProtectorWrapper>
          <UrlWrapper>
            <ProtectorUrlContent>{`https://hikingbuddy-4abda.firebaseapp.com/protector/${encryptedId}`}</ProtectorUrlContent>
            <CopyBtn onClick={handleCopyURL}>複製</CopyBtn>
          </UrlWrapper>
          <Note>
            功能啟動後，僅持有上述網址的人可透過上述網址看到您的行程資訊
          </Note>
        </ProtectorWrapper>
      )}
    </SettingContainer>
  );
};

export default ProtectorSetting;
