import { useState, useEffect, FormEvent } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../services/api';

interface Experience {
  id?: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/experiences');
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    try {
      if (editingExperience.id) {
        await api.put(`/experiences/${editingExperience.id}`, editingExperience);
        setMessage('Experience updated!');
      } else {
        await api.post('/experiences', editingExperience);
        setMessage('Experience added!');
      }
      setEditingExperience(null);
      fetchExperiences();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Save failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/experiences/${id}`);
      fetchExperiences();
      setMessage('Experience removed!');
    } catch (err) {
      setMessage('Delete failed.');
    }
  };

  const startNew = () => {
    setEditingExperience({
      company: '',
      role: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  if (loading) return <div className="p-8">Loading Experience...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Experience Management</h2>
          <p className="text-slate-500 mt-1">Manage your professional career timeline.</p>
        </div>
        <button 
          onClick={startNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          + Add Entry
        </button>
      </div>

      {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-8 text-center border border-emerald-100 font-medium shadow-sm">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Experience List */}
        <div className="space-y-4">
          {experiences.map(e => (
            <div key={e.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start group hover:border-indigo-200 transition-all">
              <div className="flex-1">
                <h4 className="font-bold text-xl text-slate-800">{e.role}</h4>
                <p className="text-sm text-indigo-500 font-bold uppercase tracking-widest mt-1">{e.company}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">
                  {new Date(e.startDate).toLocaleDateString()} — {e.endDate ? new Date(e.endDate).toLocaleDateString() : 'PRESENT'}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setEditingExperience(e)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                <button onClick={() => handleDelete(e.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">🗑️</button>
              </div>
            </div>
          ))}
          {experiences.length === 0 && <div className="text-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 italic">No experience entries yet.</div>}
        </div>

        {/* Editor Form */}
        {editingExperience && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-50 animate-slide-up sticky top-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-8">{editingExperience.id ? 'Edit' : 'New'} Experience</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Company</label>
                  <input 
                    className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={editingExperience.company}
                    onChange={e => setEditingExperience({...editingExperience, company: e.target.value})}
                    placeholder="e.g. Google"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Role</label>
                  <input 
                    className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={editingExperience.role}
                    onChange={e => setEditingExperience({...editingExperience, role: e.target.value})}
                    placeholder="e.g. Senior Dev"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Start Date</label>
                  <input 
                    type="date"
                    className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={editingExperience.startDate.split('T')[0]}
                    onChange={e => setEditingExperience({...editingExperience, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">End Date (Optional)</label>
                  <input 
                    type="date"
                    className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={editingExperience.endDate ? editingExperience.endDate.split('T')[0] : ''}
                    onChange={e => setEditingExperience({...editingExperience, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                  <ReactQuill 
                    theme="snow"
                    modules={quillModules}
                    value={editingExperience.description}
                    onChange={val => setEditingExperience({...editingExperience, description: val})}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95">
                  Save Entry
                </button>
                <button type="button" onClick={() => setEditingExperience(null)} className="px-8 border border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all">
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
