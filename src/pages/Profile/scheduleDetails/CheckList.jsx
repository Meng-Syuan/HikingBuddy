import styled from 'styled-components';
import { lightFormat, format } from 'date-fns';
import color, { fieldWrapper } from '@utils/theme';
import { useScheduleState } from '@utils/zustand';
import { useEffect, useState } from 'react';
import { SharedListTitle } from './index';
import ListItem from './ListItem';

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
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  flex: 1;
  border: none;
  outline: none;
  text-align: center;
`;
const AddIBtn = styled.button`
  margin: 0.5rem;
`;
//#endregion

const CheckList = () => {
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
              ></ListItem>
            ))}
          <AddItemField>
            <ItemInput
              value={newGearItemInput}
              onChange={(e) => setNewGearItemInput(e.target.value)}
            ></ItemInput>
            <AddIBtn onClick={() => handleAddNewItem('gearChecklist')}>
              新增
            </AddIBtn>
          </AddItemField>
        </ListWrapper>
        <ListWrapper>
          {otherItemChecklist.length &&
            otherItemChecklist.map((item) => (
              <ListItem
                id={item.id}
                isChecked={item.isChecked}
                type="otherItemChecklist"
              ></ListItem>
            ))}
          <AddItemField>
            <ItemInput
              value={newOtherItemInput}
              onChange={(e) => setNewOtherItemInput(e.target.value)}
            ></ItemInput>
            <AddIBtn onClick={() => handleAddNewItem('otherItemChecklist')}>
              新增
            </AddIBtn>
          </AddItemField>
        </ListWrapper>
      </ListsContainer>
    </ChecklistsWrapper>
  );
};

export default CheckList;
