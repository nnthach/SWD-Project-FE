import { useEffect, useState } from 'react';
import styles from './StaffConsultant.module.scss';
import Pagination from '~/components/Pagination/Pagination';
import { FaEye } from 'react-icons/fa';
import ModalStaffConsultant from '~/pages/Admin/components/BodyContent/StaffConsultant/ModalStaffConsultant/ModalStaffConsultant';
import { toast } from 'react-toastify';
import { getAllStaffConsultantAPI, getStaffConsultantDetailAPI } from '~/services/staffConsultantService';

function StaffConsultant() {
  // eslint-disable-next-line no-unused-vars
  const [staffConsultantListData, setStaffConsultantListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const initialForm = {
    username: '',
    fullName: '',
    // password: '123456',
    gender: false,
    personalEmail: '',
    phoneNumber: '',
    address: '',
    birthday: '',
    isActive: true,
    roleId: '157f0b62-afbb-44ce-91ce-397239875df5',
  };
  const [formConsultantData, setFormConsultantData] = useState(initialForm);
  const [openPopup, setOpenPopup] = useState(false);
  const [consultantId, setConsultantId] = useState('');
  const [formType, setFormType] = useState('');
  console.log('consultant id', consultantId)

  const handleFetchAllStaffConsultant = async () => {
    try {
      const res = await getAllStaffConsultantAPI();
      console.log('get all consultant res', res);
      setStaffConsultantListData(res.data);
    } catch (error) {
      console.log('get all consultant err', error);
      toast.error('get all consultant err');
    }
  };

  useEffect(() => {
    handleFetchAllStaffConsultant();
  }, []);

  const handleGetStaffConsultantDetail = async (id) => {
    try {
      const res = await getStaffConsultantDetailAPI(id);
      console.log('res detail', res);
      setFormConsultantData(res.data);
    } catch (error) {
      console.log('consultant detail err', error);
    }
  };

  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = staffConsultantListData.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <div className={styles.wrap}>
        <h1>Staff Consultant</h1>

        {/*Total number of user box */}
        <div className={styles['header-content']}>
          <div className={styles['header-content-box']}>
            <p>Total Service</p>
            <p>159</p>
          </div>
          <div className={styles['header-content-box']}>
            <p>Admins</p>
            <p>159</p>
          </div>
          <div className={styles['header-content-box']}>
            <p>Staffs</p>
            <p>159</p>
          </div>
          <div className={styles['header-content-box']}>
            <p>Users</p>
            <p>159</p>
          </div>
        </div>

        {/*Filter/Search */}
        <div className={styles['filter-actions-wrap']}>
          <div className={styles['filter-wrap']}></div>
          <div className={styles['action-wrap']}>
            <button
              onClick={() => {
                setFormType('create');
                setFormConsultantData(initialForm);
                setOpenPopup(true);
              }}
            >
              Add Staff Consultant
            </button>
          </div>
        </div>

        {/*Table */}
        <div className={styles['content-table']}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fullname</th>
                <th>Username</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProduct.map((item) => (
                <tr key={item.userId}>
                  <td>{item.userId}</td>
                  <td>{item.fullName}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.gender}</td>
                  <td>
                    <FaEye
                      style={{ cursor: 'pointer', color: 'blue', fontSize: 20 }}
                      onClick={() => {
                        setConsultantId(item.userId);
                        setFormType('update');
                        handleGetStaffConsultantDetail(item.userId);
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
            totalProducts={staffConsultantListData.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*Popup add service */}
      {openPopup && (
        <ModalStaffConsultant
          setConsultantId={setConsultantId}
          setFormConsultantData={setFormConsultantData}
          initialForm={initialForm}
          setFormType={setFormType}
          setOpenPopup={setOpenPopup}
          formConsultantData={formConsultantData}
          formType={formType}
          consultantId={consultantId}
          handleFetchAllStaffConsultant={handleFetchAllStaffConsultant}
        />
      )}
    </>
  );
}

export default StaffConsultant;
