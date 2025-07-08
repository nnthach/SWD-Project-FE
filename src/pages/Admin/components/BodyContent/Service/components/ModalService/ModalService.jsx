import { createServiceAPI, deleteServiceAPI, updateServiceAPI } from '~/services/serviceService';
import styles from './ModalService.module.scss';
import { useContext } from 'react';
import { ServiceContext } from '~/context/ServiceContext';
import { toast } from 'react-toastify';

function ModalService({
  setServiceId,
  setFormServiceData,
  initialForm,
  setFormType,
  setOpenPopup,
  formServiceData,
  formType,
  serviceId,
}) {
  const { fetchAllServices } = useContext(ServiceContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormServiceData((prev) => ({
      ...prev,
      [name]: name == 'price' ? Number(value) : value,
    }));
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await deleteServiceAPI(id);
      console.log('res delete', res);
      setServiceId('');
      setFormServiceData(initialForm);
      fetchAllServices();
      setFormType('');
      setOpenPopup(false);
      toast.success('Delete Success');
    } catch (error) {
      console.log('service delete err', error);
    }
  };

  const handleSubmitUpdate = async (id) => {
    try {
      const res = await updateServiceAPI(id, formServiceData);
      console.log('Update res', res);
      fetchAllServices();
      setOpenPopup(false);
      toast.success('Update Success');
    } catch (error) {
      setOpenPopup(false);
      console.log('Update err', error);
    }
  };

  const handleSubmitCreate = async () => {
    try {
      const res = await createServiceAPI(formServiceData);
      console.log('Create res', res);
      fetchAllServices();
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
          setServiceId('');
          setFormServiceData(initialForm);
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
            handleSubmitUpdate(serviceId);
          }
        }}
        className={styles['form-wrap']}
      >
        <h1>{formType == 'create' ? 'Add Service' : 'Service Detail'}</h1>
        <div className={styles['form-input']}>
          <label>Service Name</label>
          <input type="text" name="serviceName" value={formServiceData.serviceName} onChange={(e) => handleChange(e)} />
        </div>
        <div className={styles['form-input']}>
          <label>Service Description</label>
          <textarea name="description" value={formServiceData.description} onChange={(e) => handleChange(e)} />
        </div>
        <div className={styles['form-input']}>
          <label>Service Price</label>
          <input type="number" name="price" value={formServiceData.price} onChange={(e) => handleChange(e)} />
        </div>

        <div className={styles['submit-btn-wrap']}>
          <button type="submit">{formType == 'create' ? 'Create' : 'Update'}</button>
          {formType != 'create' && (
            <button type="button" style={{ backgroundColor: 'red' }} onClick={() => handleDeleteService(serviceId)}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ModalService;
