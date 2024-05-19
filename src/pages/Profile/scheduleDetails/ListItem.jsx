import styled from 'styled-components';
import color from '@/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import { useScheduleState } from '@/zustand';

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${({ $isFuture }) => ($isFuture ? 'auto' : '260px')};
`;

const CheckBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid ${color.borderColor};
  background-color: ${({ $isChecked }) =>
    $isChecked ? color.secondary : color.lightBackgroundColor};
`;

const ItemWrapper = styled.div`
  padding: 2px 4px 2px 14px;
  border: 1px solid ${color.borderColor};
  border-radius: 20px;
  background-color: ${({ $isFuture }) =>
    $isFuture ? '#fff' : color.lightBackgroundColor};
  display: flex;
  align-items: center;
  min-height: 35px;
`;

const ItemName = styled.span`
  width: 200px;
  line-height: 1.25rem;
  text-align: ${({ $isFuture }) => ($isFuture ? '' : 'center')};
`;

const StyledIcon = styled(IconButton)`
  &:hover {
    color: ${color.secondary};
  }
`;

const ListItem = ({ isChecked, id, type, isFuture }) => {
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
    <ItemContainer $isFuture={isFuture}>
      {isFuture ? (
        <CheckBox
          $isChecked={isChecked}
          onClick={() => handleToggleCheckBox(id)}
        />
      ) : (
        <CheckBox $isChecked={isChecked} />
      )}
      <ItemWrapper>
        <ItemName $isFuture={isFuture}>{id}</ItemName>
        {isFuture && (
          <StyledIcon onClick={() => handleDeleteItem(id)}>
            <FontAwesomeIcon icon={faX} size="2xs" />
          </StyledIcon>
        )}
      </ItemWrapper>
    </ItemContainer>
  );
};

export default ListItem;
