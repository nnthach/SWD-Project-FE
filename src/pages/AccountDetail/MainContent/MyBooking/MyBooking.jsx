import api from '~/config/axios';
import styles from './MyBooking.module.scss';
import { useEffect, useState } from 'react';
import ModalBooking from '~/pages/AccountDetail/MainContent/MyBooking/ModalBooking/ModalBooking';

function MyBooking() {
  const [bookingListData, setBookingListData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [bookingDetailData, setBookingDetailData] = useState(null);

  const handleFetchMyBooking = async () => {
    try {
      const res = await api.get(`/Booking/my-bookings`);
      console.log('get  booking detail res', res);
      setBookingListData(res.data);
    } catch (error) {
      console.log('get  booking detail err', error);
    }
  };

  const handleOpenBookingDetail = async (id) => {
    try {
      const res = await api.get(`/Booking/my-bookings/${id}`);
      console.log('get  booking detail res', res);
      setBookingDetailData(res.data);
      setOpenPopup(true);
    } catch (error) {
      console.log('get  booking detail err', error);
    }
  };

  useEffect(() => {
    handleFetchMyBooking();
  }, []);
  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.bookingListWrap}>
          {bookingListData.map((booking) => (
            <div key={booking.bookingId} className={styles.bookingCard}>
              <span
                className={`${styles.bookingStatus} ${
                  booking.status === 'CANCEL' ? styles.cancel : booking.status === 'COMPLETE' ? styles.complete : ''
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
              </span>

              <div className={styles.bookingInfo}>
                <p>
                  <strong>Booking ID:</strong> {booking.bookingId}
                </p>
                <p>
                  <strong>Booking Date:</strong> {booking.bookingDate}
                </p>
                <p>
                  <strong>Service Count:</strong> {booking.serviceCount}
                </p>
                <p>
                  <strong>Total Price:</strong> {booking.totalPrice}
                </p>
              </div>

              <button
                onClick={() => {
                  handleOpenBookingDetail(booking.bookingId);
                }}
                className={styles.viewBtn}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {openPopup && <ModalBooking bookingDetailData={bookingDetailData} setOpenPopup={setOpenPopup} />}
    </>
  );
}

export default MyBooking;
