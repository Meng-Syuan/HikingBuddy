import styled from 'styled-components';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import { useScheduleArrangement, useUserState } from '@utils/zustand';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tippy';
import { Toast } from '@utils/sweetAlert';

const StyledBtn = styled(FontAwesomeIcon)`
  font-size: 2rem;
  color: #6e6e6e;
  &:hover {
    color: #0161bb;
    cursor: pointer;
  }
`;
const SaveScheduleBtn = () => {
  const { futureSchedules, setUserState } = useUserState();
  const {
    temporaryScheduleId,
    tripName,
    itineraries_dates,
    itineraries_datetime,
    setScheduleArrangement,
    gpxFileName,
  } = useScheduleArrangement();
  const { useSaveScheduleToUsersDB } = useUsersDB();
  const { saveScheduleDetails } = useSchedulesDB();
  const navigate = useNavigate();

  const handleSaveClick = async () => {
    const result = checkReqirement();
    if (!result) {
      Toast.fire({
        position: 'bottom-end',
        title: '填寫未完成',
        text: '請檢查路線名稱、日期與時間是否填寫完畢。',
        icon: 'error',
        width: '420px',
        padding: '1rem 2rem',
      });
    } else {
      await saveScheduleDetails(
        temporaryScheduleId,
        itineraries_dates,
        itineraries_datetime,
        tripName,
        gpxFileName
      );
      await useSaveScheduleToUsersDB(temporaryScheduleId);

      const newSchedule = getNewScheduleInfo();
      const newFutureSchedules = [...futureSchedules, newSchedule];
      newFutureSchedules.sort((a, b) => a.lastDay - b.lastDay);
      setUserState('futureSchedules', newFutureSchedules);

      setScheduleArrangement('tripName', '');
      setScheduleArrangement('itineraries_dates', []);
      setScheduleArrangement('itineraries_datetime', []);
      setScheduleArrangement('temporaryScheduleId', null);
      setScheduleArrangement('gpxPoints', null);
      setScheduleArrangement('gpxFileName', '');
      setScheduleArrangement('mapMarkers', []);
      Toast.fire({
        position: 'center',
        title: '儲存成功',
        text: '導向個人頁面查看行程😎',
        icon: 'success',
      });
      navigate('/profile');
    }
  };

  const getNewScheduleInfo = () => {
    const dates = itineraries_dates.map((itinerary) => itinerary.date);
    const firstDay = Math.min(...dates);
    const lastDay = Math.max(...dates);
    return {
      id: temporaryScheduleId,
      firstDay,
      lastDay,
      isChecklistComfirmed: false,
    };
  };

  const checkReqirement = () => {
    const isDatesNotCompleted = itineraries_dates.find(
      (itinerary) => isNaN(itinerary.date) || !itinerary.date
    );
    const isDatetimeNotCompelte = itineraries_datetime.find(
      (itinerary) => isNaN(itinerary.datetime) || !itinerary.datetime
    );
    if (!isDatesNotCompleted && !isDatetimeNotCompelte && tripName) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Tooltip
      title="儲存行程"
      arrow={true}
      position="right"
      size="small"
      theme="light"
    >
      <StyledBtn icon={faFloppyDisk} onClick={handleSaveClick} />
    </Tooltip>
  );
};

export default SaveScheduleBtn;
