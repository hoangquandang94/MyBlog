import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Removed ReactMarkdown import
import api from '../services/api';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    api.get(`/BlogPosts/${id}`).then(res => setPost(res.data)).catch(console.error);
  }, [id]);

  if (!post) return <div className="flex justify-center items-center h-64 text-slate-500 font-medium">Loading article...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link to="/blog" className="text-slate-500 hover:text-slate-800 font-medium mb-8 inline-flex items-center gap-2 transition-colors">
        <span>&larr;</span> Back to all articles
      </Link>
      
      <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        <header className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-full">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</span>
          </div>
        </header>
        
        <div 
          className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}
