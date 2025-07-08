import { Link } from 'react-router-dom';
import styles from './AdminHeader.module.scss';

function AdminHeader() {
  return (
    <div className={styles.wrap}>
      <div className={styles['logo-wrap']}>
        <Link to={'/'}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/2025_FIFA_Club_World_Cup.svg/2048px-2025_FIFA_Club_World_Cup.svg.png" />
        </Link>
      </div>
    </div>
  );
}

export default AdminHeader;
