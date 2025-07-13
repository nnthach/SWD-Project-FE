import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './CycleDetail.module.scss';

function CycleDetail() {
  const [phases, setPhases] = useState([]);
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        const response = await axios.get('http://localhost:7100/api/menstrualcycle/latest');
        setPhases(response.data.phases);
        setStartDate(response.data.startDate);
      } catch (err) {
        console.error('Failed to fetch cycle data', err);
      }
    };
    fetchCycleData();
  }, []);

  const getPhaseType = (date) => {
    const phase = phases.find((p) => p.date === date);
    return phase?.type || '';
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'Menstruation':
        return <div className={`${styles['day-icon']} ${styles['icon-period']}`}></div>;
      case 'Fertile':
        return <div className={`${styles['day-icon']} ${styles['icon-safe-relative']}`}></div>;
      case 'Ovulation':
        return <div className={`${styles['day-icon']} ${styles['icon-ovulation']}`}></div>;
      default:
        return null;
    }
  };

  const generateCalendar = () => {
    if (!startDate || isNaN(new Date(startDate))) {
      return <div style={{ padding: '20px', color: 'red' }}>Dữ liệu ngày không hợp lệ</div>;
    }

    const start = new Date(startDate);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const type = getPhaseType(dateStr);
      days.push(
        <div key={i} className={`${styles['day-cell']} ${styles[type.toLowerCase()] || ''}`}>
          <div className={styles['day-number']}>{date.getDate()}</div>
          {renderIcon(type)}
        </div>
      );
    }
    return days;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Kết quả của bạn</div>

      <div className={styles['calendar-container']}>
        <div className={styles['calendar-header']}>
          <button className={styles['nav-btn']}>‹</button>
          <div className={styles['month-title']}>Chu kỳ bắt đầu: {startDate}</div>
          <button className={styles['nav-btn']}>›</button>
        </div>

        <div className={styles.calendar}>
          <div className={styles['calendar-grid']}>
            <div className={styles['day-header']}>CN</div>
            <div className={styles['day-header']}>T2</div>
            <div className={styles['day-header']}>T3</div>
            <div className={styles['day-header']}>T4</div>
            <div className={styles['day-header']}>T5</div>
            <div className={styles['day-header']}>T6</div>
            <div className={styles['day-header']}>T7</div>
            {generateCalendar()}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-period']}`}></div>
          <div>
            <div className={styles['legend-title-text']}>Ngày có kinh nguyệt</div>
            <div className={styles['legend-description']}>Đây là ngày bạn đang hành kinh</div>
          </div>
        </div>

        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-ovulation']}`}></div>
          <div>
            <div className={styles['legend-title-text']}>Ngày trứng rụng</div>
            <div className={styles['legend-description']}>Khả năng thụ thai cao nhất</div>
          </div>
        </div>

        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-safe-relative']}`}></div>
          <div>
            <div className={styles['legend-title-text']}>Ngày an toàn tương đối</div>
            <div className={styles['legend-description']}>Khả năng thụ thai thấp</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CycleDetail;
