import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/membership', label: 'Membership' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-emerald-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/mblogo-removebg-preview.png"
              alt="Manabbondhu Logo"
              className="h-10 w-auto"
            />
            <div>
              <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                Manabbondhu
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-emerald-400 hidden sm:block">
                NGO
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-gray-400 hover:text-emerald-400 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/20"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-emerald-500/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-emerald-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-600/20 hover:bg-emerald-600/30 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
