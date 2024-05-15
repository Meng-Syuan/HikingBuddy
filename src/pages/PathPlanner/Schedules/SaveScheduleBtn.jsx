import styled from 'styled-components';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import useUsersDB from '@utils/hooks/useUsersDB';
import { useScheduleArrangement, useUserState } from '@utils/zustand';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tippy';
import sweetAlert, { Toast } from '@utils/sweetAlert';

const StyledBtn = styled(FontAwesomeIcon)`
  font-size: 2rem;
  color: #6e6e6e;
  &:hover {
    color: #0161bb;
    cursor: pointer;
  }
`;
const SaveScheduleBtn = ({ setSave }) => {
  const { futureSchedules, setUserState } = useUserState();
  const {
    temporaryScheduleId,
    tripName,
    scheduleBlocks,
    gpxFileName,
    resetScheduleArrangement,
  } = useScheduleArrangement();
  const { addUserInfo } = useUsersDB();
  const { saveScheduleDetails } = useSchedulesDB();
  const navigate = useNavigate();

  const handleSaveClick = async () => {
    const isFinished = checkReqirement();
    if (!isFinished) {
      Toast.fire({
        position: 'bottom-end',
        title: '填寫未完成',
        text: '請檢查路線名稱、日期與時間是否填寫完畢。',
        icon: 'error',
        width: '420px',
        padding: '1rem 2rem',
      });
    } else {
      const { value: confirm } = await sweetAlert.confirm(
        `儲存行程表 ${tripName} ？`,
        '請再次確認地點、日期及時間',
        'question',
        '確認',
        '取消'
      );
      if (!confirm) return;
      setSave(true); //stop listener for modification
      await saveScheduleDetails(
        temporaryScheduleId,
        tripName,
        gpxFileName,
        scheduleBlocks
      );
      await addUserInfo('schedulesIDs', temporaryScheduleId);

      const newSchedule = getNewScheduleInfo();
      const newFutureSchedules = [...futureSchedules, newSchedule];
      newFutureSchedules.sort((a, b) => a.lastDay - b.lastDay);
      setUserState('futureSchedules', newFutureSchedules);

      resetScheduleArrangement();
      setSave(false);
      await Toast.fire({
        position: 'center',
        title: '儲存成功',
        text: '導向個人頁面查看行程😎',
        icon: 'success',
        timer: 1000,
      });
      navigate('/profile');
    }
  };

  const getNewScheduleInfo = () => {
    const dates = Object.keys(scheduleBlocks).filter(
      (key) => key !== 'notArrangedBlock'
    );
    const firstDay = Math.min(...dates);
    const lastDay = Math.max(...dates);
    return {
      id: temporaryScheduleId,
      tripName,
      firstDay,
      lastDay,
      isChecklistConfirmed: false,
    };
  };

  const checkReqirement = () => {
    const isFinished = scheduleBlocks.notArrangedBlock.items.length === 0;
    return isFinished && tripName;
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
