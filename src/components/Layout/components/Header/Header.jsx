import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';
import logo from '~/assets/images/logo.svg';

function Header() {
  const { userInfo, handleLogout } = useContext(AuthContext);
  console.log('userinfo', userInfo);

  return (
    <div className={styles['header-wrap']}>
      {/*Logo */}
      <div className={styles['header-logo']}>
        <img src={logo} alt="logo" />
      </div>{' '}
      <div className={styles['header-navbar']}>
        <Link to={'/'}>Home</Link>
        <Link to={'/service'}>Services</Link>
        <Link to={'/book-consultant'}>Consultant</Link>
        <Link to={'/cycle-input'}>Cycle Tracker</Link>
        <span style={{ color: '#ccc', cursor: 'not-allowed' }}>Resources & Guides</span>
        <span style={{ color: '#ccc', cursor: 'not-allowed' }}>Partners</span>
        <Link to={'/blog'}>Blog</Link>
      </div>
      <div className={styles['header-account']}>
        {userInfo ? (
          <div className={styles['user-wrap']}>
            <p>{userInfo?.username}</p>

            <div className={styles['dropdown-menu']}>
              {userInfo.roleId == 'c5b82656-c6a7-49bd-a3fb-3d3e07022d33' && (
                <p>
                  <Link to={'/admin'}>Admin</Link>
                </p>
              )}

              {userInfo.roleId == '157f0b62-afbb-44ce-91ce-397239875df5' ||
                (userInfo.roleId == 'd5cf10f1-1f31-4016-ac13-34667e9ca10d' && (
                  <p>
                    <Link to={'/staff-schedule'}>Staff Schedule</Link>
                  </p>
                ))}
              <p>
                <Link to={'/account/detail'}>My Account</Link>
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
