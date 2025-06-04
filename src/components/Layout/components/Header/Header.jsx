import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

function Header() {
  return (
    <div className={styles['header-wrap']}>
      {/*Logo */}
      <div className={styles['header-logo']}>
        <h1>Logo</h1>
      </div>

      <div className={styles['header-navbar']}>
        <Link to={'/'}>Home</Link>
        <Link to={'/service'}>Services</Link>
        <Link>Solutions</Link>
        <Link>Resources & Guides</Link>
        <Link>Partners</Link>
        <Link>Blog</Link>
      </div>

      <div className={styles['header-account']}>
        <button>Sign In</button>
        <button>Sign Up</button>
      </div>
    </div>
  );
}

export default Header;
