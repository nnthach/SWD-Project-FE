import { useContext, useEffect, useState } from 'react';
import styles from './Information.module.scss';
import { AuthContext } from '~/context/AuthContext';
import { updateUserInfoAPI } from '~/services/authService';
import { toast } from 'react-toastify';

function Information() {
  const { userInfo } = useContext(AuthContext);
  console.log('userinfo', userInfo);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: true,
  });

  useEffect(() => {
    if (userInfo) {
      let dobString = '';

      if (userInfo.dateOfBirth) {
        const date = new Date(userInfo.dateOfBirth); // "6/6/2025" → Date object
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        dobString = `${yyyy}-${mm}-${dd}`; // ✅ "2025-06-06"
      }
      setFormData({
        username: userInfo.username || '',
        fullName: userInfo.fullName || '',
        email: userInfo.email || '',
        phoneNumber: userInfo.phoneNumber || '',
        address: userInfo.address || '',
        dateOfBirth: dobString,
        gender: userInfo.gender ?? true,
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const parsedValue =
      type === 'select-one'
        ? value === 'true' // convert string to boolean
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo || !userInfo.id) {
      toast.error('User information not available');
      return;
    }

    // Include only the userId in the request
    const updateData = {
      userId: userInfo.id,
      // You can include other required fields that don't need user input
      // For example, if maintaining existing values is needed:
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth ? formatDateForAPI(formData.dateOfBirth) : null,
      gender: formData.gender,
    };

    try {
      const res = await updateUserInfoAPI(updateData);
      console.log('update user res', res);
      toast.success('Update success');
    } catch (error) {
      console.log('update user err', error);
      toast.error(error.response?.data || 'Update failed');
    }
  };

  // Helper function to format date correctly for the API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const [y, m, d] = dateString.split('-'); // "2025-06-14"
    return `${d}-${m}-${y}`; // Format as DD-MM-YYYY for the API
  };

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit}>
        <div className={styles['input-field']}>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} readOnly />
        </div>
        <div className={styles['input-field']}>
          <label>Fullname</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
        </div>
        <div className={styles['input-field']}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className={styles['input-field']}>
          <label>Phone Number</label>
          <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>
        <div className={styles['input-field']}>
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className={styles['input-field']}>
          <label>DOB</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        </div>
        <div className={styles['input-field']}>
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value={true}>Male</option>
            <option value={false}>Female</option>
          </select>
        </div>

        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default Information;
