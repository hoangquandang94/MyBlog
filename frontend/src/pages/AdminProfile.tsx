import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import api from '../services/api';

const COLORS = [
  { name: 'Maroon', value: '#8C3F3F' },
  { name: 'Navy', value: '#1A3350' },
  { name: 'Green', value: '#4B6B4B' },
  { name: 'Orange', value: '#D97E00' },
  { name: 'Brown', value: '#705E52' },
  { name: 'Grey', value: '#5D5D5D' },
];

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `http://localhost:5219${url}`;
  return url;
};

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    jobTitle: '',
    bio: '',
    profilePictureUrl: '',
    themeColor: '#8C3F3F'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/Profile');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/Profile', profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile.');
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await api.post('/Profile/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, profilePictureUrl: res.data.url });
      setMessage('Photo uploaded!');
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Profile & CV Settings</h2>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-center shadow-sm border ${
          message.includes('Error') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Photo Upload */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center">
            <div className="w-48 h-60 bg-slate-100 rounded-2xl mb-4 overflow-hidden border-4 border-white shadow-md relative group">
              {profile.profilePictureUrl ? (
                <img src={getImageUrl(profile.profilePictureUrl)} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                   <span className="text-4xl">👤</span>
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-semibold">
                Change Photo
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <p className="text-xs text-slate-500 text-center">Recommended: 4:5 aspect ratio (e.g. 800x1000px)</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Theme Color</h3>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setProfile({...profile, themeColor: c.value})}
                  className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                    profile.themeColor === c.value ? 'border-blue-500 scale-110 shadow-md' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info Fields */}
        <form onSubmit={handleSave} className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                value={profile.fullName}
                onChange={e => setProfile({...profile, fullName: e.target.value})}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                value={profile.jobTitle}
                onChange={e => setProfile({...profile, jobTitle: e.target.value})}
                placeholder="Full-stack Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Bio</label>
              <textarea
                rows={4}
                className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                placeholder="A brief introduction about yourself..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture URL (Manual Override)</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-100 text-slate-500 text-xs font-mono"
                value={profile.profilePictureUrl}
                onChange={e => setProfile({...profile, profilePictureUrl: e.target.value})}
                placeholder="/uploads/my-photo.png"
              />
              <p className="text-[10px] text-slate-400 mt-1 italic">Use this to manually specify a path or external URL if the upload fails.</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Save Changes
            </button>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <a href="/admin/sidebar" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">
                Sidebar Content →
              </a>
              <a href="/admin/projects" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">
                Projects Portfolio →
              </a>
              <a href="/admin/experience" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-[0.2em]">
                Work Experience →
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
