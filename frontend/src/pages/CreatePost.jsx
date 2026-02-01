import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { posts } from '../services/api';
import Editor from '../components/Editor';

function CreatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'draft',
    tags: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await posts.getById(id);
      const post = response.data;
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        status: post.status,
        tags: post.tags || []
      });
    } catch (error) {
      alert('Error loading post');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'title' && !id) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataImage = new FormData();
    formDataImage.append('image', file);

    try {
      const response = await posts.uploadImage(formDataImage);
      setFormData(prev => ({
        ...prev,
        featuredImage: response.data.url
      }));
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await posts.update(id, formData);
      } else {
        await posts.create(formData);
      }
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <h1>CMS Dashboard</h1>
        <div className="navbar-links">
          <a href="/">Dashboard</a>
          <a href="/create">Create Post</a>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <h2>{id ? 'Edit Post' : 'Create New Post'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Content *</label>
              <Editor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              />
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && <p>Uploading...</p>}
              {formData.featuredImage && (
                <div className="image-preview">
                  <img src={formData.featuredImage} alt="Featured" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Saving...' : (id ? 'Update Post' : 'Create Post')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePost;