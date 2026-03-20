import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/BlogPosts');
      setBlogPosts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-800">Admin Dashboard</h2>
        <button onClick={handleLogout} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-xl transition-colors">
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-bold text-slate-800">Manage Blog Posts</h3>
            <button onClick={() => navigate('/admin/posts/new')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-colors shadow-sm text-sm">
              + New Post
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider rounded-tl-xl text-center">Title</th>
                  <th className="px-6 py-4 bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Date</th>
                  <th className="px-6 py-4 bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider rounded-tr-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {blogPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {post.status === 2 ? 
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">Published</span> : 
                       post.status === 1 ?
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">Pending</span> :
                       post.status === 0 ?
                        <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">Draft</span> :
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">Archived</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                      <button onClick={() => navigate(`/admin/posts/edit/${post.id}`)} className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors">Edit</button>
                      <button onClick={async () => {
                        if (confirm('Are you sure you want to delete this post?')) {
                          try {
                            await api.delete(`/BlogPosts/${post.id}`);
                            fetchPosts();
                          } catch (e) {
                            alert('Failed to delete post');
                          }
                        }
                      }} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blogPosts.length === 0 && <div className="text-center py-10 text-slate-500 italic">No blog posts found.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
