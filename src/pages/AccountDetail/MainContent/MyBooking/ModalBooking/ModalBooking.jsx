/* eslint-disable no-unused-vars */
import api from '~/config/axios';
import styles from './ModalBooking.module.scss';
import { toast } from 'react-toastify';

function ModalBooking({ bookingDetailData, setOpenPopup }) {
  const handleUpdateBooking = async (status) => {
    try {
      const res = await api.put(`/Booking/${status}/${bookingDetailData.bookingId}`);
      console.log('update booking res', res);
      toast.success('Update booking successful');
      setOpenPopup(false);
    } catch (error) {
      console.log('update booking err', error);
    }
  };
  return (
    <div className={styles['popup-wrap']}>
      <div className={styles.overlay} />
      <p
        className={styles['close-btn']}
        onClick={() => {
          setOpenPopup(false);
        }}
      >
        &times;
      </p>

      <div className={styles.content}>
        {/*Top */}
        <div className={styles.topContent}>
          <h2>
            Booking Detail
            <span
              className={`${styles['booking-status']} ${
                bookingDetailData.status === 'DELETED'
                  ? styles.cancel
                  : bookingDetailData.status === 'COMPLETE'
                  ? styles.complete
                  : ''
              }`}
            >
              {bookingDetailData.status}
            </span>
          </h2>
          <p>
            <strong>ID:</strong> {bookingDetailData?.bookingId}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(bookingDetailData.bookingDate).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </p>
          <p>
            <strong>Note:</strong>
            {bookingDetailData.note}
          </p>
          <p>
            <strong>Total Price:</strong> {bookingDetailData?.totalPrice}
          </p>
        </div>
        {/*Bottom */}
        <div className={styles.bottomContent}>
          {bookingDetailData.services?.$values.map((service, index) => (
            <div key={index} className={styles.serviceBox}>
              <h2>Service</h2>
              <p>
                <strong>ID:</strong> {service.serviceId}
              </p>
              <p>
                <strong>Service Name:</strong> {service.serviceName}
              </p>
              <p>
                <strong>Price:</strong> {service.price}
              </p>
              <p>
                <strong>Description:</strong> {service.description}
              </p>
            </div>
          ))}
        </div>

        {/*Test result */}
        {bookingDetailData.status != 'PENDING' && (
          <div className={styles['result-content']}>
            <h2>Test Result</h2>

            {bookingDetailData?.testBookingServices?.$values[0]?.testResults?.$values[0]?.resultDetail ? (
              <div className={styles['test-result-img-wrap']}>
                <img src={bookingDetailData.testBookingServices.$values[0].testResults.$values[0].resultDetail} />
              </div>
            ) : (
              <div>
                <p>No result updated</p>
              </div>
            )}
          </div>
        )}

        {bookingDetailData.status == 'PENDING' && (
          <div className={styles['btn-wrap']}>
            <button onClick={() => handleUpdateBooking('cancel')}>Cancel</button>
            {/* <button onClick={() => handleUpdateBooking('complete')}>Complete</button> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalBooking;
