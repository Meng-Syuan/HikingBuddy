import styled from 'styled-components';
import color, { fieldWrapper } from '@/theme';
import { sha256 } from 'js-sha256';
import { SharedListTitle } from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import { Tooltip } from 'react-tippy';
import help from '/src/assets/svg/question.svg';
import { Link } from 'react-router-dom';

//utils
import { Toast } from '@/utils/sweetAlert';
import { useScheduleState } from '@/zustand';

const SettingContainer = styled.div`
  ${fieldWrapper}
  height: 180px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const Help = styled.img`
  width: 1.25rem;
`;

const ProtectorWrapper = styled.div`
  width: 85%;
  border: 1px solid ${color.borderColor};
  padding: 0.5rem 1rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UrlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProtectorUrlContent = styled.span`
  font-size: 0.7rem;
`;

const StyledIcon = styled(IconButton)`
  .copy {
    font-size: 1.5rem;
  }
`;

const Note = styled.p`
  font-size: 0.875rem;
  line-height: 1.5rem;
  strong {
    font-weight: 500;
    color: #000;
  }
`;

const TipWrapper = styled.div`
  text-align: start;
  padding: 0.5rem;
`;
//#endregion

const ToolTipContent = () => (
  <TipWrapper>
    <Note>1. 留守人功能可隨時啟動 / 暫停</Note>
    <Note>2. 僅會啟用一個行程表的留守人功能</Note>
    <Note>
      3. 啟用後可點擊左側 <strong>親愛的留守人</strong> 進行編輯
    </Note>
  </TipWrapper>
);

const ProtectorSetting = ({ salt, scheduleId }) => {
  const { isActive } = useScheduleState();
  const encryptedId = sha256(salt);
  const hashedUrl = `https://hikingbuddy-4abda.firebaseapp.com/protector/${encryptedId}`;

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(hashedUrl);
      Toast.fire({
        title: '複製成功 🎉🎉🎉',
        text: '請將網址交給留守人',
        position: 'center',
        icon: 'success',
        timer: 1500,
      });
    } catch (error) {
      alert('bad bad bad');
    }
  };
  return (
    <SettingContainer>
      <TitleWrapper>
        {isActive ? (
          <Link to={`/protector/${scheduleId}`}>
            <SharedListTitle>親愛的留守人</SharedListTitle>
          </Link>
        ) : (
          <SharedListTitle>親愛的留守人</SharedListTitle>
        )}

        <Tooltip
          theme="light"
          size="small"
          offset={10}
          arrow
          position="right"
          html={<ToolTipContent />}
        >
          <Help src={help} />
        </Tooltip>
      </TitleWrapper>

      {isActive && (
        <ProtectorWrapper>
          <UrlWrapper>
            <ProtectorUrlContent>{`https://hikingbuddy-4abda.firebaseapp.com/protector/${encryptedId}`}</ProtectorUrlContent>
            <Tooltip
              title="複製左側網址"
              arrow={true}
              position="right"
              size="small"
              theme="light"
            >
              <StyledIcon onClick={handleCopyURL}>
                <FontAwesomeIcon icon={faCopy} className="copy" />
              </StyledIcon>
            </Tooltip>
          </UrlWrapper>
          <Note>
            功能已啟動，僅持有上述網址的人可透過上述網址看到您的行程資訊
          </Note>
        </ProtectorWrapper>
      )}
    </SettingContainer>
  );
};

export default ProtectorSetting;
