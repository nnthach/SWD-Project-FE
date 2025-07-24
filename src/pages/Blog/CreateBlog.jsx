import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';
import { createBlogAPI, getBlogDetailAPI, updateBlogAPI, getAllBlogsAPI, deleteBlogAPI } from '~/services/blogService';
import { toast } from 'react-toastify';
import styles from './CreateBlog.module.scss';

function CreateBlog() {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tittle: '',
    content: ''
  });
  
  // Fetch blog details if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchBlogDetail(id);
    }
    
    fetchBlogs();
  }, [id]);
  
  const fetchBlogDetail = async (blogId) => {
    try {
      setLoading(true);
      const response = await getBlogDetailAPI(blogId);
      console.log('Blog detail response:', response);
      
      let blogData = null;
      
      if (response && response.data) {
        if (response.data.blogId) {
          // Direct blog object
          blogData = response.data;
        } else if (response.data.$id && response.data.$values && Array.isArray(response.data.$values)) {
          // If it returns an array of blogs (unexpected but possible)
          blogData = response.data.$values.find(blog => blog.blogId === blogId);
        }
      }
      
      if (blogData) {
        setFormData({
          tittle: blogData.tittle || '',
          content: blogData.content || ''
        });
      } else {
        toast.error('Blog post not found');
      }
    } catch (error) {
      toast.error('Unable to load blog details');
      console.error('Error fetching blog details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogsAPI();
      
      console.log('Blog API response structure:', response);
      
      // Handle the specific nested response structure with $values array
      let blogData = [];
      
      if (response && response.data) {
        // Check for the nested $values array structure
        if (response.data.$values && Array.isArray(response.data.$values)) {
          blogData = response.data.$values;
          console.log('Found blog data in $values array:', blogData);
        } else if (Array.isArray(response.data)) {
          blogData = response.data;
        } else if (typeof response.data === 'object' && response.data.blogId) {
          // If it's a single blog object, wrap in array
          blogData = [response.data];
        }
      }
      
      setBlogs(blogData);
    } catch (error) {
      toast.error('Unable to load blog list');
      console.error('Error fetching blogs:', error);
      setBlogs([]); // Initialize as empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.tittle.trim() || !formData.content.trim()) {
      toast.error('Please enter both title and content');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        console.log('Updating blog with ID:', id);
        // Update existing blog
        const updateResponse = await updateBlogAPI(id, {
          tittle: formData.tittle,
          content: formData.content
        });
        console.log('Update response:', updateResponse);
        toast.success('Blog updated successfully');
        
        // Navigate back to blogs after successful edit
        navigate('/create-blog');
      } else {
        // Create new blog
        const blogData = {
          tittle: formData.tittle,
          content: formData.content,
          publistDate: new Date().toISOString(),
          userId: userId || "3fa85f64-5717-4562-b3fc-2c963f66afa6" // Use current user ID or default
        };
        
        const createResponse = await createBlogAPI(blogData);
        console.log('Create response:', createResponse);
        toast.success('Blog created successfully');
        
        // Reset form after successful creation
        setFormData({
          tittle: '',
          content: ''
        });
      }
      
      // Refresh blog list
      fetchBlogs();
      
    } catch (error) {
      toast.error(isEditMode ? 'Error updating blog' : 'Error creating blog');
      console.error('Error saving blog:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteBlogAPI(blogId);
      toast.success('Blog deleted successfully');
      
      // Refresh blog list
      fetchBlogs();
    } catch (error) {
      toast.error('Error deleting blog');
      console.error('Error deleting blog:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (blogId) => {
    navigate(`/blog/edit/${blogId}`);
  };
  
  const handleCancel = () => {
    if (isEditMode) {
      navigate('/blog');
    } else {
      setFormData({
        tittle: '',
        content: ''
      });
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className={styles.createBlogContainer}>
      <h1 className={styles.pageTitle}>
        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      <form onSubmit={handleSubmit} className={styles.blogForm}>
        <div className={styles.formGroup}>
          <label htmlFor="tittle">Title *</label>
          <input
            type="text"
            id="tittle"
            name="tittle"
            value={formData.tittle}
            onChange={handleInputChange}
            placeholder="Enter blog title"
            required
            disabled={loading || submitting}
            className={styles.titleInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Enter blog content"
            required
            disabled={loading || submitting}
            className={styles.contentTextarea}
            rows="15"
          />
        </div>
        
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || submitting}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || submitting}
            className={styles.submitButton}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update' : 'Publish'}
          </button>
        </div>
      </form>
      
      {!isEditMode && (
        <>
          <h2 className={styles.managementTitle}>Manage Blog Posts</h2>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <div className={styles.blogList}>
              <table className={styles.blogTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Author</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(blogs) ? blogs.map(blog => (
                    <tr key={blog.blogId}>
                      <td>{blog.tittle}</td>
                      <td>{formatDate(blog.publistDate)}</td>
                      <td>{blog.author ? blog.author.username : 'Unknown'}</td>
                      <td className={styles.actions}>
                        <button
                          onClick={() => handleEdit(blog.blogId)}
                          className={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.blogId)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className={styles.noBlogs}>
                        Unable to display data
                      </td>
                    </tr>
                  )}
                  
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan="4" className={styles.noBlogs}>
                        No blog posts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CreateBlog;