import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-emerald-500/10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Manabbondhu</span>
                <span className="block text-[10px] tracking-widest uppercase text-emerald-400">NGO</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Dedicated to serving communities through medical aid, nutritious food, educational materials, and hope for countless lives.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Services' },
                { to: '/membership', label: 'Membership' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                Kolkata, West Bengal, India
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                +91 XXXXX XXXXX
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                info@manabbondhu.org
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-10 h-10 rounded-lg bg-gray-900 hover:bg-emerald-600/20 border border-gray-800 hover:border-emerald-500/30 flex items-center justify-center transition-colors text-gray-500 hover:text-emerald-400"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Manabbondhu NGO. All rights reserved.
          </p>
          <Link
            to="/admin/login"
            className="text-xs text-gray-700 hover:text-emerald-500 transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
