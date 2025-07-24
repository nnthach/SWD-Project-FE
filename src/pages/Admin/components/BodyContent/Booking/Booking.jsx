import api from '~/config/axios';
import styles from './Booking.module.scss';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Pagination from '~/components/Pagination/Pagination';
import ModalBooking from '~/pages/Admin/components/BodyContent/Booking/ModalBooking/ModalBooking';

function Booking() {
  // eslint-disable-next-line no-unused-vars
  const [bookingListData, setBookingListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [status, setStatus] = useState('PENDING');
  const [bookingDetailData, setBookingDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const handleOpenBookingDetail = async (id) => {
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/Booking/my-bookings/${id}`);
      console.log('get booking detail res', res.data);
      setBookingDetailData(res.data);
      setIsDetailLoading(false);
      setOpenPopup(true);
    } catch (error) {
      console.log('get  booking detail err', error);
      toast.error(error.response.data);
      setIsDetailLoading(false);
    }
  };

  const handleFetchAllBooking = async () => {
    try {
      const res = await api.get(`/Booking/admin-by-status?status=${status}`);
      console.log('get all booking res', res);
      setBookingListData(res.data.$values);
    } catch (error) {
      console.log('get all booking err', error);
      toast.error('get all booking err');
    }
  };

  useEffect(() => {
    if (openPopup) return;
    handleFetchAllBooking();
  }, [status, openPopup]);

  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = bookingListData.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <div className={styles.wrap}>
        <h1>Booking</h1>

        {/*Total number of user box */}
        <div className={styles['header-content']}>
          <div className={styles['header-content-box']}>
            <p>Total Bookings are {status == 'PENDING' ? 'Pending' : status == 'COMPLETE' ? 'Complete' : 'Deleted'}</p>
            <p>{bookingListData?.length}</p>
          </div>
        </div>

        {/*Filter/Search */}
        <div className={styles['filter-actions-wrap']}>
          <div className={styles['filter-wrap']}>
            <div
              className={`${styles['filter-box']} ${status === 'PENDING' ? styles.active : ''}`}
              onClick={() => setStatus('PENDING')}
            >
              <p>Pending</p>
            </div>
            <div
              className={`${styles['filter-box']} ${status === 'COMPLETE' ? styles.active : ''}`}
              onClick={() => setStatus('COMPLETE')}
            >
              <p>Complete</p>
            </div>
            <div
              className={`${styles['filter-box']} ${status === 'DELETED' ? styles.active : ''}`}
              onClick={() => setStatus('DELETED')}
            >
              <p>Delete</p>
            </div>
          </div>
        </div>

        {/*Table */}
        <div className={styles['content-table']}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Note</th>
                <th style={{ width: '15%' }}>Service Count</th>
                <th style={{ width: '10%' }}>Total Price</th>
                <th style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentProduct.length == 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '12px' }}>
                    No booking
                  </td>
                </tr>
              ) : (
                currentProduct.map((item) => (
                  <tr key={item.bookingId}>
                    <td>{item.bookingId}</td>
                    <td>
                      {new Date(item.bookingDate).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </td>
                    <td>
                      <span
                        className={`${styles.bookingStatus} ${
                          item?.status === 'DELETED'
                            ? styles.cancel
                            : item?.status === 'COMPLETE'
                            ? styles.complete
                            : ''
                        }`}
                      >
                        {item?.status}
                      </span>
                    </td>
                    <td>{item.note}</td>
                    <td>{item.serviceCount}</td>
                    <td>{item.totalPrice}</td>
                    <td>
                      <FaEye
                        style={{ cursor: 'pointer', color: '#0e82fd', fontSize: 20 }}
                        onClick={() => {
                          console.log('item detail', item);
                          handleOpenBookingDetail(item.bookingId);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={bookingListData.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*Popup */}
      {openPopup && (
        <ModalBooking
          isDetailLoading={isDetailLoading}
          bookingDetailData={bookingDetailData}
          setOpenPopup={setOpenPopup}
          setBookingDetailData={setBookingDetailData}
        />
      )}
    </>
  );
}

export default Booking;
