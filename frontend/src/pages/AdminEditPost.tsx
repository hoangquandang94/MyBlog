import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../services/api';

export default function AdminEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(0);
  const [publishedAt, setPublishedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/BlogPosts/${id}`);
      const post = res.data;
      setTitle(post.title);
      setSummary(post.summary);
      setContent(post.content);
      setStatus(post.status);
      if (post.publishedAt) {
        setPublishedAt(new Date(post.publishedAt).toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to load post');
      navigate('/admin');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalPublishedAt = null;
      if (status === 2) {
        finalPublishedAt = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
      }

      await api.put(`/BlogPosts/${id}`, {
        id,
        title,
        summary,
        content,
        status,
        publishedAt: finalPublishedAt,
      });
      navigate('/admin');
    } catch (error) {
      console.error('Failed to update post', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (fetching) {
    return <div className="text-center py-20 animate-pulse text-lg font-medium text-slate-500">Loading editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-800">Edit Post</h2>
        <button onClick={() => navigate('/admin')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-xl transition-colors">
          Back
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Summary</label>
            <textarea 
              required
              rows={3}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Content (HTML Editor)</label>
            <div className="bg-white rounded-xl mb-12">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                className="h-[400px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 pt-8 border-t border-slate-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select 
                value={status}
                onChange={e => setStatus(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value={0}>Draft</option>
                <option value={1}>Pending Review</option>
                <option value={2}>Published</option>
                <option value={3}>Archived</option>
              </select>
            </div>
            
            {status === 2 && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Publish Date</label>
                <input 
                  type="date"
                  value={publishedAt}
                  onChange={e => setPublishedAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                />
              </div>
            )}
          </div>

          <div className="pt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
