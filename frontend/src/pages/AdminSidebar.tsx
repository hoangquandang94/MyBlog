import { useState, useEffect, FormEvent } from 'react';
import api from '../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface SidebarSection {
  id?: string;
  title: string;
  content: string;
  icon: string;
  order: number;
  componentType: 'List' | 'Tags' | 'Text';
}

const COMMON_ICONS = [
  { label: 'Folder', value: '📁' },
  { label: 'Phone', value: '📞' },
  { label: 'Email', value: '📧' },
  { label: 'Pin', value: '📍' },
  { label: 'Star', value: '⭐' },
  { label: 'Code', value: '💻' },
  { label: 'Heart', value: '❤️' },
  { label: 'Web', value: '🌐' },
  { label: 'Flash', value: '⚡' },
  { label: 'Award', value: '🏆' },
  { label: 'Book', value: '📚' },
  { label: 'Tool', value: '🛠️' },
  { label: 'Link', value: '🔗' },
];

export default function AdminSidebar() {
  const [sections, setSections] = useState<SidebarSection[]>([]);
  const [editingSection, setEditingSection] = useState<SidebarSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await api.get('/Sidebar');
      setSections(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      if (editingSection.id) {
        await api.put(`/Sidebar/${editingSection.id}`, editingSection);
        setMessage('Section updated!');
      } else {
        await api.post('/Sidebar', editingSection);
        setMessage('Section created!');
      }
      setEditingSection(null);
      fetchSections();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving section.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/Sidebar/${id}`);
      fetchSections();
      setMessage('Section deleted!');
    } catch (err) {
      setMessage('Delete failed.');
    }
  };

  const startNew = () => {
    setEditingSection({
      title: '',
      content: '',
      icon: '📁',
      order: sections.length,
      componentType: 'List'
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Sidebar Design</h2>
          <p className="text-slate-500 mt-1">Customize your CV sidebar sections and layout.</p>
        </div>
        <button 
          onClick={startNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          + Create Section
        </button>
      </div>

      {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-8 text-center border border-emerald-100 font-medium shadow-sm">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* List of Sections */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Active Sections</h3>
          {sections.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl text-2xl shadow-inner">{s.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-800">{s.title}</h4>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{s.componentType}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditingSection(s)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button onClick={() => handleDelete(s.id!)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}
          {sections.length === 0 && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center">
               <p className="text-slate-400 font-medium">No sections yet. Start by adding one!</p>
            </div>
          )}
        </div>

        {/* Editor Form */}
        <div className="lg:col-span-3">
          {editingSection ? (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-50 border border-slate-50 animate-slide-up">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800">{editingSection.id ? 'Edit' : 'Configure'} Section</h3>
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-widest">{editingSection.componentType} Mode</span>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Section Title</label>
                    <input 
                      className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                      value={editingSection.title}
                      onChange={e => setEditingSection({...editingSection, title: e.target.value})}
                      placeholder="e.g. Technical Skills"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Display Type</label>
                    <select 
                      className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                      value={editingSection.componentType}
                      onChange={e => setEditingSection({...editingSection, componentType: e.target.value as any})}
                    >
                      <option value="List">Bullet Point List</option>
                      <option value="Tags">Interactive Tag Cloud</option>
                      <option value="Text">Rich Text Content</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Icon Picker</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    {COMMON_ICONS.map(icon => (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => setEditingSection({...editingSection, icon: icon.value})}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${editingSection.icon === icon.value ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-white hover:bg-indigo-50 text-slate-600 border border-slate-100'}`}
                        title={icon.label}
                      >
                        {icon.value}
                      </button>
                    ))}
                    <input 
                      className="w-12 h-10 border border-slate-200 rounded-xl p-1 text-center bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editingSection.icon}
                      onChange={e => setEditingSection({...editingSection, icon: e.target.value})}
                      placeholder="😊"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Section Content</label>
                    <span className="text-[10px] text-slate-400 italic">
                      {editingSection.componentType === 'Text' ? 'Supports rich formatting' : 'Separate items with commas'}
                    </span>
                  </div>
                  
                  {editingSection.componentType === 'Text' ? (
                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                      <ReactQuill 
                        theme="snow"
                        value={editingSection.content}
                        onChange={(content) => setEditingSection({...editingSection, content})}
                        className="bg-white"
                        placeholder="Share your story or extra details..."
                      />
                    </div>
                  ) : (
                    <textarea 
                      rows={4}
                      className="w-full border border-slate-200 rounded-2xl p-4 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
                      value={editingSection.content}
                      onChange={e => setEditingSection({...editingSection, content: e.target.value})}
                      placeholder={editingSection.componentType === 'Tags' ? "React, ASP.NET, Tailwind..." : "Chess, Guitar, Travels..."}
                      required
                    />
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                    {editingSection.id ? 'Apply Changes' : 'Initialize Section'}
                  </button>
                  <button type="button" onClick={() => setEditingSection(null)} className="px-8 border border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all">
                    Discard
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-indigo-50/50 border-2 border-dashed border-indigo-100 p-20 rounded-[3rem] text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-indigo-100/50 mb-2">⚡</div>
              <h3 className="text-xl font-bold text-indigo-900">Custom Section Editor</h3>
              <p className="max-w-xs text-indigo-400 text-sm leading-relaxed">Select a section from the left to edit or click the button above to create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
