import styled from 'styled-components';
import color from '@/theme';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import wireframe from '/src/assets/img/wireframe.png';
import { useState } from 'react';

//utils
import { useProtectorPageData } from '@/zustand';
import uploadFile from '@/utils/uploadFile';
import { Toast, showErrorToast } from '@/utils/sweetAlert';
import setFirestoreDoc from '@/firestore/setFirestoreDoc';

const HikerInfoContainer = styled.section`
  flex: 0 1 360px;
  padding: 40px 45px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
  background-color: ${color.lightBackgroundColor};
`;

const PhotoWrapper = styled.div``;

const HikerPhoto = styled.figure`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 240px;
  height: 230px;
  object-fit: contain;
`;

const Tip = styled.span`
  position: absolute;
  font-size: 0.75rem;
  top: 50%;
  z-index: 1;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 28px;
`;

const Label = styled.label`
  font-size: 0.875rem;
`;
const StyledInput = styled.input`
  width: 200px;
  height: 25px;
  border: 1px solid ${color.borderColor};
  border-radius: 5px;
  padding: 5px;
  &:focus {
    outline: ${(props) =>
      props.readOnly ? 'none' : `2px solid ${color.secondary}`};
  }
  background-color: ${(props) =>
    props.readOnly ? color.lightBackgroundColor : '#fff'};
`;

const MessageInput = styled.textarea`
  width: 200px;
  height: 150px;
  resize: none;
  border: 1px solid ${color.borderColor};
  border-radius: 5px;
  padding: 5px;
  &:focus {
    outline: ${(props) =>
      props.readOnly ? 'none' : `2px solid ${color.secondary}`};
  }
  background-color: ${(props) =>
    props.readOnly ? color.lightBackgroundColor : '#fff'};
`;

const SaveEditionBtn = styled(Button)`
  align-self: flex-end;
  font-family: 'Noto Sans TC';
  font-weight: 350;
  border: 1px solid ${color.secondary};
  color: ${color.secondary};
  &:hover {
    border-color: #8b572a66;
    background-color: rgba(200, 200, 200, 0.1);
  }
`;

const Note = styled.span`
  align-self: flex-end;
  font-weight: 350;
  font-size: 0.8125rem;
  line-height: 1.75;
  letter-spacing: 0.08rem;
  padding: 3px 9px;
  border-radius: 4px;
  color: ${color.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    cursor: default;
  }
`;
const StyledWritingIcon = styled(BorderColorIcon)`
  width: 1.2rem;
  height: 1.2rem;
  color: ${color.secondary};
`;

const HikerInfo = ({ isEditable, id, valid }) => {
  const [sendable, setSendable] = useState(false);
  const { getUploadFileUrl } = uploadFile();
  const { hikerInfo, hikerPhoto, updateHikerInfo, setProtectorPageData } =
    useProtectorPageData();

  const previewURL = hikerPhoto || wireframe;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const url = await getUploadFileUrl('hiker_photo', file, id);
    setProtectorPageData('hikerPhoto', url); //renew global state
    try {
      const firestoreItem = { hiker_photo: url };
      await setFirestoreDoc('protectors', id, firestoreItem);
    } catch (error) {
      await showErrorToast('發生錯誤', error.message);
    }
  };

  const handleTextChange = (e, type) => {
    updateHikerInfo(type, e.target.value);
    setSendable(true);
  };

  const handleUploadHikerInfo = async () => {
    try {
      await setFirestoreDoc('protectors', id, hikerInfo);
      setSendable(false);
      Toast.fire({
        position: 'bottom-end',
        timer: 1000,
        title: '資料上傳完成',
        icon: 'success',
      });
    } catch (error) {
      await showErrorToast('上傳資料發生錯誤', error.message);
    }
  };

  return (
    valid && (
      <HikerInfoContainer>
        <input
          style={{ display: 'none' }}
          id="hikerPhoto"
          accept="image/png,image/jpeg"
          type="file"
          onChange={(e) => handleImageUpload(e)}
        />
        <PhotoWrapper>
          {!isEditable && (
            <HikerPhoto>
              <Image src={previewURL} alt="hiker_photo" />
            </HikerPhoto>
          )}
          {isEditable && (
            <HikerPhoto as="label" htmlFor="hikerPhoto">
              <Image src={previewURL} alt="hiker photo" />
              {!hikerPhoto && <Tip>請選擇當日照片含臉部及衣服照並上傳</Tip>}
            </HikerPhoto>
          )}
        </PhotoWrapper>

        <InfoWrapper>
          <InputWrapper>
            <Label htmlFor="clothe_color">衣服</Label>
            <StyledInput
              value={hikerInfo.clothe_color}
              readOnly={!isEditable}
              onChange={(e) => handleTextChange(e, 'clothe_color')}
            ></StyledInput>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="backpack_color">背包</Label>
            <StyledInput
              value={hikerInfo.backpack_color}
              readOnly={!isEditable}
              onChange={(e) => handleTextChange(e, 'backpack_color')}
            ></StyledInput>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="shuttle_driver">接駁者</Label>
            <StyledInput
              value={hikerInfo.shuttle_driver}
              readOnly={!isEditable}
              onChange={(e) => handleTextChange(e, 'shuttle_driver')}
            ></StyledInput>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="message">留言</Label>
            <MessageInput
              placeholder="下山時間及聯絡時間"
              value={hikerInfo.message}
              readOnly={!isEditable}
              onChange={(e) => handleTextChange(e, 'message')}
              autoFocus
            ></MessageInput>
          </InputWrapper>
        </InfoWrapper>
        {isEditable && sendable ? (
          <SaveEditionBtn
            onClick={handleUploadHikerInfo}
            variant="outlined"
            size="small"
            endIcon={<SendIcon />}
          >
            上傳資訊
          </SaveEditionBtn>
        ) : isEditable ? (
          <Note variant="outlined" size="small">
            編輯資訊
            <StyledWritingIcon size="small" />
          </Note>
        ) : (
          ''
        )}
      </HikerInfoContainer>
    )
  );
};

export default HikerInfo;
