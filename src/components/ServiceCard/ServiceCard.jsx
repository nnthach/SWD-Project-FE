import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.scss';
import { useState } from 'react';
import BookingPopup from '../BookingPopup/BookingPopup';

import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function ServiceCard({ item }) {
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

  return (
    <div className={styles.wrap}>
      <h5>{item.serviceName}</h5>
      <p className={styles.price}>{item.price?.toLocaleString()} VND</p>
      <p className={styles.content}>{item.description}</p>

      <div className={styles['btn-wrap']}>
        <Link to={`/servicedetail/${item.serviceId}`} className={styles.detailBtn}>
          Detail
        </Link>
        <button onClick={() => setShowPopup(true)} className={styles.bookBtn}>
          Book
        </button>

        <BookingPopup 
          isOpen={showPopup} 
          onClose={() => setShowPopup(false)} 
          selectedServiceIds={[item.serviceId]} 
        />
      </div>
    </div>
  );
}

export default ServiceCard;
