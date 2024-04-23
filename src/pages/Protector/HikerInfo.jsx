import styled from 'styled-components';
import color, { inputFocusStyle } from '@theme';
import { useProtectorPageData } from '@utils/zustand';
import { useEffect } from 'react';

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
  border: 1px dotted red;
  position: relative;
`;

const HikerPhoto = styled.figure``;

const UploadBtn = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
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
    ${inputFocusStyle}
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
    ${inputFocusStyle}
  }
  background-color: ${(props) =>
    props.readOnly ? color.lightBackgroundColor : '#fff'};
`;

const SaveEditionBtn = styled.button`
  position: relative;
  left: 30%;
`;
const HikerInfo = ({ isEditable }) => {
  const { hikerInfo } = useProtectorPageData();

  useEffect(() => {
    if (!hikerInfo) return;
    console.log(hikerInfo);
  }, [hikerInfo]);

  return (
    <HikerInfoContainer>
      <PhotoWrapper>
        <HikerPhoto>
          <img src={hikerInfo.hiker_photo} alt="hiker_photo" />
        </HikerPhoto>
        {isEditable && <UploadBtn>上傳照片</UploadBtn>}
      </PhotoWrapper>

      <InfoWrapper>
        <InputWrapper>
          <Label htmlFor="clothe_color">衣服</Label>
          <StyledInput
            value={hikerInfo.clothe_color}
            readOnly={!isEditable}
          ></StyledInput>
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="backpack_color">背包</Label>
          <StyledInput
            value={hikerInfo.backpack_color}
            readOnly={!isEditable}
          ></StyledInput>
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="message">留言</Label>
          <MessageInput
            placeholder="下山時間及聯絡時間"
            value={hikerInfo.message}
            readOnly={!isEditable}
          ></MessageInput>
        </InputWrapper>
      </InfoWrapper>
      {isEditable && <SaveEditionBtn>儲存編輯</SaveEditionBtn>}
    </HikerInfoContainer>
  );
};

export default HikerInfo;
