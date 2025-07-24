import { Link } from 'react-router-dom';
import styles from './BlogCard.module.scss';

function BlogCard({ data }) {
  return (
    <div className={styles.blogCard}>
      <div className={styles.blogImage}>
        <img
          src="https://www.eprescribingtoolkit.com/wp-content/plugins/pt-content-views-pro/public/assets/images/default_image.png"
          alt=""
        />
        <span className={styles.category}>Category</span>
      </div>
      <div className={styles.blogContent}>
        <h3>{data.title}</h3>
        <p>{data.content}</p>
        <div className={styles.meta}>
          <div className={styles.author}>
            <img
              src="https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png"
              alt=""
            />
            <span>{data.author.username}</span>
          </div>
          <div className={styles.date}>
            <span>
              {new Date(data.publistDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className={styles.blogFooter}>
          <span className={styles.readingTime}>1 min read</span>
          <Link to={`/blog/${data.blogId}`} className={styles.readMore}>
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
