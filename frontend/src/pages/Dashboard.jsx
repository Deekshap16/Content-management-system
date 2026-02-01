import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { posts } from '../services/api';

function Dashboard() {
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await posts.getAll();
      setPostsList(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await posts.delete(id);
        fetchPosts();
      } catch (error) {
        alert('Error deleting post');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <nav className="navbar">
        <h1>CMS Dashboard</h1>
        <div className="navbar-links">
          <a href="/">Dashboard</a>
          <a href="/create">Create Post</a>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="header-actions">
          <h2>All Posts</h2>
          <button onClick={() => navigate('/create')} className="btn btn-primary">
            + New Post
          </button>
        </div>

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Author</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {postsList.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>
                    <span className={`badge badge-${post.status === 'published' ? 'success' : 'warning'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{post.author?.name}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="post-actions">
                      <button
                        onClick={() => navigate(`/edit/${post._id}`)}
                        className="btn btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {postsList.length === 0 && (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No posts yet. Create your first post!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;