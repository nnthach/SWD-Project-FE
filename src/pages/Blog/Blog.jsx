import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogData from '~/data/blogData';
import styles from './Blog.module.scss';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = [
    { id: 'all', name: 'Tất Cả' },
    { id: 'reproductive', name: 'Sức Khỏe Sinh Sản' },
    { id: 'sexual', name: 'Sức Khỏe Tình Dục' },
    { id: 'education', name: 'Giáo Dục Giới Tính' },
    { id: 'mental', name: 'Sức Khỏe Tâm Thần' }
  ];

  // Filter blogs based on category and search query
  useEffect(() => {
    let filtered = [...blogData];
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBlogs(filtered);
  }, [activeCategory, searchQuery]);

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogHeader}>
        <h1>Bài Viết Về Sức Khỏe</h1>
        <p>Khám phá thông tin và kiến thức về sức khỏe sinh sản, tình dục và tâm thần</p>
        
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.categoryFilter}>
        {categories.map(category => (
          <button 
            key={category.id} 
            className={activeCategory === category.id ? styles.active : ''}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className={styles.featuredPost}>
        {filteredBlogs.length > 0 && (
          <div className={styles.featuredCard}>
            <div className={styles.featuredImage}>
              <img src={filteredBlogs[0].img} alt={filteredBlogs[0].title} />
            </div>
            <div className={styles.featuredContent}>
              <span className={styles.category}>{filteredBlogs[0].categoryName}</span>
              <h2>{filteredBlogs[0].title}</h2>
              <p>{filteredBlogs[0].excerpt}</p>
              <div className={styles.meta}>
                <div className={styles.author}>
                  <img src={filteredBlogs[0].authorImg} alt={filteredBlogs[0].author} />
                  <span>{filteredBlogs[0].author}</span>
                </div>
                <div className={styles.date}>
                  <span>{formatDate(filteredBlogs[0].date)}</span>
                </div>
                <div className={styles.readingTime}>
                  <span>{filteredBlogs[0].readingTime} phút đọc</span>
                </div>
              </div>
              <Link to={`/blog/${filteredBlogs[0].id}`} className={styles.readMore}>
                Đọc Tiếp
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className={styles.blogGrid}>
        {filteredBlogs.slice(1).map(blog => (
          <div key={blog.id} className={styles.blogCard}>
            <div className={styles.blogImage}>
              <img src={blog.img} alt={blog.title} />
              <span className={styles.category}>{blog.categoryName}</span>
            </div>
            <div className={styles.blogContent}>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <div className={styles.meta}>
                <div className={styles.author}>
                  <img src={blog.authorImg} alt={blog.author} />
                  <span>{blog.author}</span>
                </div>
                <div className={styles.date}>
                  <span>{formatDate(blog.date)}</span>
                </div>
              </div>
              <div className={styles.blogFooter}>
                <span className={styles.readingTime}>{blog.readingTime} phút đọc</span>
                <Link to={`/blog/${blog.id}`} className={styles.readMore}>
                  Đọc Tiếp
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredBlogs.length === 0 && (
        <div className={styles.noResults}>
          <h3>Không tìm thấy bài viết nào phù hợp.</h3>
          <p>Vui lòng thử với từ khóa khác hoặc chọn danh mục khác.</p>
        </div>
      )}
    </div>
  );
}

export default Blog;