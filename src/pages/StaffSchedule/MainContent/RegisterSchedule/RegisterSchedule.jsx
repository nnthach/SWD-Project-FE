/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import styles from './RegisterSchedule.module.scss';
import { AuthContext } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import {
  createStaffScheduleAPI,
  deleteStaffScheduleAPI,
  getStaffAllScheduleAndQueryAPI,
} from '~/services/staffScheduleService';

function RegisterSchedule() {
  const { userInfo, userId } = useContext(AuthContext);
  console.log('user info', userInfo);
  const [staffSchedule, setStaffSchedule] = useState([]);

  console.log('staff schedule', staffSchedule);

  const normalizeDate = (isoString) => isoString.split('T')[0]; //chuyen timestamp về dạng "yyyy-mm-dd"

  const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getNextWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) → 6 (Sat)
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + (8 - dayOfWeek)); // + (8 - today) để ra Thứ 2 tuần sau

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(nextMonday);
      date.setDate(nextMonday.getDate() + i);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      week.push({
        displayDate: `${dd}/${mm}/${yyyy}`,
        weekday: WEEKDAY_LABELS[date.getDay()],
        dateStr,
        slot: '',
      });
    }

    return week;
  };

  const [weekForms, setWeekForms] = useState(getNextWeekDays());

  const getStaffSchedule = async () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) → 6 (Sat)

    // Tính Thứ 2 tuần sau
    const mondayNextWeek = new Date(today);
    mondayNextWeek.setDate(today.getDate() + (8 - dayOfWeek)); // Thứ 2

    // Tính Chủ nhật tuần sau
    const sundayNextWeek = new Date(mondayNextWeek);
    sundayNextWeek.setDate(mondayNextWeek.getDate() + 6); // +6 ngày

    const fromDateISO = new Date(`${mondayNextWeek.toISOString().split('T')[0]}T00:00:00Z`).toISOString();
    const toDateISO = new Date(`${sundayNextWeek.toISOString().split('T')[0]}T23:59:59Z`).toISOString();

    const query = {
      staffId: 'A5560692-1F1F-49B3-60FF-08DDBDEDD484',
      fromDate: fromDateISO,
      toDate: toDateISO,
      ticks: 0,
    };
    const queryString = new URLSearchParams(query).toString();

    console.log('query get schedule', queryString);

    try {
      const res = await getStaffAllScheduleAndQueryAPI(queryString);
      console.log('staff schedule res', res.data);
      setStaffSchedule(res.data);
    } catch (error) {
      console.log('get staff schedule err', error);
    }
  };

  useEffect(() => {
    getStaffSchedule();
  }, []);

  const handleSlotChange = (index, value) => {
    const updated = [...weekForms];
    updated[index].slot = value;
    setWeekForms(updated);
  };

  const getSlotTimeRange = (slot) => {
    if (slot === '2') {
      return {
        startTime: '13:00:00',
        endTime: '21:00:00',
      };
    } else if (slot === '1') {
      return {
        startTime: '07:00:00',
        endTime: '15:00:00',
      };
    }
    return { startTime: '', endTime: '' };
  };

  const handleSubmitDay = async (index) => {
    const day = weekForms[index];
    if (!day.slot) {
      alert('Vui lòng chọn ca làm');
      return;
    }

    try {
      const { startTime, endTime } = getSlotTimeRange(day.slot);

      const dataToSubmit = {
        consultantId: userInfo.userId,
        workingDate: new Date(`${day.dateStr}T00:00:00Z`).toISOString(),
        startTime,
        endTime,
      };

      console.log('📦 Gửi lịch ngày:', dataToSubmit);

      const res = await createStaffScheduleAPI(dataToSubmit);
      console.log('create schedule res', res);

      getStaffSchedule();
    } catch (error) {
      console.log('create schedule errr', error);
    }
  };

  const handleDeleteScheduleRegistered = async (staffId, scheduleId) => {
    try {
      const res = await deleteStaffScheduleAPI(scheduleId, staffId);
      console.log('delete registered schedule res', res);
      getStaffSchedule();
    } catch (error) {
      console.log('delete registered schedule error', error);
    }
  };

  return (
    <div className={styles.wrap}>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: 5 }}>Date</th>
            <th style={{ padding: 5 }}>Day</th>
            <th style={{ padding: 5 }}>Working Slot</th>
            <th style={{ padding: 5 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {weekForms.map((day, index) => {
            // Kiểm tra ngày hiện tại có trong lịch đã đăng ký không
            const existingSchedule = staffSchedule.find((s) => normalizeDate(s.workingDate) === day.dateStr);

            return (
              <tr key={index}>
                <td style={{ padding: 5 }}>{day.displayDate}</td>
                <td style={{ padding: 5 }}>{day.weekday}</td>
                <td style={{ padding: 5 }}>
                  {existingSchedule ? (
                    <span>
                      {existingSchedule.startTime} - {existingSchedule.endTime}
                    </span>
                  ) : (
                    // ✅ Chưa đăng ký → hiển thị dropdown chọn ca
                    <select value={day.slot} onChange={(e) => handleSlotChange(index, e.target.value)}>
                      <option value="">Slot</option>
                      <option value="1">1: 07:00 - 15:00</option>
                      <option value="2">2: 13:00 - 21:00</option>
                    </select>
                  )}
                </td>
                <td style={{ padding: 5 }}>
                  {existingSchedule ? (
                    <button
                      onClick={() =>
                        handleDeleteScheduleRegistered(existingSchedule.consultantId, existingSchedule.staffScheduleId)
                      }
                    >
                      Delete
                    </button>
                  ) : (
                    <button onClick={() => handleSubmitDay(index)}>Register</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RegisterSchedule;
