import { useParams } from 'react-router-dom';
import useSchedulesDB from '@utils/hooks/useSchedulesDB';
import { useAuth } from '@clerk/clerk-react';
import { sha256 } from 'js-sha256';
import { useState, useEffect, useRef } from 'react';

const ProtectorConnection = () => {
  const { userId } = useAuth();
  const { getActiveScheduleId } = useSchedulesDB();
  const scheduleIdRef = useRef('');
  const encryptedScheduleId = useRef('');
  const encryptedVertification = useRef('');
  const [passwordInput, setPasswordInput] = useState('');
  const param = useParams();

  useEffect(() => {
    const getScheduleId = async () => {
      const scheduleId = await getActiveScheduleId();
      scheduleIdRef.current = scheduleId;
    };
    getScheduleId();
  }, []);

  useEffect(() => {
    const encryptedId = sha256(scheduleIdRef.current);
    encryptedScheduleId.current = encryptedId;
  }, [scheduleIdRef]);

  //   useEffect(() => {}, []);
  useEffect(() => {
    const passWordHash = sha256.hmac(
      passwordInput,
      encryptedScheduleId.current
    );
    // console.log('passWordHash');
    // console.log(passWordHash);
    encryptedVertification.current = passWordHash;
  }, [passwordInput]);

  //   useEffect(() => {
  //     console.log('encryptedScheduleId:');
  //     console.log(encryptedScheduleId);
  //   }, [scheduleIdRef]);

  const handlePasswordInput = (e) => {
    setPasswordInput(e.target.value);
  };
  const handleSubmit = () => {
    console.log(param.encryptedScheduleId);
    setPasswordInput('');
    //找 firestore 裡的 protector DB（在行程表展開畫面啟用後寫入資料到 protector DB 中）
  };

  return (
    <div>
      <input
        type="password"
        value={passwordInput}
        onChange={handlePasswordInput}
        required
      />
      <button type="button" onClick={handleSubmit}>
        送出
      </button>
    </div>
  );
};

export default ProtectorConnection;
