import { Link } from 'react-router-dom';
import styles from './AdminHeader.module.scss';
import logo from '~/assets/images/logo.svg';

function AdminHeader() {
  return (
    <div className={styles.wrap}>
      <div className={styles['logo-wrap']}>
        <Link to={'/'}>
          <img src={logo} alt="logo" />
        </Link>
      </div>
    </div>
  );
}

export default AdminHeader;
