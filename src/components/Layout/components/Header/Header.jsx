import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';

function Header() {
  const { userInfo, handleLogout } = useContext(AuthContext);
  console.log('userinfo', userInfo);

  return (
    <div className={styles['header-wrap']}>
      {/*Logo */}
      <div className={styles['header-logo']}>
        <h1>Logo</h1>
      </div>{' '}
      <div className={styles['header-navbar']}>
        <Link to={'/'}>Home</Link>
        <Link to={'/service'}>Services</Link>
        <Link to={'/book-consultant'}>Consultant</Link>
        <span style={{ color: '#ccc', cursor: 'not-allowed' }}>Resources & Guides</span>
        <span style={{ color: '#ccc', cursor: 'not-allowed' }}>Partners</span>
        <Link to={'/blog'}>Blog</Link>
      </div>
      <div className={styles['header-account']}>
        {userInfo ? (
          <div className={styles['user-wrap']}>
            <p>{userInfo?.username}</p>

            <div className={styles['dropdown-menu']}>
              <p>
                <Link to={'/admin'}>Admin</Link>
              </p>
              <p>
                <Link to={'/account/detail'}>My Account</Link>
              </p>
              <p>
                <Link to={'/staff-schedule'}>Staff Schedule</Link>
              </p>
              <p onClick={() => handleLogout()}>Sign Out</p>
            </div>
          </div>
        ) : (
          <>
            <button>
              <Link to={'/auth/login'}>Sign In</Link>
            </button>
            <button>
              <Link to={'/auth/register'}>Sign Up</Link>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
