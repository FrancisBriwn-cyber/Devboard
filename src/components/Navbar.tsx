import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/tracker', label: 'Tracker' },
  { path: '/jobs', label: 'Jobs' },
  { path: '/news', label: 'News' },
  { path: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const profile = useAuthStore((s) => s.profile);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-8 py-3 flex justify-between items-center">

        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200">
            D
          </span>
          <span className="text-lg font-bold text-slate-800 tracking-tight">DevBoard</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/profile">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-blue-100 hover:border-blue-400 transition-all shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold hover:bg-blue-200 transition-all">
                ?
              </div>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}
