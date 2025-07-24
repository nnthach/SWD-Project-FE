import Footer from '~/components/Layout/components/Footer/Footer';
import Header from '~/components/Layout/components/Header/Header';
import styles from './AccountDetail.module.scss';
import { FaUser } from 'react-icons/fa';
import Information from '~/pages/AccountDetail/MainContent/Information/Information';
import { useState } from 'react';
import MyBooking from '~/pages/AccountDetail/MainContent/MyBooking/MyBooking';
import Appointment from '~/pages/AccountDetail/MainContent/Appointment/Appointment';

function AccountDetail() {
  const [contentRender, setContentRender] = useState('Information');

  const handleRenderContent = () => {
    switch (contentRender) {
      case 'Information':
        return <Information />;
      case 'My Booking':
        return <MyBooking />;
      case 'My Appointments':
        return <Appointment />;
      default:
        return <Information />;
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
              <p
                className={
                  contentRender === 'Information' ? styles.active : ''
                }
                onClick={() => setContentRender('Information')}
              >
                Information
              </p>
              <p
                className={contentRender === 'My Booking' ? styles.active : ''}
                onClick={() => setContentRender('My Booking')}
              >
                My Booking
              </p>
              <p
                className={
                  contentRender === 'My Appointments' ? styles.active : ''
                }
                onClick={() => setContentRender('My Appointments')}
              >
                My Appointments
              </p>
            </div>
          </div>

          <div className={styles['main-content']}>
            <h5>{contentRender}</h5>

            {handleRenderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetail;
