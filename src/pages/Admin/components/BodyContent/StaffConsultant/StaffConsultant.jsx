/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import styles from './StaffConsultant.module.scss';
import Pagination from '~/components/Pagination/Pagination';
import { FaEye, FaMale, FaFemale } from 'react-icons/fa';
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
  const [roleIdFetch, setRoleIdFetch] = useState('157f0b62-afbb-44ce-91ce-397239875df5');
  console.log('role id', roleIdFetch);

  const handleFetchAllStaffConsultant = async () => {
    try {
      const res = await getAllStaffConsultantAPI(roleIdFetch);
      console.log('get all consultant res', res);
      setStaffConsultantListData(res.data?.$values);
    } catch (error) {
      console.log('get all consultant err', error);
      toast.error('get all consultant err');
    }
  };

  useEffect(() => {
    handleFetchAllStaffConsultant();
  }, [roleIdFetch, openPopup]);

  const handleGetStaffConsultantDetail = async (id, role) => {
    try {
      const res = await getStaffConsultantDetailAPI(id, role);
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
            <p>Total {roleIdFetch == '157f0b62-afbb-44ce-91ce-397239875df5' ? 'Consultants' : 'Staffs'}</p>
            <p>{staffConsultantListData?.length}</p>
          </div>
        </div>

        {/*Filter/Search */}
        <div className={styles['filter-actions-wrap']}>
          <div className={styles['filter-wrap']}>
            <div
              className={`${styles['filter-box']} ${
                roleIdFetch === '157f0b62-afbb-44ce-91ce-397239875df5' ? styles.active : ''
              }`}
              onClick={() => setRoleIdFetch('157f0b62-afbb-44ce-91ce-397239875df5')}
            >
              <p>Consultants</p>
            </div>
            <div
              className={`${styles['filter-box']} ${
                roleIdFetch === 'd5cf10f1-1f31-4016-ac13-34667e9ca10d' ? styles.active : ''
              }`}
              onClick={() => setRoleIdFetch('d5cf10f1-1f31-4016-ac13-34667e9ca10d')}
            >
              <p>Staffs</p>
            </div>{' '}
          </div>
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
                <th style={{ overflow: 'hidden' }}>Email</th>
                <th style={{ width: '10%' }}>Gender</th>
                <th style={{ width: '10%' }}>Role</th>
                <th style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProduct.map((item) => (
                <tr key={item.userId}>
                  <td>{item.userId}</td>
                  <td>{item.fullName}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.username}</td>
                  <td style={{ overflow: 'hidden' }}>{item.email}</td>
                  <td>{item.gender ? <FaMale color="blue" /> : <FaFemale color="pink" />}</td>
                  <td>{item.roleId == '157f0b62-afbb-44ce-91ce-397239875df5' ? 'Consultant' : 'Staff'}</td>
                  <td>
                    <FaEye
                      style={{ cursor: 'pointer', color: '#0e82fd', fontSize: 20 }}
                      onClick={() => {
                        setConsultantId(item.userId);
                        setFormType('update');
                        handleGetStaffConsultantDetail(item.userId, item.roleId);
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
