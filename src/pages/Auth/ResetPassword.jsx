import { useState } from 'react';
import styles from './Auth.module.scss';
import { toast } from 'react-toastify';
import { resetPasswordAPI } from '~/services/authService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log('searchParams', searchParams);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [form, setForm] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !token) {
      toast.error('Missing token or email');
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const payload = {
        email,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      };
      const res = await resetPasswordAPI(payload);
      console.log('Reset password res', res);
      toast.success('Reset password success');

      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      console.log('Reset password err', error);
    }
  };
  return (
    
      <div className={styles['auth-wrap']}>
        <div className={styles['form-wrap']}>
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles['input-field']}>
              <label>New Password</label>
              <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
            </div>
            <div className={styles['input-field']}>
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles['submit-btn']}>
              Confirm
            </button>
          </form>
          <div className={styles['sub-option']}>
            <Link to={'/'} style={{ color: 'black', textDecoration: 'none', fontSize: 12 }}>
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    
  );
}

export default ResetPassword;
