import { Link, useParams } from 'react-router-dom';
import styles from './Auth.module.scss';
import { useState } from 'react';

function Auth() {
  const { type } = useParams();
  const initialForm = {
    username: '',
    password: '',
    email: '',
    confirm_password: '',
  };
  const [authForm, setAuthForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('authForm', authForm);
    setAuthForm(initialForm);
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
            <div className={styles['input-field']}>
              <label>Email</label>
              <input type="email" name="email" value={authForm.email} onChange={handleChange} />
            </div>
          )}

          <div className={styles['input-field']}>
            <label>Password</label>
            <input type="password" name="password" value={authForm.password} onChange={handleChange} />
          </div>

          {type == 'register' && (
            <div className={styles['input-field']}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={authForm.confirm_password}
                onChange={handleChange}
              />
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
        </div>
      </div>
    </div>
  );
}

export default Auth;
