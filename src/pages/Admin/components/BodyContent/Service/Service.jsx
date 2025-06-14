import { useContext, useState } from 'react';
import styles from './Service.module.scss';
import Pagination from '~/components/Pagination/Pagination';
import { createServiceAPI } from '~/services/serviceService';
import { toast } from 'react-toastify';
import { ServiceContext } from '~/context/ServiceContext';

function Service() {
  const [currentPage, setCurrentPage] = useState(1);
  const initialForm = {
    serviceName: '',
    description: '',
    price: 0,
    isActive: true,
  };
  const [addServiceData, setAddServiceData] = useState(initialForm);
  const [openPopup, setOpenPopup] = useState(false);
  const { servicesListData, fetchAllServices } = useContext(ServiceContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddServiceData((prev) => ({
      ...prev,
      [name]: name == 'price' ? Number(value) : value,
    }));
  };

  const handleSubmitAddService = async (e) => {
    e.preventDefault();

    try {
      const res = await createServiceAPI(addServiceData);
      console.log('create res', res);
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
            <button onClick={() => setOpenPopup(true)}>Add Service</button>
          </div>
        </div>

        {/*Table */}
        <div className={styles['content-table']}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <td>{item.serviceName}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>Action</td>
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
          <p className={styles['close-btn']} onClick={() => setOpenPopup(false)}>
            &times;
          </p>
          <form onSubmit={handleSubmitAddService} className={styles['form-wrap']}>
            <h1>Add Service</h1>
            <div className={styles['form-input']}>
              <label>Service Name</label>
              <input type="text" name="serviceName" onChange={(e) => handleChange(e)} />
            </div>
            <div className={styles['form-input']}>
              <label>Service Description</label>
              <textarea name="description" onChange={(e) => handleChange(e)} />
            </div>
            <div className={styles['form-input']}>
              <label>Service Price</label>
              <input type="number" name="price" onChange={(e) => handleChange(e)} />
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Service;
