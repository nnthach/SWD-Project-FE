import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.scss';
import { useState } from 'react';
import BookingPopup from '../BookingPopup/BookingPopup';

function ServiceCard({ item }) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className={styles.wrap}>
      <h5>{item.serviceName}</h5>
      <p className={styles.price}>{item.price}VND</p>
      <p className={styles.content}>{item.description}</p>

      <div className={styles['btn-wrap']}>
        <Link to={`/servicedetail/${item.id}`} className={styles.detailBtn}>
          Detail
        </Link>
        <button onClick={() => setShowPopup(true)} className={styles.bookBtn}>Book</button>
        <BookingPopup isOpen={showPopup} onClose={() => setShowPopup(false)} serviceId={item.id}/>

      </div>
    </div>
  );
}

export default ServiceCard;
