import { useContext, useState } from 'react';
import styles from './Service.module.scss';
import Pagination from '~/components/Pagination/Pagination';
import { createServiceAPI, deleteServiceAPI, getServiceDetailAPI, updateServiceAPI } from '~/services/serviceService';
import { toast } from 'react-toastify';
import { ServiceContext } from '~/context/ServiceContext';
import { FaEye } from 'react-icons/fa';

function Service() {
  const [currentPage, setCurrentPage] = useState(1);
  const initialForm = {
    serviceName: '',
    description: '',
    price: 0,
    isActive: true,
  };
  const { servicesListData, fetchAllServices } = useContext(ServiceContext);
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

  const handleDeleteService = async (id) => {
    try {
      const res = await deleteServiceAPI(id);
      console.log('res delete', res);
      setServiceId('');
      setFormServiceData(initialForm);
      fetchAllServices();
      setFormType('');
      setOpenPopup(false);
      toast.success('Delete Success');
    } catch (error) {
      console.log('service delete err', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormServiceData((prev) => ({
      ...prev,
      [name]: name == 'price' ? Number(value) : value,
    }));
  };

  const handleSubmitUpdate = async (id) => {
    try {
      const res = await updateServiceAPI(id, formServiceData);
      console.log('Update res', res);
      fetchAllServices();
      setOpenPopup(false);
      toast.success('Update Success');
    } catch (error) {
      setOpenPopup(false);
      console.log('Update err', error);
    }
  };

  const handleSubmitCreate = async () => {
    try {
      const res = await createServiceAPI(formServiceData);
      console.log('Create res', res);
      fetchAllServices();
      setOpenPopup(false);
      toast.success('Create Success');
    } catch (error) {
      setOpenPopup(false);
      console.log('create err', error);
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
                      style={{ cursor: 'pointer', color: 'blue', fontSize: 20 }}
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
        <div className={styles['popup-wrap']}>
          <div className={styles.overlay} />
          <p
            className={styles['close-btn']}
            onClick={() => {
              setServiceId('');
              setFormServiceData(initialForm);
              setFormType('');
              setOpenPopup(false);
            }}
          >
            &times;
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formType === 'create') {
                handleSubmitCreate();
              } else {
                handleSubmitUpdate(serviceId);
              }
            }}
            className={styles['form-wrap']}
          >
            <h1>{formType == 'create' ? 'Add Service' : 'Service Detail'}</h1>
            <div className={styles['form-input']}>
              <label>Service Name</label>
              <input
                type="text"
                name="serviceName"
                value={formServiceData.serviceName}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className={styles['form-input']}>
              <label>Service Description</label>
              <textarea name="description" value={formServiceData.description} onChange={(e) => handleChange(e)} />
            </div>
            <div className={styles['form-input']}>
              <label>Service Price</label>
              <input type="number" name="price" value={formServiceData.price} onChange={(e) => handleChange(e)} />
            </div>

            <div className={styles['submit-btn-wrap']}>
              <button type="submit">{formType == 'create' ? 'Create' : 'Update'}</button>
              {formType != 'create' && (
                <button type="button" style={{ backgroundColor: 'red' }} onClick={() => handleDeleteService(serviceId)}>
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Service;
