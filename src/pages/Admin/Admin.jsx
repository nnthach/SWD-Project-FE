import styles from './Admin.module.scss';
import { useState } from 'react';
import Header from '~/components/Layout/components/Header/Header';
import AdminHeader from '~/pages/Admin/components/AdminHeader/AdminHeader';
import BodyContent from '~/pages/Admin/components/BodyContent/BodyContent';

function Admin() {
  const [contentRender, setContentRender] = useState('dashboard');
  return (
    <>
      <AdminHeader />
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <ul>
            <li onClick={() => setContentRender('dashboard')}>Dashboard</li>
            <li onClick={() => setContentRender('user')}>User</li>
            <li onClick={() => setContentRender('service')}>Service</li>
            <li onClick={() => setContentRender('booking')}>Booking</li>
            <li onClick={() => setContentRender('appointment')}>Appointment</li>
            <li onClick={() => setContentRender('staffschedule')}>Staff Schedule</li>
            <li onClick={() => setContentRender('staffconsultant')}>Staff Consultant</li>
          </ul>
        </div>
        <div className={styles.content}>
          <BodyContent contentRender={contentRender} />
        </div>
      </div>
    </>
  );
}

export default Admin;
