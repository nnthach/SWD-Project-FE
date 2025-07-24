/* eslint-disable no-unused-vars */
import styles from './ModalAppointment.module.scss';
import { useEffect, useState } from 'react';
import { getAppointmentDetailAPI } from '~/services/appointmentService';

function ModalAppointment({ setOpenPopup, appointmentDetailIdData, setAppointmentDetailIdData }) {
  const [appointmentDetailData, setAppointmentDetailData] = useState(null);

  const handleGetAppointmentDetail = async () => {
    try {
      const res = await getAppointmentDetailAPI(appointmentDetailIdData);
      console.log('appointment detail res', res);
      setAppointmentDetailData(res.data);
    } catch (error) {
      console.log('get appointment detail err', error);
    }
  };

  useEffect(() => {
    handleGetAppointmentDetail();
  }, []);

  return (
    <div className={styles['popup-wrap']}>
      <div className={styles.overlay} />
      <p
        className={styles['close-btn']}
        onClick={() => {
          setAppointmentDetailIdData('');
          setOpenPopup(false);
        }}
      >
        &times;
      </p>

      <div className={styles.content}>
        {/*Top */}
        <div className={styles.topContent}>
          <h2>Appointment</h2>
          <div className={styles['appointment-info']}>
            <p>
              <strong>ID:</strong> {appointmentDetailData?.appointmentId}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(appointmentDetailData?.appointmentDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p>
              <strong>Meeting Url:</strong>{' '}
              <a href={appointmentDetailData?.meetingUrl} target="_blank">
                {appointmentDetailData?.meetingUrl}
              </a>
            </p>
            <p>
              <strong>Status:</strong> <span className={styles.status}>{appointmentDetailData?.status}</span>
            </p>
          </div>
        </div>
        {/*Bottom */}
        <div className={styles.bottomContent}>
          <div className={styles.bottomLeft}>
            <h2>Consultant</h2>
            <div className={styles['appointment-info']}>
              <p>
                <strong>ID:</strong> {appointmentDetailData?.consultantId}
              </p>
              <p>
                <strong>Email:</strong> {appointmentDetailData?.consultant.email}
              </p>
              <p>
                <strong>Username:</strong> {appointmentDetailData?.consultant.username}
              </p>
              <p>
                <strong>Phone:</strong> {appointmentDetailData?.consultant.phoneNumber}
              </p>
            </div>
          </div>
          <div className={styles.bottomRight}>
            <h2>Customer</h2>
            <div className={styles['appointment-info']}>
              <p>
                <strong>ID:</strong> {appointmentDetailData?.userId}
              </p>
              <p>
                <strong>Email:</strong> {appointmentDetailData?.user.email}
              </p>
              <p>
                <strong>Username:</strong> {appointmentDetailData?.user.username}
              </p>
              <p>
                <strong>Phone:</strong> {appointmentDetailData?.user.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAppointment;
