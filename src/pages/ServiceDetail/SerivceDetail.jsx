import { useParams, useNavigate } from 'react-router-dom';
import styles from './ServiceDetail.module.scss';
import { useEffect, useState } from 'react';
import BookingPopup from '~/components/BookingPopup/BookingPopup';
import { getServiceDetailAPI } from '~/services/serviceService';
import Cookies from 'js-cookie';

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleBookingClick = () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      navigate('/auth/login');
    } else {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await getServiceDetailAPI(id);
        setService(res.data);
      } catch (err) {
        console.error('Failed to load service details', err);
      }
    };
    fetchService();
  }, [id]);

  if (!service) {
    return <p>Loading service data...</p>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.info}>
          <p className={styles.breadcrumb}>
            Home / Test / {service.category || 'Category'} /{' '}
            <strong>{service.serviceName}</strong>
          </p>
          <h1>{service.serviceName}</h1>
          <p className={styles.price}>{service.price?.toLocaleString()}₫</p>
          <div className={styles.buttons}>
            <button onClick={handleBookingClick} className={styles.book}>
              Book Appointment
            </button>
          </div>
          <span className={styles.category}>{service.category || 'Category'}</span>
        </div>
      </div>

      <div className={styles.description}>
        <h2>Service Overview</h2>
        <p>{service.descriptionLong || service.description}</p>
      </div>

      <div className={styles.processBox}>
        <h2>Test Procedure</h2>
        <div className={styles.steps}>
          {[
            'Register for Testing',
            'Sample Collection',
            'Get Results',
            'Free Doctor Consultation',
          ].map((step, index) => (
            <div className={styles.step} key={index}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div>
                <strong>{step}</strong>
                <p>Step {index + 1} description will be added later</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setShowPopup(true)} className={styles.bookBtn}>
          Book Appointment
        </button>
      </div>

      <BookingPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        selectedServiceIds={[service.serviceId]}
      />
    </div>
  );
}

export default ServiceDetail;
