import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import { useState, useEffect } from 'react';
import { MandarinTraditional } from 'flatpickr/dist/l10n/zh-tw.js';
import styled from 'styled-components';

//for custom style
const StyledInputWrapper = styled.div`
  .flatpickr-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }
`;

const CalendarDate = ({ setTripDays }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (selectedDates, dateStr, instance) => {
    setSelectedDates(selectedDates);
    const startingDate = selectedDates[0]?.getTime();
    const endingDate = selectedDates[1]?.getTime();

    if (startingDate && endingDate) {
      const days = (endingDate - startingDate) / (1000 * 60 * 60 * 24) + 1;
      setTripDays(days);
    } else {
      setTripDays(0);
    }
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
        <Flatpickr options={flatpickrCalendarOptions}>
          <input type="text" data-input placeholder="選擇起訖日期" />
        </Flatpickr>
      </StyledInputWrapper>
    </>
  );
};

export default CalendarDate;
