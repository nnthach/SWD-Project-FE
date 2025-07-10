/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import styles from './ViewSchedule.module.scss';
import { AuthContext } from '~/context/AuthContext';
import { toast } from 'react-toastify';
import { createStaffScheduleAPI, getStaffAllScheduleAndQueryAPI } from '~/services/staffScheduleService';

function ViewSchedule() {
  const { userInfo, userId } = useContext(AuthContext);
  const [staffSchedule, setStaffSchedule] = useState([]);
  const [threeWeekDays, setThreeWeekDays] = useState([]);

  const normalizeDate = (isoString) => isoString.split('T')[0]; //chuyen timestamp về dạng "yyyy-mm-dd"

  const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const generateThreeWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sun) → 6 (Sat)

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - currentDay - 6); // Lùi về Thứ 2 tuần trước

    const fullDays = [];

    for (let i = 0; i < 21; i++) {
      const date = new Date(lastMonday);
      date.setDate(lastMonday.getDate() + i);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      fullDays.push({
        displayDate: `${dd}/${mm}/${yyyy}`,
        weekday: WEEKDAY_LABELS[date.getDay()],
        dateStr,
      });
    }

    return fullDays;
  };

  const getStaffSchedule = async () => {
    const days = generateThreeWeekDays();
    const fromDateISO = `${days[0].dateStr}T00:00:00Z`;
    const toDateISO = `${days[days.length - 1].dateStr}T23:59:59Z`;

    const query = {
      staffId: 'A5560692-1F1F-49B3-60FF-08DDBDEDD484',
      fromDate: fromDateISO,
      toDate: toDateISO,
      ticks: 0,
    };

    const queryString = new URLSearchParams(query).toString();

    try {
      const res = await getStaffAllScheduleAndQueryAPI(queryString);
      setStaffSchedule(res.data);
      setThreeWeekDays(days); // cập nhật danh sách 21 ngày
    } catch (error) {
      console.log('get staff schedule err', error);
    }
  };

  useEffect(() => {
    getStaffSchedule();
  }, []);

  return (
    <div className={styles.wrap}>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginTop: 30 }}>
        <thead>
          <tr>
            <th style={{ padding: 5 }}>Date</th>
            <th style={{ padding: 5 }}>Day</th>
            <th style={{ padding: 5 }}>Working Slot</th>
          </tr>
        </thead>
        <tbody>
          {threeWeekDays.map((day, index) => {
            const schedule = staffSchedule.find((s) => normalizeDate(s.workingDate) === day.dateStr);

            return (
              <tr key={index}>
                <td style={{ padding: 5 }}>{day.displayDate}</td>
                <td style={{ padding: 5 }}>{day.weekday}</td>
                <td style={{ padding: 5 }}>
                  {schedule ? `${schedule.startTime} - ${schedule.endTime} (${schedule.status})` : 'Off'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ViewSchedule;
