import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Blog.module.scss';
import { getAllBlogsAPI } from '~/services/blogService';
import { toast } from 'react-toastify';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get unique categories
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'reproductive', name: 'Reproductive Health' },
    { id: 'sexual', name: 'Sexual Health' },
    { id: 'education', name: 'Sex Education' },
    { id: 'mental', name: 'Mental Health' }
  ];

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getAllBlogsAPI();
        
        // Debug response
        console.log('Blog API response:', response);
        
        // Handle the specific nested response structure
        let blogData = [];
        
        if (response && response.data) {
          // Check for the nested $values array structure
          if (response.data.$values && Array.isArray(response.data.$values)) {
            blogData = response.data.$values;
            console.log('Found blog data in $values array:', blogData);
          } else if (Array.isArray(response.data)) {
            blogData = response.data;
          } else if (typeof response.data === 'object') {
            // If single blog object is returned
            blogData = [response.data];
          }
        }
        
        if (blogData.length > 0) {
          // Transform the API response to match the expected format
          const transformedBlogs = blogData.map(blog => ({
            id: blog.blogId,
            title: blog.tittle || 'Untitled', // Note: API has a typo in "tittle"
            excerpt: blog.content && blog.content.length > 150 
              ? blog.content.substring(0, 150) + '...' 
              : blog.content || 'No content available',
            content: blog.content || 'No content available',
            date: blog.publistDate || new Date().toISOString(),
            author: blog.author?.username || 'Unknown Author',
            authorImg: 'https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png',
            category: getCategoryFromTitle(blog.tittle || ''),
            categoryName: getCategoryNameFromTitle(blog.tittle || ''),
            img: 'https://www.eprescribingtoolkit.com/wp-content/plugins/pt-content-views-pro/public/assets/images/default_image.png',
            readingTime: calculateReadingTime(blog.content || ''),
          }));
          
          console.log('Transformed blogs:', transformedBlogs);
          setBlogs(transformedBlogs);
          setFilteredBlogs(transformedBlogs);
        } else {
          setBlogs([]);
          setFilteredBlogs([]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
        toast.error('An error occurred while loading blog posts.');
        setBlogs([]);
        setFilteredBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  // Helper function to determine category from blog title
  const getCategoryFromTitle = (title) => {
    title = title.toLowerCase();
    if (title.includes('mental') || title.includes('tâm thần')) return 'mental';
    if (title.includes('sex') || title.includes('tình dục')) return 'sexual';
    if (title.includes('reproductive') || title.includes('sinh sản')) return 'reproductive';
    if (title.includes('education') || title.includes('giáo dục')) return 'education';
    return 'all'; // Default category
  };
  
  // Get category name from category ID
  const getCategoryNameFromTitle = (title) => {
    const categoryId = getCategoryFromTitle(title);
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'All';
  };
  
  // Calculate reading time based on content length (rough estimate)
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute) || 1; // At least 1 minute
  };

  // Filter blogs based on category and search query
  useEffect(() => {
    let filtered = [...blogs];
    
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
  }, [activeCategory, searchQuery, blogs]);

  // Format date with error handling
  const formatDate = (dateStr) => {
    if (!dateStr) {
      return 'No date'; // Handle null or undefined dates
    }
    
    try {
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateStr);
      return 'Invalid date';
    }
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogHeader}>
        <h1>Health Articles</h1>
        <p>Explore information and knowledge about reproductive health, sexual health, and mental health</p>
        
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search articles..." 
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

      {loading ? (
        <div className={styles.loading}>
          <p>Loading articles...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      ) : (
        <>
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
                      <span>{filteredBlogs[0].readingTime} min read</span>
                    </div>
                  </div>
                  <Link to={`/blog/${filteredBlogs[0].id}`} className={styles.readMore}>
                    Read More
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
                    <span className={styles.readingTime}>{blog.readingTime} min read</span>
                    <Link to={`/blog/${blog.id}`} className={styles.readMore}>
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBlogs.length === 0 && (
            <div className={styles.noResults}>
              <h3>No matching articles found.</h3>
              <p>Please try a different keyword or select another category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Blog;