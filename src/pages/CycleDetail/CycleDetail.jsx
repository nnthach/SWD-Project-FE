import { useEffect, useState } from 'react';
import styles from './CycleDetail.module.scss';
import api from '~/config/axios';

function CycleDetail() {
  const [phases, setPhases] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Hàm tiện ích xử lý ngày tháng
  const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  const subMonths = (date, months) => {
    return addMonths(date, -months);
  };

  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const eachDayOfInterval = ({ start, end }) => {
    const days = [];
    let current = new Date(start);
    
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isSameMonth = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatMonthYear = (date) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return `${months[date.getMonth()]} - ${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        const response = await api.get('/menstrualcycle/latest'); 
        console.log("Cycle data response:", response.data); 

        setPhases(response.data.phases || []); 
        if (response.data.startDate) {
          const start = new Date(response.data.startDate);
          setStartDate(response.data.startDate);
          setCurrentMonth(start);
        }
      } catch (err) {
        console.error('Failed to fetch cycle data', err);
      }
    };

    fetchCycleData();
  }, []);

  const getPhaseType = (date) => {
    if (!Array.isArray(phases)) return '';
    const dateStr = formatDate(date);
    const phase = phases.find((p) => p.date === dateStr);
    return phase?.type || '';
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'Menstruation':
        return <div className={`${styles['day-icon']} ${styles['icon-period']}`}>🩸</div>;
      case 'Fertile':
        return <div className={`${styles['day-icon']} ${styles['icon-fertile']}`}>♥</div>;
      case 'HighFertile':
        return <div className={`${styles['day-icon']} ${styles['icon-high-fertile']}`}>♥</div>;
      case 'Ovulation':
        return <div className={`${styles['day-icon']} ${styles['icon-ovulation']}`}>♥</div>;
      case 'Safe':
        return <div className={`${styles['day-icon']} ${styles['icon-safe']}`}>✓</div>;
      case 'AbsoluteSafe':
        return <div className={`${styles['day-icon']} ${styles['icon-absolute-safe']}`}>✓</div>;
      default:
        return null;
    }
  };

  const generateCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
    
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map((day, i) => {
      const type = getPhaseType(day);
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const dayNumber = day.getDate();
      
      // Xử lý ngày đầu tháng
      const isFirstDayOfMonth = dayNumber === 1;
      
      return (
        <div 
          key={i} 
          className={`${styles['day-cell']} 
            ${!isCurrentMonth ? styles['other-month'] : ''} 
            ${styles[type.toLowerCase()] || ''}`}
        >
          <div className={styles['day-number']}>
            {isFirstDayOfMonth ? `1/${day.getMonth() + 1}` : dayNumber}
          </div>
          {isCurrentMonth && renderIcon(type)}
        </div>
      );
    });
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Kết quả của bạn</div>

      <div className={styles['calendar-container']}>
        <div className={styles['calendar-header']}>
          <button className={styles['nav-btn']} onClick={previousMonth}>‹</button>
          <div className={styles['month-title']}>
            {formatMonthYear(currentMonth)}
          </div>
          <button className={styles['nav-btn']} onClick={nextMonth}>›</button>
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
          <div className={`${styles['legend-icon']} ${styles['icon-period']}`}>🩸</div>
          <div>
            <div className={styles['legend-title-text']}>Ngày có kinh nguyệt</div>
            <div className={styles['legend-description']}>Đây là ngày bạn đang hành kinh</div>
          </div>
        </div>

        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-fertile']}`}>♥</div>
          <div>
            <div className={styles['legend-title-text']}>Ngày có khả năng thụ thai</div>
            <div className={styles['legend-description']}>Ngày thứ hai trong giai đoạn có khả năng thụ thai</div>
          </div>
        </div>

        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-high-fertile']}`}>♥</div>
          <div>
            <div className={styles['legend-title-text']}>Ngày có khả năng thụ thai cao</div>
            <div className={styles['legend-description']}>Hai ngày trước khi trứng rụng</div>
          </div>
        </div>

        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-ovulation']}`}>♥</div>
          <div>
            <div className={styles['legend-title-text']}>Ngày trứng rụng</div>
            <div className={styles['legend-description']}>Khả năng thụ thai cao nhất</div>
          </div>
        </div>

        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-safe']}`}>✓</div>
          <div>
            <div className={styles['legend-title-text']}>Ngày an toàn tương đối</div>
            <div className={styles['legend-description']}>Khả năng thụ thai thấp</div>
          </div>
        </div>

        <div className={styles['legend-item']}>
          <div className={`${styles['legend-icon']} ${styles['icon-absolute-safe']}`}>✓</div>
          <div>
            <div className={styles['legend-title-text']}>Ngày an toàn tuyệt đối</div>
            <div className={styles['legend-description']}>Khả năng thụ thai cực thấp</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CycleDetail;