import styled, { keyframes } from 'styled-components';
import color, { fieldWrapper, screen } from '@/theme';
import { SharedListTitle } from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import help from '/src/assets/svg/question.svg';
import { useState } from 'react';
import { Tooltip } from 'react-tippy';

//components
import ListItem from './ListItem';

//utils
import { useScheduleState } from '@/zustand';

//#region
const ChecklistsWrapper = styled.div`
  ${fieldWrapper}
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const Help = styled.img`
  width: 1.25rem;
`;

const ListsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 400px;
  padding: 0 2rem;
  width: 100%;
  ${screen.lg} {
    justify-content: center;
    gap: 2rem;
  }
  ${screen.sm} {
    flex-direction: column;
    padding: 0 1rem;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ListName = styled.h5`
  display: none;
  ${screen.sm} {
    display: block;
    font-size: 1.25rem;
    color: ${color.textColor};
    font-weight: 500;
    text-indent: 2rem;
  }
`;

const AddItemField = styled.div`
  margin-top: 1.25rem;
  height: 60px;
  border: 1px dashed ${color.borderColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;
const ItemInput = styled.input`
  width: 240px;
  border: none;
  outline: none;
  text-align: center;
  &::placeholder {
    font-size: 0.875rem;
  }
  ${screen.lg} {
    width: 160px;
  }
  ${screen.sm} {
    width: 50vw;
  }
`;

const StyledButton = styled(IconButton)`
  &:hover {
    color: ${color.secondary};
  }
`;

const TipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const Tip = styled.p`
  font-size: 0.875rem;
`;
const TipExample = styled.div`
  width: 90px;
  display: flex;
  align-items: center;
  gap: 5px;
`;
const checkboxAnimation = keyframes`
  0% {
    background: ${color.lightBackgroundColor};
  }
  100% {
    background: ${color.secondary};
  }

`;
const TipCheckBox = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid ${color.borderColor};
  animation: ${checkboxAnimation} 0.5s ease-in 0.5s forwards;
`;
const TipItem = styled.div`
  border: 1px solid ${color.borderColor};
  border-radius: 20px;
  height: 12px;
  width: 100%;
`;
//#endregion

const ToolTipContent = () => (
  <TipWrapper>
    <Tip>點選確認準備狀態</Tip>
    <TipExample>
      <TipCheckBox />
      <TipItem></TipItem>
    </TipExample>
  </TipWrapper>
);

const CheckList = ({ isFuture }) => {
  const { gearChecklist, otherItemChecklist, addNewItemToChecklist } =
    useScheduleState();
  const [newGearItemInput, setNewGearItemInput] = useState('');
  const [newOtherItemInput, setNewOtherItemInput] = useState('');

  const handleAddNewItem = (type) => {
    if (type === 'gearChecklist' && newGearItemInput.length !== 0) {
      addNewItemToChecklist(type, newGearItemInput);
      setNewGearItemInput('');
    } else if (newOtherItemInput.length !== 0) {
      addNewItemToChecklist(type, newOtherItemInput);
      setNewOtherItemInput('');
    }
  };
  return (
    <ChecklistsWrapper>
      <TitleWrapper>
        <SharedListTitle>裝備清單</SharedListTitle>
        <Tooltip
          className="checkList"
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
      <ListsContainer>
        <ListWrapper>
          <ListName>裝備清單</ListName>
          {gearChecklist.length > 0 &&
            gearChecklist.map((item) => (
              <ListItem
                key={item.id}
                id={item.id}
                isChecked={item.isChecked}
                type="gearChecklist"
                isFuture={isFuture}
              ></ListItem>
            ))}
          {isFuture && (
            <AddItemField>
              <ItemInput
                value={newGearItemInput}
                onChange={(e) => setNewGearItemInput(e.target.value)}
                placeholder="新增自訂裝備"
              ></ItemInput>
              <StyledButton onClick={() => handleAddNewItem('gearChecklist')}>
                <FontAwesomeIcon icon={faFileCirclePlus} size="sm" />
              </StyledButton>
            </AddItemField>
          )}
        </ListWrapper>
        <ListWrapper>
          <ListName>用物清單</ListName>
          {otherItemChecklist.length &&
            otherItemChecklist.map((item) => (
              <ListItem
                key={item.id}
                id={item.id}
                isChecked={item.isChecked}
                type="otherItemChecklist"
                isFuture={isFuture}
              ></ListItem>
            ))}
          {isFuture && (
            <AddItemField>
              <ItemInput
                value={newOtherItemInput}
                onChange={(e) => setNewOtherItemInput(e.target.value)}
                placeholder="新增自訂用品"
              ></ItemInput>
              <StyledButton
                onClick={() => handleAddNewItem('otherItemChecklist')}
              >
                <FontAwesomeIcon icon={faFileCirclePlus} size="sm" />
              </StyledButton>
            </AddItemField>
          )}
        </ListWrapper>
      </ListsContainer>
    </ChecklistsWrapper>
  );
};

export default CheckList;
