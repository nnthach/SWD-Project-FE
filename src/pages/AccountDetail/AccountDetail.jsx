import Footer from '~/components/Layout/components/Footer/Footer';
import Header from '~/components/Layout/components/Header/Header';
import styles from './AccountDetail.module.scss';
import { FaUser } from 'react-icons/fa';
import Information from '~/pages/AccountDetail/MainContent/Information/Information';

function AccountDetail() {
  return (
    <div>
      <div className={styles.wrap}>
        <div className={styles.container}>
          <div className={styles['user-aside']}>
            <div className={styles['user-avatar']}>
              <FaUser fontSize={30} />
            </div>

            <div className={styles['aside-menu']}>
              <p>Information</p>
              <p>Password</p>
            </div>
          </div>

          <div className={styles['main-content']}>
            <h5>Information</h5>

            <Information />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetail;
