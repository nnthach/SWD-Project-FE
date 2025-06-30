import { useState } from 'react';
import styles from './Auth.module.scss';
import { toast } from 'react-toastify';
import { forgotPasswordAPI } from '~/services/authService';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      const res = await forgotPasswordAPI({ email });
      console.log('Send reset email res', res);
      if (res?.data?.message) {
        setLoading(true);
      }
    } catch (error) {
      console.log('Send reset email err', error);
    }
  };
  return (
    <div className={styles['auth-wrap']}>
      {loading ? (
        <div className={styles['loading-box']}>
          <FaSpinner className={styles.spinner} />
          <div style={{ display: 'flex', gap: 10 }}>
            <p>Check your email</p>
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['gmail-link']}
            >
              Open Gmail
            </a>
          </div>
          <Link to={'/auth/login'}>Cancel process</Link>
        </div>
      ) : (
        <div className={styles['form-wrap']}>
          <h1>Forgot Password</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles['input-field']}>
              <label>Email</label>
              <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <button type="submit" className={styles['submit-btn']}>
              Send
            </button>
          </form>
          <div className={styles['sub-option']}>
            <Link to={'/auth/login'} style={{ color: 'black', textDecoration: 'none', fontSize: 12 }}>
              Back to Login
            </Link>
            <Link to={'/'} style={{ color: 'black', textDecoration: 'none', fontSize: 12 }}>
              Continue as Guest
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
