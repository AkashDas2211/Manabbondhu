import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogIn, AlertCircle, Eye, EyeOff, Crown, CheckCircle } from 'lucide-react';

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, authLoading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSetup) {
      await handleSetupAdmin();
      return;
    }

    if (isLogin) {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }
      navigate('/admin/dashboard');
    } else {
      const { error: authError } = await signUp(email, password, fullName);
      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }
      setIsLogin(true);
      setLoading(false);
    }
  }

  async function handleSetupAdmin() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/setup-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create admin account');
        setLoading(false);
        return;
      }

      setSetupSuccess(true);
      setLoading(false);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-[128px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Manabbondhu</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {isSetup ? 'Initial Admin Setup' : 'Admin Portal'}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            {isSetup
              ? 'Create the first admin account for your organization'
              : isLogin
              ? 'Sign in to access the admin dashboard'
              : 'Create an account'}
          </p>
        </div>

        {setupSuccess ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Admin Created!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your admin account has been set up. You can now sign in with your credentials.
            </p>
            <button
              onClick={() => {
                setIsSetup(false);
                setIsLogin(true);
                setSetupSuccess(false);
                setPassword('');
              }}
              className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {(isSetup || !isLogin) && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="Your full name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="admin@manabbondhu.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow pr-12"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSetup ? (
                  <>
                    <Crown className="w-4 h-4" />
                    Create Admin Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            {!isSetup && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            )}

            {!isLogin && !isSetup && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-400">
                  Note: New accounts are created as regular users. An existing admin must promote your account from the dashboard.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
            Back to website
          </Link>
          {!isSetup && !setupSuccess && (
            <>
              <span className="text-gray-800">|</span>
              <button
                onClick={() => {
                  setIsSetup(!isSetup);
                  setError('');
                  setIsLogin(true);
                }}
                className="text-sm text-gray-600 hover:text-emerald-400 transition-colors"
              >
                {isSetup ? 'Admin Login' : 'First-time Setup'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
