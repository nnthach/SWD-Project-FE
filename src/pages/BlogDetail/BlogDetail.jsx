import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogDetailAPI, getAllBlogsAPI } from '~/services/blogService';
import styles from './BlogDetail.module.scss';
import { toast } from 'react-toastify';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get category name from category ID
  const getCategoryName = (categoryId) => {
    const categories = {
      'all': 'Tất Cả',
      'reproductive': 'Sức Khỏe Sinh Sản',
      'sexual': 'Sức Khỏe Tình Dục', 
      'education': 'Giáo Dục Giới Tính',
      'mental': 'Sức Khỏe Tâm Thần'
    };
    return categories[categoryId] || 'Tất Cả';
  };

  // Helper function to determine category from blog title
  const getCategoryFromTitle = (title) => {
    title = title.toLowerCase();
    if (title.includes('mental') || title.includes('tâm thần')) return 'mental';
    if (title.includes('sex') || title.includes('tình dục')) return 'sexual';
    if (title.includes('reproductive') || title.includes('sinh sản')) return 'reproductive';
    if (title.includes('education') || title.includes('giáo dục')) return 'education';
    return 'all'; // Default category
  };
  
  // Calculate reading time based on content length
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute) || 1; // At least 1 minute
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific blog
        const response = await getBlogDetailAPI(id);
        
        if (response && response.data) {
          const blogData = response.data;
          const category = getCategoryFromTitle(blogData.tittle);
          
          // Transform API response to match expected format
          const transformedBlog = {
            id: blogData.blogId,
            title: blogData.tittle,
            content: blogData.content,
            date: blogData.publistDate,
            author: blogData.author ? blogData.author.username : "Unknown Author", // Add null check
            authorImg: 'https://via.placeholder.com/50',
            category: category,
            categoryName: getCategoryName(category),
            img: 'https://via.placeholder.com/800x400',
            readingTime: calculateReadingTime(blogData.content),
          };
          
          setBlog(transformedBlog);
          
          // Fetch all blogs to find related ones
          const allBlogsResponse = await getAllBlogsAPI();
          if (allBlogsResponse && allBlogsResponse.data) {
            const allBlogs = allBlogsResponse.data;
            
            // Find related blogs (same category, exclude current)
            const relatedBlogsData = allBlogs
              .filter(b => {
                const blogCategory = getCategoryFromTitle(b.tittle);
                return blogCategory === category && b.blogId !== id;
              })
              .slice(0, 3)
              .map(blog => ({
                id: blog.blogId,
                title: blog.tittle,
                excerpt: blog.content.substring(0, 120) + '...',
                date: blog.publistDate,
                author: blog.author ? blog.author.username : "Unknown Author", // Add null check
                authorImg: 'https://via.placeholder.com/50',
                category: getCategoryFromTitle(blog.tittle),
                categoryName: getCategoryName(getCategoryFromTitle(blog.tittle)),
                img: 'https://via.placeholder.com/400x300',
                readingTime: calculateReadingTime(blog.content),
              }));
            
            setRelatedBlogs(relatedBlogsData);
          }
        }
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError('Failed to load blog details. Please try again later.');
        toast.error('Có lỗi xảy ra khi tải bài viết.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBlogDetail();
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

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Link to="/blog" className={styles.backButton}>
          ← Quay lại trang Blog
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h2>Không tìm thấy bài viết</h2>
        <p>Bài viết không tồn tại hoặc đã bị xóa.</p>
        <Link to="/blog" className={styles.backButton}>
          ← Quay lại trang Blog
        </Link>
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