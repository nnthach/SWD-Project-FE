import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.scss';
import { useState } from 'react';
import BookingPopup from '../BookingPopup/BookingPopup';

function ServiceCard({ item }) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className={styles.wrap}>
      <h5>{item.name}</h5>
      <p className={styles.price}>{item.price}VND</p>
      <p className={styles.content}>{item.description}</p>

      <div className={styles['btn-wrap']}>
        <button>
          <Link to={`/servicedetail/${item.id}`} style={{ color: 'black', textDecoration: 'none' }}>
            Detail
          </Link>
        </button>
        <button onClick={() => setShowPopup(true)}>Book</button>
        <BookingPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      </div>
    </div>
  );
}

export default ServiceCard;
