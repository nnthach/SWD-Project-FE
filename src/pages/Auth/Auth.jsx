import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './Auth.module.scss';
import { useContext, useState } from 'react';
import { loginAPI, registerAPI } from '~/services/authService';
import Cookies from 'js-cookie';
import { AuthContext } from '~/context/AuthContext';
import { toast } from 'react-toastify';

function Auth() {
  const { type } = useParams();
  const initialForm = {
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    phoneNumber: '',
  };
  const [authForm, setAuthForm] = useState(initialForm);
  const { setUsername } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type == 'register') {
      try {
        await registerAPI(authForm);
        setAuthForm(initialForm);
        toast.success('Register success');
        navigate('/auth/login');
      } catch (error) {
        console.log('register err', error);
        setAuthForm(initialForm);
        toast.error(error.response.data);
      }
    }

    if (type == 'login') {
      try {
        const res = await loginAPI(authForm);
        console.log('login res', res);
        const { accessToken, refreshToken, username } = res.data;

        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);
        Cookies.set('username', username);

        setUsername(username);

        setAuthForm(initialForm);
        toast.success('Login success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.log('llogin err', error);
        setAuthForm(initialForm);
        toast.error('Login fail');
      }
    }
  };

  return (
    <div className={styles['auth-wrap']}>
      <div className={styles['form-wrap']}>
        <h1>Let's {type == 'login' ? 'Sign In' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles['input-field']}>
            <label>Username</label>
            <input type="text" name="username" value={authForm.username} onChange={handleChange} />
          </div>

          {type == 'register' && (
            <>
              <div className={styles['input-field']}>
                <label>Email</label>
                <input type="email" name="email" value={authForm.email} onChange={handleChange} />
              </div>
              <div className={styles['input-field']}>
                <label>Phone</label>
                <input type="number" name="phoneNumber" value={authForm.phoneNumber} onChange={handleChange} />
              </div>
            </>
          )}

          <div className={styles['input-field']}>
            <label>Password</label>
            <input type="password" name="password" value={authForm.password} onChange={handleChange} />
          </div>

          {type == 'register' && (
            <div className={styles['input-field']}>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={authForm.confirmPassword} onChange={handleChange} />
            </div>
          )}

          {type != 'register' && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, cursor: 'pointer' }}>
                <Link to={'/auth/forgot-password'}>Forgot password</Link>
              </p>
            </div>
          )}

          <button type="submit" className={styles['submit-btn']}>
            {type == 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className={styles['sub-option']}>
          {type == 'login' ? (
            <p>
              Do not have an account? <Link to={'/auth/register'}>Sign Up</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link to={'/auth/login'}>Sign In</Link>
            </p>
          )}

          <Link to={'/'} style={{ color: 'black', textDecoration: 'none', fontSize: 12 }}>
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Auth;
