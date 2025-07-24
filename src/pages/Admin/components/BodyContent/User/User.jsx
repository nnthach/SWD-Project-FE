/* eslint-disable no-unused-vars */
import { fakeDataUserInAdmin } from '~/constants/fakeData';
import styles from './User.module.scss';
import Pagination from '~/components/Pagination/Pagination';
import { useState } from 'react';
import { FaEye } from 'react-icons/fa';

function User() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = fakeDataUserInAdmin.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className={styles.wrap}>
      <h1>User</h1>

      {/*Total number of user box */}
      <div className={styles['header-content']}>
        <div className={styles['header-content-box']}>
          <p>Total User</p>
          <p>11</p>
        </div>
        <div className={styles['header-content-box']}>
          <p>Admins</p>
          <p>1</p>
        </div>
        <div className={styles['header-content-box']}>
          <p>Staffs</p>
          <p>3</p>
        </div>
        <div className={styles['header-content-box']}>
          <p>Consultants</p>
          <p>2</p>
        </div>
      </div>

      {/*Table */}
      <div className={styles['content-table']}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProduct.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.role}</td>
                <td>
                  <FaEye style={{ cursor: 'pointer', color: '#0e82fd', fontSize: 20 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          productsPerPage={productsPerPage}
          totalProducts={fakeDataUserInAdmin.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default User;
