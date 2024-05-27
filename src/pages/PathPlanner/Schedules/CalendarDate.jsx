import styled from 'styled-components';
import color, { screen } from '@/theme';
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import { MandarinTraditional } from 'flatpickr/dist/l10n/zh-tw';
import { eachDayOfInterval } from 'date-fns';
import { useScheduleArrangement } from '@/zustand';

//for custom style
const StyledInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${screen.md} {
    justify-content: center;
    gap: 1rem;
  }
  .flatpickr-input {
    width: 220px;
    padding: 5px 10px;
    border: 1px solid ${color.borderColor};
    border-radius: 5px;
    outline: none;
    background-color: ${color.lightBackgroundColor};
  }
`;

const CalendarDate = ({ selectDates }) => {
  const { dateValue, setScheduleArrangement } = useScheduleArrangement();
  const handleDateChange = (selectedDates, dateStr) => {
    const startingDate = selectedDates[0];
    const endingDate = selectedDates?.[1];
    const dateSelection = eachDayOfInterval({
      start: startingDate,
      end: endingDate,
    });
    const dateSelectionGetTime = dateSelection.map((date) => date.getTime());
    selectDates(dateSelectionGetTime);
    setScheduleArrangement('dateValue', dateStr);
  };
  const flatpickrCalendarOptions = {
    minDate: 'today',
    mode: 'range',
    dateFormat: 'Y-m-d',
    locale: MandarinTraditional,
    wrap: true,
    onChange: handleDateChange,
  };

  return (
    <>
      <StyledInputWrapper>
        <label>行程日期</label>
        <Flatpickr options={flatpickrCalendarOptions}>
          <input
            type="text"
            data-input
            placeholder="選擇起訖日期"
            value={dateValue}
            readOnly
          />
        </Flatpickr>
      </StyledInputWrapper>
    </>
  );
};

export default CalendarDate;
