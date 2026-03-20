import { useState, useEffect, FormEvent } from 'react';
import api from '../services/api';

interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags: string;
  createdAt?: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (editingProject.id) {
        await api.put(`/projects/${editingProject.id}`, editingProject);
        setMessage('Project updated!');
      } else {
        await api.post('/projects', editingProject);
        setMessage('Project created!');
      }
      setEditingProject(null);
      fetchProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Save failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
      setMessage('Project removed!');
    } catch (err) {
      setMessage('Delete failed.');
    }
  };

  const startNew = () => {
    setEditingProject({
      title: '',
      description: '',
      imageUrl: '',
      projectUrl: '',
      tags: ''
    });
  };

  if (loading) return <div className="p-8">Loading Projects...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Project Management</h2>
          <p className="text-slate-500 mt-1">Showcase your best work on your portfolio.</p>
        </div>
        <button 
          onClick={startNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          + Add Project
        </button>
      </div>

      {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-8 text-center border border-emerald-100 font-medium">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Project List */}
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start group hover:border-blue-200 transition-all">
              <div className="flex-1">
                <h4 className="font-bold text-xl text-slate-800">{p.title}</h4>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1 mb-2">{p.tags || 'No Tags'}</p>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setEditingProject(p)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">✏️</button>
                <button onClick={() => handleDelete(p.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">🗑️</button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <div className="text-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 italic">No projects added yet.</div>}
        </div>

        {/* Editor Form */}
        {editingProject && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-50 animate-slide-up sticky top-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-8">{editingProject.id ? 'Edit' : 'New'} Project</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Project Title</label>
                <input 
                  className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={editingProject.title}
                  onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                  placeholder="e.g. Personal Portfolio"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Technologies (Comma separated)</label>
                <input 
                  className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={editingProject.tags}
                  onChange={e => setEditingProject({...editingProject, tags: e.target.value})}
                  placeholder="React, .NET 8, Tailwind"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <textarea 
                  rows={4}
                  className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={editingProject.description}
                  onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                  placeholder="Tell us about this project..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Project URL</label>
                <input 
                  className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={editingProject.projectUrl}
                  onChange={e => setEditingProject({...editingProject, projectUrl: e.target.value})}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">
                  Save Project
                </button>
                <button type="button" onClick={() => setEditingProject(null)} className="px-8 border border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
