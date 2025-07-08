import Header from '~/components/Layout/components/Header/Header';
import styles from './StaffSchedule.module.scss';
import Footer from '~/components/Layout/components/Footer/Footer';
import RegisterSchedule from '~/pages/StaffSchedule/MainContent/RegisterSchedule/RegisterSchedule';
import { FaUser } from 'react-icons/fa';
import { useState } from 'react';
import ViewSchedule from '~/pages/StaffSchedule/MainContent/ViewSchedule/ViewSchedule';

function StaffSchedule() {
  const [menu, setMenu] = useState('register');

  const renderContent = () => {
    switch (menu) {
      case 'register':
        return <RegisterSchedule />;
      case 'schedule':
        return <ViewSchedule />;
    }
  };
  return (
    <div>
      <div className={styles.wrap}>
        <div className={styles.container}>
          <div className={styles['user-aside']}>
            <div className={styles['user-avatar']}>
              <FaUser fontSize={30} />
            </div>

            <div className={styles['aside-menu']}>
              <p onClick={() => setMenu('register')} className={menu == 'register' && styles.active}>
                Register Schedule
              </p>
              <p onClick={() => setMenu('schedule')} className={menu == 'schedule' && styles.active}>
                Schedule
              </p>
            </div>
          </div>

          <div className={styles['main-content']}>
            <h5>{menu == 'register' ? 'Register Schedule' : 'Schedule'}</h5>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffSchedule;
