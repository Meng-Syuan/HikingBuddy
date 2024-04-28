import styled from 'styled-components';
import color, { textBorder } from '@utils/theme';
import { useScheduleState } from '@utils/zustand';

const ItemWrapper = styled.div`
  padding: 5px;
  ${textBorder}
  justify-content: space-between;
`;

const CheckBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 10px;
  border: 1px solid ${color.borderColor};
  background-color: ${(props) =>
    props.ischecked === 'true' ? color.secondary : color.lightBackgroundColor};
`;

const ItemName = styled.span`
  width: 200px;
`;

const DeleteBtn = styled.button``;
const ListItem = ({ isChecked, id, type }) => {
  const { gearChecklist, otherItemChecklist, setScheduleState } =
    useScheduleState();

  const handleToggleCheckBox = (id) => {
    if (type === 'gearChecklist') {
      const updatedCheckList = gearChecklist.map((item) => {
        if (id === item.id) {
          return { id, isChecked: !item.isChecked };
        } else {
          return item;
        }
      });
      setScheduleState('gearChecklist', updatedCheckList);
    } else {
      const updatedCheckList = otherItemChecklist.map((item) => {
        if (id === item.id) {
          return { id, isChecked: !item.isChecked };
        } else {
          return item;
        }
      });
      setScheduleState('otherItemChecklist', updatedCheckList);
    }
  };

  const handleDeleteItem = (id) => {
    if (type === 'gearChecklist') {
      const remainingChecklist = gearChecklist.filter((item) => id !== item.id);
      setScheduleState('gearChecklist', remainingChecklist);
    } else {
      const remainingChecklist = otherItemChecklist.filter(
        (item) => id !== item.id
      );
      setScheduleState('otherItemChecklist', remainingChecklist);
    }
  };
  return (
    <ItemWrapper>
      <CheckBox
        ischecked={isChecked.toString()}
        onClick={() => handleToggleCheckBox(id)}
      ></CheckBox>
      <ItemName>{id}</ItemName>
      <DeleteBtn onClick={() => handleDeleteItem(id)}>刪除</DeleteBtn>
    </ItemWrapper>
  );
};

export default ListItem;
