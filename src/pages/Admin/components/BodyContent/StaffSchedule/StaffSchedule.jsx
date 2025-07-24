/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import styles from './StaffSchedule.module.scss';
import { getStaffAllScheduleAndQueryAPI } from '~/services/staffScheduleService';
import { toast } from 'react-toastify';
import Pagination from '~/components/Pagination/Pagination';
import { FaEye } from 'react-icons/fa';
import ModalStaffSchedule from '~/pages/Admin/components/BodyContent/StaffSchedule/ModalStaffSchedule/ModalStaffSchedule';

function StaffSchedule() {
  const [staffScheduleListData, setStaffScheduleListData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scheduleDetailIdData, setScheduleDetailIdData] = useState({
    scheduleId: '',
    staffId: '',
  });
  const [scheduleQuery, setScheduleQuery] = useState({
    staffId: '',
    fromDate: '',
    toDate: '',
    ticks: 0,
  });

  const handleFetchAllStaffSchedule = async () => {
    const queryString = new URLSearchParams(scheduleQuery).toString();
    try {
      const res = await getStaffAllScheduleAndQueryAPI(queryString);
      console.log('get all schedule res', res);
      setStaffScheduleListData(res.data?.$values);
    } catch (error) {
      console.log('get all schedule err', error);
      toast.error('get all schedule err');
    }
  };

  useEffect(() => {
    if (openPopup) return;
    handleFetchAllStaffSchedule();
  }, [openPopup]);

  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = staffScheduleListData.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <div className={styles.wrap}>
        <h1>Staff Schedule</h1>

        {/*Total number of user box */}
        <div className={styles['header-content']}>
          <div className={styles['header-content-box']}>
            <p>Total Schedule</p>
            <p>{staffScheduleListData?.length}</p>
          </div>
        </div>

        {/*Filter/Search */}
        <div className={styles['filter-actions-wrap']}>
          <label>Start Date</label>
          <input
            type="date"
            value={scheduleQuery.fromDate.split('T')[0]}
            onChange={(e) => {
              const newFromDate = e.target.value + 'T00:00:00';
              const newTicks = new Date(newFromDate).getTime();
              setScheduleQuery((prev) => ({
                ...prev,
                fromDate: newFromDate,
                ticks: newTicks,
              }));
            }}
          />

          <label style={{ marginLeft: 20 }}>To Date</label>
          <input
            type="date"
            value={scheduleQuery.toDate.split('T')[0]}
            onChange={(e) => {
              const newToDate = e.target.value + 'T00:00:00';
              setScheduleQuery((prev) => ({
                ...prev,
                toDate: newToDate,
              }));
            }}
          />

          <input
            type="text"
            value={scheduleQuery.staffId}
            placeholder="Staff ID"
            onChange={(e) => {
              const newStaffId = e.target.value;
              setScheduleQuery((prev) => ({
                ...prev,
                staffId: newStaffId,
              }));
            }}
          />
          <button className={styles['filter-btn']} onClick={handleFetchAllStaffSchedule}>
            Filter
          </button>
          <button
            className={styles['filter-btn-clear']}
            onClick={() => {
              setScheduleQuery({
                staffId: '',
                fromDate: '',
                toDate: '',
                ticks: 0,
              });
              handleFetchAllStaffSchedule();
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
                <th>Working Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Staff</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProduct.map((item) => (
                <tr key={item.staffScheduleId}>
                  <td>{item.staffScheduleId}</td>
                  <td>{new Date(item.workingDate).toLocaleDateString('vi-VN')}</td>
                  <td>{item.startTime}</td>
                  <td>{item.endTime}</td>
                  <td>{item.status}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.consultant.username}</td>
                  <td>
                    <FaEye
                      style={{ cursor: 'pointer', color: '#0e82fd', fontSize: 20 }}
                      onClick={() => {
                        setScheduleDetailIdData((prev) => ({
                          ...prev,
                          scheduleId: item.staffScheduleId,
                          staffId: item.consultant.userId,
                        }));
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
            totalProducts={staffScheduleListData.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*Popup add service */}
      {openPopup && (
        <ModalStaffSchedule
          setOpenPopup={setOpenPopup}
          scheduleDetailIdData={scheduleDetailIdData}
          setScheduleDetailIdData={setScheduleDetailIdData}
        />
      )}
    </>
  );
}

export default StaffSchedule;
