import { useContext, useState } from 'react';
import styles from './Service.module.scss';
import Pagination from '~/components/Pagination/Pagination';
import { getServiceDetailAPI } from '~/services/serviceService';
import { ServiceContext } from '~/context/ServiceContext';
import { FaEye } from 'react-icons/fa';
import ModalService from '~/pages/Admin/components/BodyContent/Service/components/ModalService/ModalService';

function Service() {
  const [currentPage, setCurrentPage] = useState(1);
  const initialForm = {
    serviceName: '',
    description: '',
    price: 0,
    isActive: true,
  };
  const { servicesListData } = useContext(ServiceContext);
  const [formServiceData, setFormServiceData] = useState(initialForm);
  const [openPopup, setOpenPopup] = useState(false);
  const [serviceId, setServiceId] = useState('');
  const [formType, setFormType] = useState('');

  const handleGetServiceDetail = async (id) => {
    try {
      const res = await getServiceDetailAPI(id);
      console.log('res detail', res);
      setFormServiceData(res.data);
    } catch (error) {
      console.log('service detail err', error);
    }
  };

  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = servicesListData.slice(indexOfFirstProduct, indexOfLastProduct);
  return (
    <>
      <div className={styles.wrap}>
        <h1>Service</h1>

        {/*Total number of user box */}
        <div className={styles['header-content']}>
          <div className={styles['header-content-box']}>
            <p>Total Service</p>
            <p>{servicesListData?.length}</p>
          </div>
        </div>

        {/*Filter/Search */}
        <div className={styles['filter-actions-wrap']}>
          <div className={styles['filter-wrap']}></div>
          <div className={styles['action-wrap']}>
            <button
              onClick={() => {
                setFormType('create');
                setFormServiceData(initialForm);
                setOpenPopup(true);
              }}
            >
              Add Service
            </button>
          </div>
        </div>

        {/*Table */}
        <div className={styles['content-table']}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProduct.map((item) => (
                <tr key={item.serviceId}>
                  <td>{item.serviceId}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.serviceName}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>
                    <FaEye
                      style={{ cursor: 'pointer', color: '#0e82fd', fontSize: 20 }}
                      onClick={() => {
                        setServiceId(item.serviceId);
                        setFormType('update');
                        handleGetServiceDetail(item.serviceId);
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
            totalProducts={servicesListData.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*Popup add service */}
      {openPopup && (
        <ModalService
          setServiceId={setServiceId}
          setFormServiceData={setFormServiceData}
          initialForm={initialForm}
          setFormType={setFormType}
          setOpenPopup={setOpenPopup}
          formServiceData={formServiceData}
          formType={formType}
          serviceId={serviceId}
        />
      )}
    </>
  );
}

export default Service;
