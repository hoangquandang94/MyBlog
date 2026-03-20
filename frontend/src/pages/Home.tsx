import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Profile {
  fullName: string;
  jobTitle: string;
  bio: string;
  profilePictureUrl: string;
  themeColor: string;
}

interface SidebarSection {
  id: string;
  title: string;
  content: string;
  icon: string;
  order: number;
  componentType: 'List' | 'Tags' | 'Text';
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
}

const tagColors = [
  'bg-emerald-50 text-emerald-600 border-emerald-100',
  'bg-blue-50 text-blue-600 border-blue-100',
  'bg-indigo-50 text-indigo-600 border-indigo-100',
  'bg-violet-50 text-violet-600 border-violet-100',
  'bg-amber-50 text-amber-600 border-amber-100',
  'bg-rose-50 text-rose-600 border-rose-100',
];

const getTagColor = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
};

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `http://localhost:5219${url}`;
  return url;
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sections, setSections] = useState<SidebarSection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, sideRes, projRes, expRes] = await Promise.all([
        api.get('/Profile'),
        api.get('/Sidebar'),
        api.get('/projects'),
        api.get('/experiences')
      ]);
      setProfile(profRes.data);
      setSections(sideRes.data.sort((a: any, b: any) => a.order - b.order));
      setProjects(projRes.data);
      setExperiences(expRes.data);
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400 animate-pulse">
      Loading Portfolio...
    </div>
  );

  const themeColor = profile.themeColor || '#8C3F3F';

  return (
    <div className="min-h-screen bg-white flex justify-center p-0 md:p-12 font-sans selection:bg-slate-900 selection:text-white">
      <div className="w-full max-w-7xl bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* LEFT SIDEBAR (30%) */}
        <div className="w-full md:w-[30%] bg-slate-50 border-r border-slate-100 flex flex-col">
          {/* Profile Pic */}
          <div className="aspect-[4/5] w-full bg-slate-200 overflow-hidden relative border-b border-slate-200">
            {profile.profilePictureUrl ? (
              <img src={getImageUrl(profile.profilePictureUrl)} className="w-full h-full object-cover" alt={profile.fullName} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-6xl bg-slate-100">👤</div>
            )}
          </div>

          <div className="p-10 space-y-12 flex-grow">
            {sections.map(section => (
              <section key={section.id} className="animate-fade-in">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-slate-400">
                  <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{section.icon}</span>
                  {section.title}
                </h3>
                
                {section.componentType === 'List' && (
                  <ul className="space-y-4 text-sm font-bold text-slate-700">
                    {section.content.split('\n').filter(l => l.trim()).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.componentType === 'Tags' && (
                  <div className="flex flex-wrap gap-2">
                    {section.content.split(',').map((tag, idx) => (
                      <span key={idx} className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 cursor-default ${getTagColor(tag)}`}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {section.componentType === 'Text' && (
                  <div 
                    className="text-sm text-slate-600 leading-[1.8] prose prose-sm prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </section>
            ))}

            {sections.length === 0 && (
              <div className="text-xs text-slate-400 italic text-center py-4 border-2 border-dashed border-slate-200 rounded-2xl">
                No regions added. Use Admin Panel to populate sidebar.
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT (70%) */}
        <div className="w-full md:w-[70%] flex flex-col">
          {/* Header Strip */}
          <div className="bg-slate-50 p-12 border-b border-slate-200">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 uppercase">{profile.fullName}</h1>
            <p className="text-xl font-bold uppercase tracking-[0.3em]" style={{ color: themeColor }}>{profile.jobTitle}</p>
          </div>

          <div className="p-12 space-y-16 flex-grow">
            {/* About Me */}
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4 text-slate-900">
                Personal Summary
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line text-lg font-medium">
                {profile.bio}
              </p>
            </section>

            {/* Work Experience */}
            {experiences.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 text-slate-900">
                  Career Journey
                  <div className="flex-1 h-[1px] bg-slate-200"></div>
                </h2>
                <div className="space-y-12">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-10 border-l-2 border-slate-100 group">
                      <div className="absolute w-4 h-4 bg-white border-4 border-slate-900 rounded-full -left-[9px] top-1 group-hover:scale-125 transition-transform" style={{ borderColor: themeColor }}></div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                        <h4 className="font-black text-2xl text-slate-800">{exp.role}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          {new Date(exp.startDate).getFullYear()} — {exp.endDate ? new Date(exp.endDate).getFullYear() : 'PRESENT'}
                        </span>
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: themeColor }}>{exp.company}</p>
                      <div 
                        className="text-slate-600 leading-relaxed text-lg max-w-2xl prose prose-slate prose-sm md:prose-base prose-p:leading-relaxed prose-li:my-1"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Highlight Projects */}
            {projects.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 text-slate-900">
                  Featured Projects
                  <div className="flex-1 h-[1px] bg-slate-200"></div>
                </h2>
                <div className="grid grid-cols-1 gap-8">
                  {projects.map((proj) => (
                    <div key={proj.id} className="group p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                        <h4 className="font-black text-3xl text-slate-900">{proj.title}</h4>
                        <div className="flex flex-wrap gap-2">
                          {proj.tags.split(',').map((tag, i) => (
                            <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-400 group-hover:text-slate-800 transition-colors">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 mb-8 text-lg leading-relaxed">{proj.description}</p>
                      {proj.projectUrl && (
                        <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform underline decoration-2 underline-offset-8" style={{ color: themeColor }}>
                          Explore Details →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="pt-12 flex justify-center gap-8">
              <Link to="/blog" className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-black transition-all shadow-xl hover:shadow-slate-300 active:scale-95">
                Read My Blog
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="p-10 text-center text-[9px] text-slate-400 uppercase tracking-[0.5em] border-t border-slate-100 bg-slate-50/50">
            © {new Date().getFullYear()} {profile.fullName}. Crafted with Precision.
          </footer>
        </div>
      </div>
    </div>
  );
}
