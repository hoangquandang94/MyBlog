import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminNewPost from './pages/AdminNewPost';
import AdminEditPost from './pages/AdminEditPost';
import AdminProfile from './pages/AdminProfile';
import AdminSidebar from './pages/AdminSidebar';
import AdminProjects from './pages/AdminProjects';
import AdminExperience from './pages/AdminExperience';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-slate-100 border-opacity-50 transition-all">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
            <Link to="/" className="text-2xl font-black tracking-tight text-slate-900">
              <span className="text-blue-600">My</span>Portfolio<span className="text-blue-600">.</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Home</Link>
              <Link to="/blog" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Blog</Link>
              <Link to="/admin" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-12 px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts/new" element={<AdminNewPost />} />
            <Route path="/admin/posts/edit/:id" element={<AdminEditPost />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/sidebar" element={<AdminSidebar />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/experience" element={<AdminExperience />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-slate-200 mt-20 py-10 text-center">
          <p className="text-slate-500 font-medium">© {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
