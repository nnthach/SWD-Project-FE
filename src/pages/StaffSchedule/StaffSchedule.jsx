import Header from '~/components/Layout/components/Header/Header';
import styles from './StaffSchedule.module.scss';
import Footer from '~/components/Layout/components/Footer/Footer';
import RegisterSchedule from '~/pages/StaffSchedule/MainContent/RegisterSchedule/RegisterSchedule';
import { FaUser } from 'react-icons/fa';

function StaffSchedule() {
  return (
    <div>
      <Header />
      <div className={styles.wrap}>
        <div className={styles.container}>
          <div className={styles['user-aside']}>
            <div className={styles['user-avatar']}>
              <FaUser fontSize={30} />
            </div>

            <div className={styles['aside-menu']}>
              <p>Register Schedule</p>
              <p>Schedule</p>
            </div>
          </div>

          <div className={styles['main-content']}>
            <h5>Register Schedule</h5>

            <RegisterSchedule />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StaffSchedule;
