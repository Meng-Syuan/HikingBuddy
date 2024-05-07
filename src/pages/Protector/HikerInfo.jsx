import styled from 'styled-components';
import color, { inputFocusStyle } from '@theme';
import { useProtectorPageData } from '@utils/zustand';
import { useState, useEffect } from 'react';
import useUploadFile from '@utils/hooks/useUploadFile';
import useProtectorsDB from '@utils/hooks/useProtectorsDB';

const HikerInfoContainer = styled.section`
  flex: 0 1 360px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
  background-color: ${color.lightBackgroundColor};
`;

const PhotoWrapper = styled.div`
  width: 240px;
  height: 230px;
  position: relative;
`;

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
    ${(props) => (props.readOnly ? '' : inputFocusStyle)}
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
    ${(props) => (props.readOnly ? '' : inputFocusStyle)}
  }
  background-color: ${(props) =>
    props.readOnly ? color.lightBackgroundColor : '#fff'};
`;

const SaveEditionBtn = styled.button`
  position: relative;
  left: 30%;
`;

const default_photo = `https://react.semantic-ui.com/images/wireframe/image.png`;

const HikerInfo = ({ isEditable, id, valid }) => {
  const { getUploadFileUrl } = useUploadFile();
  const { updateProtectorDoc } = useProtectorsDB();
  const { hikerInfo, hikerPhoto, updateHikerInfo, setProtectorPageData } =
    useProtectorPageData();

  const previewURL = hikerPhoto || default_photo;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const url = await getUploadFileUrl('hiker_photo', file, id);
    setProtectorPageData('hikerPhoto', url); //renew global state
    await updateProtectorDoc(id, 'hiker_photo', url); //renew protectorsDB
  };
  const handleUploadHikerInfo = async () => {
    const newHikerInfo = { ...hikerInfo, hiker_photo: hikerPhoto };
    console.log(newHikerInfo);
    await updateProtectorDoc(id, '', newHikerInfo);
    alert('資訊更新完成');
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
              onChange={(e) => updateHikerInfo('clothe_color', e.target.value)}
            ></StyledInput>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="backpack_color">背包</Label>
            <StyledInput
              value={hikerInfo.backpack_color}
              readOnly={!isEditable}
              onChange={(e) =>
                updateHikerInfo('backpack_color', e.target.value)
              }
            ></StyledInput>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="shuttle_driver">接駁者</Label>
            <StyledInput
              value={hikerInfo.shuttle_driver}
              readOnly={!isEditable}
              onChange={(e) =>
                updateHikerInfo('shuttle_driver', e.target.value)
              }
            ></StyledInput>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="message">留言</Label>
            <MessageInput
              placeholder="下山時間及聯絡時間"
              value={hikerInfo.message}
              readOnly={!isEditable}
              onChange={(e) => updateHikerInfo('message', e.target.value)}
            ></MessageInput>
          </InputWrapper>
        </InfoWrapper>
        {isEditable && (
          <SaveEditionBtn onClick={handleUploadHikerInfo}>
            上傳資訊
          </SaveEditionBtn>
        )}
      </HikerInfoContainer>
    )
  );
};

export default HikerInfo;
