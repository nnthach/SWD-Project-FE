import { Link } from 'react-router-dom';
import styles from './BlogCard.module.scss';

function BlogCard() {
  return (
    <div className={styles.blogCard}>
      <div className={styles.blogImage}>
        <img src="" alt="" />
        <span className={styles.category}>HIV</span>
      </div>
      <div className={styles.blogContent}>
        <h3>Dấu hiệu bệnh lây truyền qua đường tình dục bạn</h3>
        <p>swd</p>
        <div className={styles.meta}>
          <div className={styles.author}>
            <img src="" alt="" />
            <span>Bac si</span>
          </div>
          <div className={styles.date}>
            <span>5 thang 11 2023</span>
          </div>
        </div>
        <div className={styles.blogFooter}>
          <span className={styles.readingTime}>50 phút đọc</span>
          <Link to={`/blog/123`} className={styles.readMore}>
            Đọc Tiếp
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
