import styles from './ModalStaffConsultant.module.scss';
import { toast } from 'react-toastify';
import {
  createStaffConsultantAPI,
  deleteStaffConsultantAPI,
  updateStaffConsultantAPI,
} from '~/services/staffConsultantService';

function ModalStaffConsultant({
  setConsultantId,
  setFormConsultantData,
  initialForm,
  setFormType,
  setOpenPopup,
  formConsultantData,
  formType,
  consultantId,
  handleFetchAllStaffConsultant,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormConsultantData((prev) => ({
      ...prev,
      [name]: name === 'gender' ? value === 'true' : value,
    }));
  };

  const handleDeleteConsultant = async (id, role) => {
    try {
      const res = await deleteStaffConsultantAPI(id, role);
      console.log('res delete', res);
      setConsultantId('');
      setFormConsultantData(initialForm);
      handleFetchAllStaffConsultant();
      setFormType('');
      setOpenPopup(false);
      toast.success('Delete Success');
    } catch (error) {
      console.log('consultant delete err', error);
    }
  };

  const handleSubmitUpdate = async (id, roleId) => {
    if (!formConsultantData.username || !formConsultantData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    try {
      // eslint-disable-next-line no-unused-vars
      const { userId, role, ...newDataUpdate } = formConsultantData;
      console.log('forrm update consultant', newDataUpdate);
      const res = await updateStaffConsultantAPI(id, newDataUpdate, roleId);
      console.log('Update res', res);
      handleFetchAllStaffConsultant();
      setOpenPopup(false);
      toast.success('Update Success');
    } catch (error) {
      setOpenPopup(false);
      console.log('Update err', error);
    }
  };

  const handleSubmitCreate = async () => {
    if (!formConsultantData.username) {
      toast.error('Please fill in username fields');
      return;
    }

    try {
      console.log('form create data', formConsultantData);
      const res = await createStaffConsultantAPI(formConsultantData);
      console.log('Create res', res);
      handleFetchAllStaffConsultant();
      setOpenPopup(false);
      toast.success('Create Success');
    } catch (error) {
      setOpenPopup(false);
      console.log('create err', error);
    }
  };

  return (
    <div className={styles['popup-wrap']}>
      <div className={styles.overlay} />
      <p
        className={styles['close-btn']}
        onClick={() => {
          setConsultantId('');
          setFormConsultantData(initialForm);
          setFormType('');
          setOpenPopup(false);
        }}
      >
        &times;
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (formType === 'create') {
            handleSubmitCreate();
          } else {
            handleSubmitUpdate(consultantId, formConsultantData.roleId);
          }
        }}
        className={styles['form-wrap']}
      >
        <h1>{formType == 'create' ? 'Create Staff' : 'Staff Detail'}</h1>
        <div className={styles.row}>
          <div className={styles['form-input']}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formConsultantData.username}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className={styles['form-input']}>
            <label>Fullname</label>
            <input type="text" name="fullName" value={formConsultantData.fullName} onChange={(e) => handleChange(e)} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles['form-input']}>
            <label>Email</label>
            <input
              type="email"
              name="personalEmail"
              value={formConsultantData.email}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className={styles['form-input']}>
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formConsultantData.phoneNumber}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles['form-input']}>
            <label>Address</label>
            <input type="text" name="address" value={formConsultantData.address} onChange={(e) => handleChange(e)} />
          </div>
          <div className={styles['form-input']}>
            <label>Birthday</label>
            <input type="date" name="birthday" value={formConsultantData.birthday} onChange={(e) => handleChange(e)} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles['form-input']}>
            <label>Gender</label>
            <select name="gender" value={formConsultantData.gender} onChange={(e) => handleChange(e)}>
              <option value={true}>Male</option>
              <option value={false}>Female</option>
            </select>
          </div>

          <div className={styles['form-input']}>
            <label>Role</label>
            <select name="roleId" value={formConsultantData.roleId} onChange={(e) => handleChange(e)}>
              <option value="157f0b62-afbb-44ce-91ce-397239875df5">Consultant</option>
              <option value="d5cf10f1-1f31-4016-ac13-34667e9ca10d">Staff</option>
            </select>
          </div>
        </div>

        <div className={styles['submit-btn-wrap']}>
          <button type="submit">{formType == 'create' ? 'Create' : 'Update'}</button>
          {formType != 'create' && (
            <button
              type="button"
              style={{ backgroundColor: 'red' }}
              onClick={() => {
                console.log('role id', formConsultantData.roleId);
                handleDeleteConsultant(consultantId, formConsultantData.roleId);
              }}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ModalStaffConsultant;
