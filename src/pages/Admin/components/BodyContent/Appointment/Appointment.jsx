/* eslint-disable no-unused-vars */
import Pagination from '~/components/Pagination/Pagination';
import styles from './Appointment.module.scss';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { getAllAppointmentAPI } from '~/services/appointmentService';
import { toast } from 'react-toastify';
import ModalAppointment from '~/pages/Admin/components/BodyContent/Appointment/ModalAppointment/ModalAppointment';

function Appointment() {
  const [appointmentListData, setAppointmentListData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentDetailIdData, setAppointmentDetailIdData] = useState('');

  const [appointmentQuery, setAppointmentQuery] = useState({
    consultantId: '',
    fromDate: '',
    toDate: '',
    customerId: '',
    ticks: 0,
  });

  const handleFetchAllAppointment = async () => {
    const queryString = new URLSearchParams(appointmentQuery).toString();
    console.log('query string get all appointment', queryString);
    try {
      const res = await getAllAppointmentAPI(queryString);
      console.log('get all appointment res', res);
      setAppointmentListData(res.data?.$values);
    } catch (error) {
      console.log('get all appointment err', error);
      toast.error('get all appointment err');
    }
  };

  useEffect(() => {
    handleFetchAllAppointment();
  }, []);

  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = appointmentListData.slice(indexOfFirstProduct, indexOfLastProduct);
  return (
    <>
      <div className={styles.wrap}>
        <h1>Appointment</h1>

        {/*Total number of user box */}
        <div className={styles['header-content']}>
          <div className={styles['header-content-box']}>
            <p>Total Appointment</p>
            <p>{appointmentListData?.length}</p>
          </div>
        </div>

        {/*Filter/Search */}
        <div className={styles['filter-actions-wrap']}>
          <label>Start Date</label>
          <input
            type="date"
            value={appointmentQuery.fromDate.split('T')[0]}
            onChange={(e) => {
              const newFromDate = e.target.value + 'T00:00:00';
              const newTicks = new Date(newFromDate).getTime();
              setAppointmentQuery((prev) => ({
                ...prev,
                fromDate: newFromDate,
                ticks: newTicks,
              }));
            }}
          />

          <label style={{ marginLeft: 20 }}>To Date</label>
          <input
            type="date"
            value={appointmentQuery.toDate.split('T')[0]}
            onChange={(e) => {
              const newToDate = e.target.value + 'T00:00:00';
              setAppointmentQuery((prev) => ({
                ...prev,
                toDate: newToDate,
              }));
            }}
          />

          <input
            type="text"
            value={appointmentQuery.consultantId}
            placeholder="Consultant ID"
            onChange={(e) => {
              const newStaffId = e.target.value;
              setAppointmentQuery((prev) => ({
                ...prev,
                consultantId: newStaffId,
              }));
            }}
          />

          <input
            type="text"
            value={appointmentQuery.customerId}
            placeholder="Customer ID"
            onChange={(e) => {
              const newCustomerId = e.target.value;
              setAppointmentQuery((prev) => ({
                ...prev,
                customerId: newCustomerId,
              }));
            }}
          />
          <button className={styles['filter-btn']} onClick={handleFetchAllAppointment}>
            Filter
          </button>
          <button
            className={styles['filter-btn-clear']}
            onClick={() => {
              setAppointmentQuery({
                consultantId: '',
                fromDate: '',
                toDate: '',
                customerId: '',
                ticks: 0,
              });
              handleFetchAllAppointment();
            }}
          >
            Clear
          </button>
        </div>

        {/*Table */}
        <div className={styles['content-table']}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Appointment Date</th>
                <th>Meet Url</th>
                <th>Consultant</th>
                <th>Customer</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProduct.map((item) => (
                <tr key={item.appointmentId}>
                  <td>{item?.appointmentId}</td>
                  <td>{item?.appointmentDate}</td>
                  <td style={{ overflow: 'hidden' }}>
                    <a href={item?.meetingUrl} target="_blank">
                      {item?.meetingUrl}
                    </a>
                  </td>
                  <td>{item?.consultant.username}</td>
                  <td>{item?.user.username}</td>
                  <td>{item?.status}</td>
                  <td>
                    <FaEye
                      style={{ cursor: 'pointer', color: '#0e82fd', fontSize: 20 }}
                      onClick={() => {
                        setAppointmentDetailIdData(item?.appointmentId);
                        setOpenPopup(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={appointmentListData.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*Popup add service */}
      {openPopup && (
        <ModalAppointment
          setOpenPopup={setOpenPopup}
          appointmentDetailIdData={appointmentDetailIdData}
          setAppointmentDetailIdData={setAppointmentDetailIdData}
        />
      )}
    </>
  );
}

export default Appointment;
