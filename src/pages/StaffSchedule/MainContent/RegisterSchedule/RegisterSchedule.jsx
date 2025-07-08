/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import styles from './RegisterSchedule.module.scss';
import { AuthContext } from '~/context/AuthContext';
import { toast } from 'react-toastify';

function RegisterSchedule() {
  const { userInfo } = useContext(AuthContext);
  const [registerScheduleForm, setRegisterScheduleForm] = useState({
    consultantId: userInfo?.userId,
    workingDate: '', // vd 20/07/2025
    startTime: '',
    endTime: '',
  });

  return (
    <div className={styles.wrap}>
      <form>
        <div>
          <label>Working date</label>
          <input type="date" />
        </div>
        <div>
          <label>Slot</label>
          <select>
            <option>1: 07:00 - 15:00</option>
            <option>2: 13:00 - 21:00</option>
          </select>
        </div>
      </form>
    </div>
  );
}

export default RegisterSchedule;
