import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogData from '~/data/blogData';
import styles from './BlogDetail.module.scss';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    // Find the blog post by ID
    const blogPost = blogData.find(b => b.id === id);
    
    if (blogPost) {
      setBlog(blogPost);
      
      // Find related blogs (same category, exclude current)
      const related = blogData
        .filter(b => b.category === blogPost.category && b.id !== id)
        .slice(0, 3);
      
      setRelatedBlogs(related);
      
      // Scroll to top when blog changes
      window.scrollTo(0, 0);
    }
  }, [id]);

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (!blog) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className={styles.blogDetailContainer}>
      <div className={styles.blogHeader}>
        <Link to="/blog" className={styles.backButton}>
          ← Quay lại trang Blog
        </Link>
        <div className={styles.category}>
          <span>{blog.categoryName}</span>
        </div>
        <h1>{blog.title}</h1>
        <div className={styles.meta}>
          <div className={styles.author}>
            <img src={blog.authorImg} alt={blog.author} />
            <span>{blog.author}</span>
          </div>
          <div className={styles.metaInfo}>
            <span className={styles.date}>{formatDate(blog.date)}</span>
            <span className={styles.readingTime}>{blog.readingTime} phút đọc</span>
          </div>
        </div>
      </div>

      <div className={styles.featuredImage}>
        <img src={blog.img} alt={blog.title} />
      </div>

      <div className={styles.blogContent}>
        <div className={styles.contentText}>
          {blog.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {relatedBlogs.length > 0 && (
        <div className={styles.relatedPosts}>
          <h2>Bài Viết Liên Quan</h2>
          <div className={styles.relatedGrid}>
            {relatedBlogs.map(relatedBlog => (
              <div key={relatedBlog.id} className={styles.relatedCard}>
                <div className={styles.relatedImage}>
                  <img src={relatedBlog.img} alt={relatedBlog.title} />
                </div>
                <div className={styles.relatedContent}>
                  <h3>{relatedBlog.title}</h3>
                  <div className={styles.relatedMeta}>
                    <span>{formatDate(relatedBlog.date)}</span>
                    <span>{relatedBlog.readingTime} phút đọc</span>
                  </div>
                  <Link to={`/blog/${relatedBlog.id}`} className={styles.readMore}>
                    Đọc Tiếp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogDetail;