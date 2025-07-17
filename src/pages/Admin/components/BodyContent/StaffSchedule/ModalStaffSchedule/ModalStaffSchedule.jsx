/* eslint-disable no-unused-vars */
import { deleteStaffScheduleAPI, getStaffScheduleDetailAPI } from '~/services/staffScheduleService';
import styles from './ModalStaffSchedule.module.scss';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ModalStaffSchedule({ setOpenPopup, scheduleDetailIdData, setScheduleDetailIdData }) {
  const [scheduleDetailData, setScheduleDetailData] = useState(null);

  const handleGetScheduleDetail = async () => {
    try {
      const res = await getStaffScheduleDetailAPI(scheduleDetailIdData.scheduleId, scheduleDetailIdData.staffId);
      console.log('staff schedule detail res', res);
      setScheduleDetailData(res.data);
    } catch (error) {
      console.log('get schedule detail err', error);
    }
  };

  const handleDeleteStaffSchedule = async () => {
    try {
      const res = await deleteStaffScheduleAPI(scheduleDetailIdData.scheduleId, scheduleDetailIdData.staffId);
      console.log('delete staff schedule res', res);
      toast.success('Delete staff schedule successful');
    } catch (error) {
      console.log('delete schedule err', error);
    }
  };

  useEffect(() => {
    handleGetScheduleDetail();
  }, []);

  return (
    <div className={styles['popup-wrap']}>
      <div className={styles.overlay} />
      <p
        className={styles['close-btn']}
        onClick={() => {
          setScheduleDetailIdData({
            scheduleId: '',
            staffId: '',
          });
          setOpenPopup(false);
        }}
      >
        &times;
      </p>

      <div className={styles.content}>
        <div className={styles.left}>
          <h2>Schedule</h2>
          <p>
            <strong>ID:</strong> {scheduleDetailData?.staffScheduleId}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(scheduleDetailData?.workingDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p>
            <strong>Time:</strong> {scheduleDetailData?.startTime} - {scheduleDetailData?.endTime}
          </p>
          <p>
            <strong>Status:</strong> {scheduleDetailData?.status}
          </p>
        </div>
        <div className={styles.right}>
          <h2>Staff</h2>
          <p>
            <strong>ID:</strong> {scheduleDetailData?.consultantId}
          </p>
          <p>
            <strong>Email:</strong> {scheduleDetailData?.consultant.email}
          </p>
          <p>
            <strong>Username:</strong> {scheduleDetailData?.consultant.username}
          </p>
          <p>
            <strong>Phone:</strong> {scheduleDetailData?.consultant.phoneNumber}
          </p>
        </div>

        <div className={styles.buttonWrap}>
          <button onClick={() => handleDeleteStaffSchedule()}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ModalStaffSchedule;
