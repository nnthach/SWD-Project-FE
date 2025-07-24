import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cycle.module.scss';
import api from '~/config/axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Cycle() {
  const navigate = useNavigate();

  const [method, setMethod] = useState('regular');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periodDays, setPeriodDays] = useState('5');
  const [shortestCycleLength, setShortestCycleLength] = useState('26');
  const [longestCycleLength, setLongestCycleLength] = useState('32');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Cookies.get('accessToken')) {
      toast.error("Please log in to use this feature");
      navigate('/login');
      return;
    }

    if (!startDate || !periodDays || (method === 'regular' && !endDate)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const body = {
        cycleType: method,
        regularCycle:
          method === 'regular'
            ? {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                periodLength: parseInt(periodDays),
              }
            : null,
        irregularCycle:
          method === 'irregular'
            ? {
                startDate: new Date(startDate),
                periodLength: parseInt(periodDays),
                shortestCycleLength: parseInt(shortestCycleLength),
                longestCycleLength: parseInt(longestCycleLength),
              }
            : null,
      };

      const res = await api.post('/menstrualcycle/create', body);
      toast.success(res.data.message || 'Cycle created successfully!');
      navigate('/cycle-detail');
    } catch (err) {
      console.error('❌ Failed to create cycle:', err.response?.data || err);
      toast.error("Unable to create cycle. Please check your input.");
    }
  };

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles['form-container']}>
        <div className={styles['header']}>Track Your Menstrual Cycle</div>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Choose calculation method <span className={styles.required}>*</span>
            </label>
            <div className={styles['option-group']}>
              <div
                className={`${styles['option-card']} ${method === 'regular' ? styles.selected : ''}`}
                onClick={() => setMethod('regular')}
              >
                <div className={styles['option-icon']}>📅</div>
                <div className={styles['option-text']}>Regular Cycle</div>
              </div>
              <div
                className={`${styles['option-card']} ${method === 'irregular' ? styles.selected : ''}`}
                onClick={() => setMethod('irregular')}
              >
                <div className={styles['option-icon']}>🩸</div>
                <div className={styles['option-text']}>Irregular Cycle</div>
              </div>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Start date of your last cycle <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles['form-input']}
              required
            />
          </div>

          {method === 'regular' && (
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>
                End date of your cycle <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={styles['form-input']}
                required
              />
            </div>
          )}

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Number of menstruation days <span className={styles.required}>*</span>
            </label>
            <div className={styles['select-wrapper']}>
              <select
                className={styles['form-select']}
                value={periodDays}
                onChange={(e) => setPeriodDays(e.target.value)}
              >
                {[3, 4, 5, 6, 7, 8, 9].map((d) => (
                  <option key={d} value={d}>
                    {d} days
                  </option>
                ))}
              </select>
            </div>
          </div>

          {method === 'irregular' && (
            <>
              <div className={styles['form-group']}>
                <label className={styles['form-label']}>
                  Shortest cycle length (days) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={shortestCycleLength}
                  onChange={(e) => setShortestCycleLength(e.target.value)}
                  className={styles['form-input']}
                  min={20}
                />
              </div>

              <div className={styles['form-group']}>
                <label className={styles['form-label']}>
                  Longest cycle length (days) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={longestCycleLength}
                  onChange={(e) => setLongestCycleLength(e.target.value)}
                  className={styles['form-input']}
                  min={shortestCycleLength}
                />
              </div>
            </>
          )}

          <button type="submit" className={styles['submit-btn']}>
            Calculate
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cycle;
