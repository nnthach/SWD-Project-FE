import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.scss';


function ServiceCard({ item }) {
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
        <button>Book</button>
      </div>
    </div>
  );
}

export default ServiceCard;
