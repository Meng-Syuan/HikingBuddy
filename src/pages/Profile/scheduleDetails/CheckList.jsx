import styled from 'styled-components';
import color, { fieldWrapper } from '@utils/theme';
import { useScheduleState } from '@utils/zustand';
import { useState } from 'react';
import { SharedListTitle } from './index';
import ListItem from './ListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';

//#region
const ChecklistsWrapper = styled.div`
  ${fieldWrapper}
`;

const ListsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 400px;
  padding: 0 2rem;
`;

const ListWrapper = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;
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
`;

const StyledIcon = styled(IconButton)`
  &:hover {
    color: ${color.secondary};
  }
`;

//#endregion

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
      <SharedListTitle>裝備清單</SharedListTitle>
      <ListsContainer>
        <ListWrapper>
          {gearChecklist.length > 0 &&
            gearChecklist.map((item) => (
              <ListItem
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
                placeholder="點擊新增自訂裝備"
              ></ItemInput>
              <StyledIcon onClick={() => handleAddNewItem('gearChecklist')}>
                <FontAwesomeIcon icon={faFileCirclePlus} size="sm" />
              </StyledIcon>
            </AddItemField>
          )}
        </ListWrapper>
        <ListWrapper>
          {otherItemChecklist.length &&
            otherItemChecklist.map((item) => (
              <ListItem
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
                placeholder="點擊新增自訂用品"
              ></ItemInput>
              <StyledIcon
                onClick={() => handleAddNewItem('otherItemChecklist')}
              >
                <FontAwesomeIcon icon={faFileCirclePlus} size="sm" />
              </StyledIcon>
            </AddItemField>
          )}
        </ListWrapper>
      </ListsContainer>
    </ChecklistsWrapper>
  );
};

export default CheckList;
