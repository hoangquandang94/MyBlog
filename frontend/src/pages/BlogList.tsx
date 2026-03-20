import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/BlogPosts').then(res => setPosts(res.data.filter((p: any) => p.status === 2))).catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-slate-800 mb-8 border-b pb-4">Blog Posts</h2>
      {posts.map((post: any) => (
        <article key={post.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
          <Link to={`/blog/${post.id}`}>
            <h3 className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors mb-3">{post.title}</h3>
          </Link>
          <div className="text-sm text-slate-500 mb-5 flex items-center gap-3">
            <span className="font-medium bg-slate-100 px-3 py-1 rounded-full">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</span>
            {post.status === 2 && (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Published</span>
            )}
          </div>
          <p className="text-slate-600 leading-relaxed mb-6 text-lg">{post.summary}</p>
          <Link to={`/blog/${post.id}`} className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 group">
            Read Article <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </article>
      ))}
      {posts.length === 0 && <div className="text-slate-500 italic text-center py-12 bg-white rounded-2xl border border-slate-100">No blog posts available.</div>}
    </div>
  );
}
