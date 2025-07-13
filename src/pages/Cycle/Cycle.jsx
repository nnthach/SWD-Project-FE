import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cycle.module.scss';

function Cycle() {
  const navigate = useNavigate();

  const [method, setMethod] = useState('regular');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periodDays, setPeriodDays] = useState('5');
  const [cycleLength, setCycleLength] = useState('28');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lưu vào localStorage để dùng tạm cho CycleDetail
    const data = {
      method,
      startDate,
      endDate,
      periodDays,
      cycleLength,
    };

    localStorage.setItem('menstrualInput', JSON.stringify(data));

    // Điều hướng sang trang chi tiết
    navigate('/cycle-detail');
  };

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles['form-container']}>
        <div className={styles['header']}>Theo dõi chu kỳ kinh nguyệt</div>

        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Chọn phương pháp tính toán <span className={styles.required}>*</span>
            </label>
            <div className={styles['form-description']}>
              Lựa chọn phương pháp tính toán phù hợp với bạn
            </div>
            <div className={styles['option-group']}>
              <div
                className={`${styles['option-card']} ${
                  method === 'regular' ? styles.selected : ''
                }`}
                onClick={() => setMethod('regular')}
              >
                <div className={styles['option-icon']}>📅</div>
                <div className={styles['option-text']}>Chu kì đều đặn</div>
              </div>
              <div
                className={`${styles['option-card']} ${
                  method === 'irregular' ? styles.selected : ''
                }`}
                onClick={() => setMethod('irregular')}
              >
                <div className={styles['option-icon']}>🩸</div>
                <div className={styles['option-text']}>Chu kì không đều</div>
              </div>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Ngày bắt đầu chu kỳ gần nhất <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles['form-input']}
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Ngày kết thúc chu kỳ gần nhất <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles['form-input']}
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Số ngày hành kinh <span className={styles.required}>*</span>
            </label>
            <div className={styles['select-wrapper']}>
              <select
                className={styles['form-select']}
                value={periodDays}
                onChange={(e) => setPeriodDays(e.target.value)}
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                  <option key={d} value={d}>
                    {d} ngày
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Chu kỳ kinh nguyệt trung bình <span className={styles.required}>*</span>
            </label>
            <div className={styles['select-wrapper']}>
              <select
                className={styles['form-select']}
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
              >
                {[26, 27, 28, 29, 30, 31, 32].map((c) => (
                  <option key={c} value={c}>
                    {c} ngày
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className={styles['submit-btn']}>
            Tính chỉ số ngày
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cycle;
